import os
import re
import json
import hashlib
import secrets
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Optional

import jwt
from dotenv import load_dotenv
from openai import OpenAI
import requests
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from sqlalchemy import (
    create_engine, String, Text, Integer, Boolean, DateTime,
    ForeignKey, select, or_
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, Session, sessionmaker
from pypdf import PdfReader
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# ---------------------------------------------------------
# Configurations
# ---------------------------------------------------------
BASE = Path(__file__).resolve().parent
load_dotenv(BASE / ".env")
NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY")
NVIDIA_MODEL = os.getenv("NVIDIA_MODEL", "nvidia/nemotron-3.5-lightning-30b-a3b")
TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")
TAVILY_MAX_RESULTS = int(os.getenv("TAVILY_MAX_RESULTS", "6"))

NVIDIA_BASE_URL = os.getenv(
    "NVIDIA_BASE_URL",
    "https://integrate.api.nvidia.com/v1"
)

nim_client = (
    OpenAI(
        base_url=NVIDIA_BASE_URL,
        api_key=NVIDIA_API_KEY,
        timeout=35.0,
        max_retries=1,
    )
    if NVIDIA_API_KEY
    else None
)

DATA = BASE.parent / "data"
UPLOADS = DATA / "uploads"
UPLOADS.mkdir(parents=True, exist_ok=True)

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./bis_intelligence.db")
JWT_SECRET = os.getenv("JWT_SECRET", "dev-secret-change-me")
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "admin@bis-intelligence.local")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "Admin@12345")

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


# ---------------------------------------------------------
# Database models
# ---------------------------------------------------------
class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    role: Mapped[str] = mapped_column(String(30), default="USER")
    language: Mapped[str] = mapped_column(String(10), default="en")
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc)
    )


class Document(Base):
    __tablename__ = "documents"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(500))
    standard_number: Mapped[Optional[str]] = mapped_column(
        String(100), nullable=True, index=True
    )
    category: Mapped[str] = mapped_column(String(150), default="General")
    version: Mapped[str] = mapped_column(String(100), default="Demo")
    source_url: Mapped[str] = mapped_column(
        String(1000), default="https://www.bis.gov.in/"
    )
    source_type: Mapped[str] = mapped_column(String(100), default="BIS Official")
    status: Mapped[str] = mapped_column(String(30), default="CURRENT")
    content: Mapped[str] = mapped_column(Text)
    content_hash: Mapped[str] = mapped_column(String(64))
    verified: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc)
    )


class Chunk(Base):
    __tablename__ = "chunks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    document_id: Mapped[int] = mapped_column(
        ForeignKey("documents.id"), index=True
    )
    text: Mapped[str] = mapped_column(Text)
    page: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    section: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)


class QueryLog(Base):
    __tablename__ = "query_logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    query: Mapped[str] = mapped_column(Text)
    intent: Mapped[str] = mapped_column(String(60), default="GENERAL_BIS_QUERY")
    confidence: Mapped[str] = mapped_column(String(20), default="LOW")
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc)
    )


Base.metadata.create_all(engine)


# ---------------------------------------------------------
# Dependencies / security
# ---------------------------------------------------------
def db():
    s = SessionLocal()
    try:
        yield s
    finally:
        s.close()


def hash_password(password: str, salt: Optional[bytes] = None):
    salt = salt or secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac(
        "sha256", password.encode(), salt, 120_000
    )
    return salt.hex() + ":" + digest.hex()


def verify_password(password: str, stored: str):
    try:
        salt_hex, digest_hex = stored.split(":", 1)
        test = hashlib.pbkdf2_hmac(
            "sha256",
            password.encode(),
            bytes.fromhex(salt_hex),
            120_000,
        ).hex()
        return secrets.compare_digest(test, digest_hex)
    except Exception:
        return False


