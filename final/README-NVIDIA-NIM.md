# BIS Intelligence — NVIDIA NIM Integration

This patch connects the existing BIS Intelligence assistant to the backend endpoint `/api/ask`, which retrieves BIS evidence first and only then calls NVIDIA NIM.

## Architecture

User → Frontend → `POST /api/ask` → existing TF-IDF BIS retrieval → NVIDIA NIM → grounded answer + evidence → frontend

## Files

### Modified backend
- `backend/main.py`
  - Added `NVIDIA_MODEL` configuration.
  - Added `/api/ask`.
  - Added strict evidence gate before NIM.
  - Added the requested BIS grounding system prompt.
  - Added English/Hindi/Marathi response language handling.
  - Added generic user-safe NIM errors.
  - Kept the existing `/api/compliance/analyze`, auth, standards, evidence, admin and PDF-ingestion endpoints.
  - Fixed the existing NIM model to use `NVIDIA_MODEL` instead of a hardcoded model.

### Modified frontend
- `frontend/app/page.tsx`
  - Existing assistant now calls `/api/ask`.
  - Sends `{ question, language }`.
  - Persists the selected language in `localStorage`.
  - Displays the AI answer, confidence and retrieved BIS evidence/source links.
  - Does not contain an NVIDIA API key.

### Static website compatibility
- `website/compliance-assistant.html`
- `website/js/site-pages.js`
  - The existing static Compliance Assistant form now also calls `/api/ask` instead of generating a hardcoded demo result.

### Configuration
- `backend/.env.example`
- `frontend/.env.local.example`
- `backend/requirements.txt`
- `backend/.gitignore`

## Backend setup

From the project root:

```powershell
cd backend
py -3.13 -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

Create `backend/.env` from `backend/.env.example` and set:

```env
NVIDIA_API_KEY=PASTE_YOUR_ROTATED_NVIDIA_KEY_HERE
NVIDIA_MODEL=meta/llama-3.3-70b-instruct
NVIDIA_BASE_URL=https://integrate.api.nvidia.com/v1
```

Do not commit `.env`.

Start:

```powershell
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

## Frontend setup

If the existing Next.js frontend already works, no new npm package is required by this patch.

Optional `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

Then:

```powershell
cd frontend
npm install
npm run dev
```

Open the existing frontend URL, normally `http://localhost:3000`.

## API test

```powershell
curl.exe -X POST http://127.0.0.1:8000/api/ask `
  -H "Content-Type: application/json" `
  -d '{"question":"What BIS standard applies to electrical appliances?","language":"en"}'
```

Hindi:

```powershell
curl.exe -X POST http://127.0.0.1:8000/api/ask `
  -H "Content-Type: application/json" `
  -d '{"question":"विद्युत उपकरणों पर कौन सा BIS मानक लागू होता है?","language":"hi"}'
```

## Security

The NVIDIA API key is intentionally NOT included in this patch or ZIP. Put it only in `backend/.env`.

Because an API key was pasted into chat during implementation, rotate/revoke that key in NVIDIA and use the replacement key in your local `.env` before deploying.

## Evidence behavior

If the BIS retriever has no sufficiently relevant evidence, `/api/ask` returns `insufficient_evidence` and does not call NVIDIA NIM. This prevents the LLM from inventing an IS number, clause, certification requirement, test, laboratory or regulation.

If NIM is unavailable, the backend returns a generic 502 message rather than exposing the provider's raw technical error.
