# SIH26107 — Live BIS Compliance Assistant Setup

This version uses two services:

1. **Tavily** — live web search, restricted by the backend to authoritative BIS-related domains.
2. **NVIDIA NIM** — the AI/LLM that reads the retrieved evidence and generates the compliance answer.

You do **not** need an OpenAI or Gemini API key for this version.

## 1. Put both keys in `final/backend/.env`

Create the file by copying `.env.example`:

```powershell
cd final\backend
copy .env.example .env
```

Open it:

```powershell
notepad .env
```

Set these values:

```env
NVIDIA_API_KEY=YOUR_NVIDIA_API_KEY
NVIDIA_MODEL=meta/llama-3.3-70b-instruct
NVIDIA_BASE_URL=https://integrate.api.nvidia.com/v1

TAVILY_API_KEY=YOUR_TAVILY_API_KEY
TAVILY_MAX_RESULTS=6
```

Also keep the existing database/JWT settings in the file.

### Which key is which?

- `NVIDIA_API_KEY` = **AI model key**. The backend sends retrieved BIS evidence to NVIDIA NIM and asks it to produce the final answer.
- `TAVILY_API_KEY` = **internet search key**. It retrieves current web pages before the AI answers.

Never put either key in frontend code, `frontend/.env.local`, HTML, React components, or GitHub.

## 2. Get the NVIDIA key

Use the NVIDIA API Catalog. Select a model and use **Get API Key / Generate Key**.

For this project, keep:

```env
NVIDIA_MODEL=meta/llama-3.3-70b-instruct
```

## 3. Get the Tavily key

Create a Tavily account and get an API key from the Tavily dashboard.

The backend already calls the Tavily API directly, so no extra Python SDK is required.

## 4. Install and run backend

Python 3.12 is recommended for this project.

```powershell
cd final\backend
py -3.12 -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Test:

```text
http://127.0.0.1:8000/docs
```

## 5. Run frontend

In a second PowerShell window:

```powershell
cd final\frontend
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

For the static website version:

```powershell
cd final
py -m http.server 5500
```

Open:

```text
http://127.0.0.1:5500/website/compliance-assistant.html
```

## 6. What happens when Analyze Compliance is clicked?

```text
Product details
      ↓
POST /api/ask
      ↓
Tavily live search
      ↓
BIS / standards.bis.gov.in / services.bis.gov.in / manakonline.in
      ↓
Local BIS evidence retrieval
      ↓
NVIDIA NIM
      ↓
Grounded compliance answer + source links
```

The backend is intentionally restricted to BIS-related domains for this compliance workflow. If no sufficient authoritative evidence is found, it returns an insufficient-evidence response instead of asking the model to guess.

## Security

`.env` is ignored by Git. Never commit API keys. If a real API key has ever been exposed in a screenshot, chat, Git commit, or ZIP, revoke/rotate it and use a new key.