def token_for(user: User):
    payload = {
        "sub": str(user.id),
        "role": user.role,
        "exp": datetime.now(timezone.utc) + timedelta(hours=12),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")


bearer = HTTPBearer(auto_error=False)


def current_user(
    creds: HTTPAuthorizationCredentials = Depends(bearer),
    s: Session = Depends(db),
):
    if not creds:
        return None

    try:
        data = jwt.decode(
            creds.credentials,
            JWT_SECRET,
            algorithms=["HS256"],
        )
        return s.get(User, int(data["sub"]))
    except Exception:
        return None


def require_admin(u=Depends(current_user)):
    if not u or u.role != "ADMIN":
        raise HTTPException(403, "Admin access required")
    return u


# ---------------------------------------------------------
# FastAPI
# ---------------------------------------------------------
app = FastAPI(
    title="BIS Intelligence API",
    version="2.0.0",
    description="Evidence-first BIS standards intelligence and compliance prototype",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5500",
        "http://127.0.0.1:5500",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------
# Multilingual UI messages
# ---------------------------------------------------------
translations = {
    "en": {
        "insufficient": (
            "I could not verify this from the available authoritative "
            "knowledge base. I will not invent a compliance answer."
        ),
        "match": "Potentially applicable standard",
        "why": "Why it matches",
        "roadmap": "Compliance roadmap",
    },
    "hi": {
        "insufficient": (
            "उपलब्ध आधिकारिक ज्ञान आधार से मैं इसे सत्यापित नहीं कर सका। "
            "मैं बिना प्रमाण के अनुपालन उत्तर नहीं बनाऊँगा।"
        ),
        "match": "संभावित रूप से लागू मानक",
        "why": "यह क्यों मेल खाता है",
        "roadmap": "अनुपालन रोडमैप",
    },
    "mr": {
        "insufficient": (
            "उपलब्ध अधिकृत ज्ञानस्रोतांमधून हे सत्यापित करता आले नाही. "
            "पुराव्याशिवाय अनुपालनाचे उत्तर दिले जाणार नाही."
        ),
        "match": "संभाव्यतः लागू मानक",
        "why": "हे का जुळते",
        "roadmap": "अनुपालन रोडमॅप",
    },
}


# ---------------------------------------------------------
# Intent detection
# ---------------------------------------------------------
def infer_intent(q: str):
    ql = q.lower()

    if any(x in ql for x in [
        "standard", "is ", "मानक", "स्टँडर्ड"
    ]):
        return "FIND_STANDARD"

    if any(x in ql for x in [
        "certif", "licen", "प्रमाण", "लायसन्स"
    ]):
        return "CHECK_CERTIFICATION"

    if any(x in ql for x in [
        "test", "testing", "lab", "परीक्षण", "प्रयोगशाळा"
    ]):
        return "TESTING_REQUIREMENTS"

    if any(x in ql for x in [
        "compare", "difference", "तुलना"
    ]):
        return "STANDARD_COMPARISON"

    if any(x in ql for x in [
        "document", "pdf", "दस्तऐवज"
    ]):
        return "DOCUMENT_EXPLANATION"

    return "GENERAL_BIS_QUERY"


# ---------------------------------------------------------
# RAG helpers
# ---------------------------------------------------------
def normalize_text(text: str) -> str:
    text = text.replace("\x00", " ")
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def chunk_text(text: str, size: int = 1000, overlap: int = 150):
    """Create overlapping chunks so retrieval can return precise evidence."""
    text = normalize_text(text)

    if not text:
        return []

    if overlap >= size:
        overlap = max(0, size // 5)

    chunks = []
    start = 0

    while start < len(text):
        end = min(start + size, len(text))
        piece = text[start:end].strip()

        if piece:
            chunks.append(piece)

        if end >= len(text):
            break

        start = max(end - overlap, start + 1)

    return chunks


def retrieve_chunks(s: Session, q: str, k: int = 8):
    """
    Real local RAG retrieval:
    query -> TF-IDF over stored chunks -> cosine similarity -> evidence.
    Only CURRENT documents are searched.
    """
    rows = s.execute(
        select(Chunk, Document)
        .join(Document, Chunk.document_id == Document.id)
        .where(Document.status == "CURRENT")
    ).all()

    if not rows:
        return []

    texts = [
        f"{doc.title} {doc.standard_number or ''} "
        f"{doc.category} {chunk.section or ''} {chunk.text}"
        for chunk, doc in rows
    ]

    vectorizer = TfidfVectorizer(
        stop_words="english",
        ngram_range=(1, 2),
        max_features=12000,
    )

    try:
        matrix = vectorizer.fit_transform(texts + [q])
    except ValueError:
        return []

    scores = cosine_similarity(
        matrix[-1],
        matrix[:-1],
    ).flatten()

    order = scores.argsort()[::-1]

    results = []

    for idx in order:
        score = float(scores[idx])

        if score <= 0:
            continue

        chunk, doc = rows[idx]

        results.append({
            "chunk": chunk,
            "document": doc,
            "score": score,
        })

        if len(results) >= k:
            break

    return results


def confidence_from_score(score: float) -> str:
    if score >= 0.35:
        return "HIGH"
    if score >= 0.12:
        return "MEDIUM"
    return "LOW"


def evidence_payload(item):
    chunk = item["chunk"]
    doc = item["document"]
    score = item["score"]

    return {
        "chunk_id": chunk.id,
        "document_id": doc.id,
        "standard": doc.standard_number,
        "title": doc.title,
        "category": doc.category,
        "version": doc.version,
        "status": doc.status,
        "retrieval_match": round(score * 100),
        "confidence": confidence_from_score(score),
        "source": {
            "title": doc.title,
            "type": doc.source_type,
            "url": doc.source_url,
            "verified": doc.verified,
        },
        "evidence": [{
            "section": chunk.section or "Extracted document",
            "page": chunk.page,
            "text": chunk.text[:800],
        }],
    }


# ---------------------------------------------------------
# Seed demo knowledge base
# ---------------------------------------------------------
def seed(s: Session):
    if not s.scalar(select(User).where(User.email == ADMIN_EMAIL)):
        s.add(
            User(
                email=ADMIN_EMAIL,
                password_hash=hash_password(ADMIN_PASSWORD),
                role="ADMIN",
            )
        )

    path = DATA / "demo" / "standards.json"

    if path.exists():
        records = json.loads(path.read_text(encoding="utf-8"))

        details = {
            "IS 302 (Part 1):2008": (
                "Safety requirements for household and similar "
                "electrical appliances; use this demo record to "
                "illustrate grounded retrieval for electrical products."
            ),
            "IS 17043:2018": (
                "Demo consumer product standard record used to "
                "demonstrate metadata, versioning and evidence cards."
            ),
            "IS 9845:1998": (
                "Demo food-contact plastics record used to demonstrate "
                "product/material retrieval and compliance workflows."
            ),
        }

        existing_standards = {
            value for value in s.scalars(
                select(Document.standard_number).where(Document.standard_number.is_not(None))
            ).all()
        }

        for r in records:
            if r["standard"] in existing_standards:
                continue

            content = details.get(
                r["standard"],
                (
                    "Demo BIS standards index record for " + r["standard"] + ". "
                    "This metadata is included for prototype search and navigation only. "
                    "Consult the current official BIS publication for technical requirements, "
                    "certification applicability and test methods."
                ),
            )

            d = Document(
                title=r["standard"],
                standard_number=r["standard"],
                category=r["category"],
                version="Demo",
                source_url="https://www.bis.gov.in/",
                source_type=r["source_type"],
                status="CURRENT",
                content=content,
                content_hash=hashlib.sha256(content.encode()).hexdigest(),
                verified=False,
            )

            s.add(d)
            s.flush()

            for i, piece in enumerate(chunk_text(content)):
                s.add(
                    Chunk(
                        document_id=d.id,
                        text=piece,
                        page=1,
                        section=f"Demo section {i + 1}",
                    )
                )

    s.commit()


with SessionLocal() as s:
    seed(s)


# ---------------------------------------------------------
# Request models
# ---------------------------------------------------------
class AuthIn(BaseModel):
    email: EmailStr
    password: str
    language: str = "en"


class AnalyzeIn(BaseModel):
    query: str
    language: str = "en"


class AskIn(BaseModel):
    question: str
    language: str = "en"


class RegisterIn(BaseModel):
    email: EmailStr
    password: str
    language: str = "en"


class VerifyDocumentIn(BaseModel):
    verified: bool = True


# ---------------------------------------------------------
# Health
# ---------------------------------------------------------
@app.get("/")
def root():
    return {
        "service": "BIS Intelligence API",
        "version": "2.0.0",
        "status": "running",
        "docs": "/docs",
        "health": "/health",
    }


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "bis-intelligence-api",
        "database": "connected",
        "rag": "chunk-tfidf",
        "nvidia_nim": "configured" if NVIDIA_API_KEY else "not_configured",
        "nvidia_model": NVIDIA_MODEL,
        "tavily_web_search": "configured" if TAVILY_API_KEY else "not_configured",
    }


@app.get("/api/web-search-test")
def web_search_test(q: str = "electric room heater BIS standard"):
    """Safe diagnostic endpoint: never returns API keys, only search status/results."""
    results = _web_search(q, max_results=5)
    return {
        "configured": bool(TAVILY_API_KEY),
        "query": q,
        "result_count": len(results),
        "results": [{"title": x["title"], "url": x["url"], "score": x["score"]} for x in results],
    }


# ---------------------------------------------------------
# Authentication
# ---------------------------------------------------------
@app.post("/api/auth/register")
def register(x: RegisterIn, s: Session = Depends(db)):
    if len(x.password) < 8:
        raise HTTPException(
            422,
            "Password must be at least 8 characters",
        )

    if s.scalar(select(User).where(User.email == x.email)):
        raise HTTPException(
            409,
            "Email already registered",
        )

    language = x.language if x.language in translations else "en"

    u = User(
        email=x.email,
        password_hash=hash_password(x.password),
        language=language,
    )

    s.add(u)
    s.commit()
    s.refresh(u)

    return {
        "token": token_for(u),
        "user": {
            "id": u.id,
            "email": u.email,
            "role": u.role,
            "language": u.language,
        },
    }


@app.post("/api/auth/login")
def login(x: AuthIn, s: Session = Depends(db)):
    u = s.scalar(
        select(User).where(User.email == x.email)
    )

    if not u or not verify_password(
        x.password,
        u.password_hash,
    ):
        raise HTTPException(
            401,
            "Invalid email or password",
        )

    return {
        "token": token_for(u),
        "user": {
            "id": u.id,
            "email": u.email,
            "role": u.role,
            "language": u.language,
        },
    }


@app.get("/api/auth/me")
def me(u=Depends(current_user)):
    if not u:
        raise HTTPException(
            401,
            "Authentication required",
        )

    return {
        "id": u.id,
        "email": u.email,
        "role": u.role,
        "language": u.language,
    }


BIS_AI_SYSTEM_PROMPT = """You are BIS Intelligence, an AI assistant for Indian Standards and BIS services.

Your purpose is to help Indian industries, manufacturers, businesses and consumers understand BIS standards, certification requirements, testing requirements, laboratories, documents and compliance procedures.

Use the supplied official BIS context and live web evidence as sources of truth. Prefer official BIS sources whenever available.

When using live web evidence, cite sources inline as [Web 1], [Web 2], etc. Never fabricate a source or citation.

Never invent:
- IS numbers
- BIS certification requirements
- clauses
- testing requirements
- laboratories
- licence requirements
- documents
- fees
- regulatory requirements

If the supplied evidence is insufficient, explicitly state that the information could not be verified from the available BIS sources.

When possible, provide:
1. Direct answer
2. Applicable BIS standard(s)
3. Certification requirement
4. Testing requirement
5. Required documents
6. Relevant BIS evidence/source
7. Confidence level

Answer in the user's selected language. Keep IS numbers, standard numbers, official scheme names and technical identifiers unchanged.
"""


def _tavily_request(query: str, max_results: int, domains=None):
    if not TAVILY_API_KEY:
        return []
    payload = {
        "api_key": TAVILY_API_KEY,
        "query": query,
        "search_depth": "advanced",
        "topic": "general",
        "max_results": max_results,
        "include_answer": False,
        "include_raw_content": True,
    }
    if domains:
        payload["include_domains"] = domains
    try:
        r = requests.post("https://api.tavily.com/search", json=payload, timeout=25)
        r.raise_for_status()
        data = r.json()
    except Exception as exc:
        print(f"Tavily web search error: {type(exc).__name__}: {exc}")
        return []

    results = []
    for item in data.get("results", []):
        url = item.get("url")
        title = item.get("title") or url or "Web source"
        content = item.get("raw_content") or item.get("content") or ""
        if not url:
            continue
        results.append({
            "title": title,
            "url": url,
            "content": normalize_text(content)[:5000],
            "score": float(item.get("score") or 0),
        })
    return results


def _web_search(query: str, max_results: int = None):
    """Search live web. Prefer BIS/government sources, then fall back to the wider web."""
    if not TAVILY_API_KEY:
        return []
    max_results = max_results or TAVILY_MAX_RESULTS
    bis_domains = [
        "bis.gov.in", "standards.bis.gov.in", "services.bis.gov.in", "manakonline.in"
    ]
    results = _tavily_request(query, max_results, bis_domains)
    if results:
        return results
    # A strict BIS-domain query can legitimately return zero results for some
    # products. Do a wider search so the assistant can still find current evidence,
    # while the model is instructed to prefer official BIS/government sources.
    wider_query = f"India BIS Bureau of Indian Standards {query} official requirements standard certification"
    return _tavily_request(wider_query, max_results, None)


def _build_web_context(results):
    blocks = []
    for i, item in enumerate(results[:8], 1):
        blocks.append(
            f"[Web Evidence {i}]\n"
            f"Title: {item['title']}\n"
            f"URL: {item['url']}\n"
            f"Content: {item['content'][:4500]}"
        )
    return "\n\n".join(blocks)


def _ask_error_message(lang: str) -> str:
    if lang == "hi":
        return "AI सेवा इस समय उपलब्ध नहीं है। कृपया कुछ देर बाद पुनः प्रयास करें।"
    if lang == "mr":
        return "AI सेवा सध्या उपलब्ध नाही. कृपया थोड्या वेळाने पुन्हा प्रयत्न करा."
    return "The AI service is temporarily unavailable. Please try again shortly."


def _build_evidence_context(hits):
    blocks = []
    for i, item in enumerate(hits[:6], 1):
        doc = item["document"]
        chunk = item["chunk"]
        blocks.append(
            f"[Evidence {i}]\n"
            f"Document: {doc.title}\n"
            f"IS Number: {doc.standard_number or 'N/A'}\n"
            f"Category: {doc.category}\n"
            f"Version: {doc.version}\n"
            f"Section: {chunk.section or 'N/A'}\n"
            f"Page: {chunk.page or 'N/A'}\n"
            f"Source URL: {doc.source_url}\n"
            f"Verified: {doc.verified}\n"
            f"Retrieved evidence: {chunk.text[:1800]}"
        )
    return "\n\n".join(blocks)


def _nim_chat(question: str, language: str, evidence_context: str, web_context: str = ""):
    if not NVIDIA_API_KEY or not nim_client:
        raise RuntimeError("NVIDIA API key is not configured")

    response = nim_client.chat.completions.create(
        model=NVIDIA_MODEL,
        messages=[
            {"role": "system", "content": BIS_AI_SYSTEM_PROMPT},
            {
                "role": "user",
                "content": (
                    f"Selected language: {language}\n\n"
                    f"User question:\n{question}\n\n"
                    f"Retrieved BIS context:\n{evidence_context or 'No local BIS evidence found.'}\n\n"
                    f"Live web evidence:\n{web_context or 'No live web evidence found.'}\n\n"
                    "Generate a concise, evidence-grounded answer. Prefer official BIS sources. If evidence conflicts, explain the conflict and use the newest authoritative source. Do not use unsupported outside knowledge."
                ),
            },
        ],
        temperature=0.2,
        max_tokens=1024,
    )
    return response.choices[0].message.content or ""


@app.post("/api/ask")
def ask(
    x: AskIn,
    s: Session = Depends(db),
    u=Depends(current_user),
):
    q = x.question.strip()
    lang = x.language if x.language in translations else "en"

    if not q:
        raise HTTPException(400, "Please enter a question.")

    # 1) Search the live internet first. The search is restricted to authoritative
    # BIS-related domains so compliance answers are not driven by random blogs.
    web_hits = _web_search(q)

    # 2) Also search the project's local evidence database.
    hits = retrieve_chunks(s, q, k=8)
    top_score = hits[0]["score"] if hits else 0.0
    local_confidence = confidence_from_score(top_score)
    intent = infer_intent(q)

    web_context = _build_web_context(web_hits)
    local_context = _build_evidence_context(hits)

    # We can answer when either live authoritative web evidence OR local evidence exists.
    if not web_hits and TAVILY_API_KEY and (not hits or top_score < 0.12):
        s.add(QueryLog(
            user_id=u.id if u else None,
            query=q,
            intent=intent,
            confidence="LOW",
        ))
        s.commit()
        return {
            "status": "insufficient_evidence",
            "answer": (
                "Live BIS web search returned no usable results. Check the Tavily API key and "
                "the /api/web-search-test endpoint, then try again."
                if TAVILY_API_KEY else translations[lang]["insufficient"]
            ),
            "sources": [],
            "web_sources": [],
            "confidence": 0.0,
            "confidence_label": "LOW",
            "standards": [],
            "certification": [],
            "testing": [],
            "documents": [],
            "web_search": bool(TAVILY_API_KEY),
        }

    try:
        answer = _nim_chat(q, lang, local_context, web_context)
    except Exception as exc:
        print(f"NVIDIA NIM /api/ask error: {type(exc).__name__}: {exc}")
        raise HTTPException(502, _ask_error_message(lang))

    local_sources = [evidence_payload(item) for item in hits[:5]]
    web_sources = [
        {
            "title": item["title"],
            "url": item["url"],
            "score": round(item["score"], 3),
            "source": "Live web search",
        }
        for item in web_hits[:8]
    ]

    standards = []
    seen = set()
    for item in local_sources:
        standard = item.get("standard")
        if standard and standard not in seen:
            seen.add(standard)
            standards.append({
                "is_number": standard,
                "title": item.get("title"),
                "category": item.get("category"),
                "version": item.get("version"),
                "status": item.get("status"),
            })

    result = {
        "status": "grounded",
        "answer": answer,
        "sources": local_sources,
        "web_sources": web_sources,
        "confidence": round(max(top_score, max((x["score"] for x in web_hits), default=0.0)), 3),
        "confidence_label": "HIGH" if web_hits else local_confidence,
        "standards": standards,
        "certification": [],
        "testing": [],
        "documents": [
            {
                "document_id": src["document_id"],
                "title": src["title"],
                "source_url": src["source"]["url"],
                "page": src["evidence"][0]["page"],
                "section": src["evidence"][0]["section"],
            }
            for src in local_sources
        ],
        "intent": intent,
        "model": NVIDIA_MODEL,
        "web_search": bool(TAVILY_API_KEY),
    }

    s.add(QueryLog(
        user_id=u.id if u else None,
        query=q,
        intent=intent,
        confidence=result["confidence_label"],
    ))
    s.commit()
    return result

