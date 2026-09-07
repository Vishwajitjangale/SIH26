# BIS Intelligence — Live Standards Search

This build adds a live BIS standards search to `website/find-standards.html` and upgrades the FastAPI `/api/standards` endpoint.

## What changed

- Find Standards now calls `GET /api/standards?q=...&category=...`.
- Searches standard number, title, category and indexed document content.
- Uses the existing TF-IDF chunk retrieval to improve ranking when indexed chunks exist.
- Shows match percentage, version, status, verification and BIS source link.
- Search works with Enter, category filter and example chips.
- If the backend is unavailable, the page clearly falls back to the local demo index.
- Added a small demo standards index at `data/demo/standards.json` so a fresh database has searchable records.
- Added the missing Next.js `package.json`, Tailwind/PostCSS setup and root layout so the frontend can be installed/run.

## Run the backend

PowerShell:

```powershell
cd final\backend
py -3.12 -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
copy .env.example .env
```

Edit `final/backend/.env` and set your NVIDIA API key if you want the AI/compliance endpoint:

```env
NVIDIA_API_KEY=YOUR_KEY_HERE
NVIDIA_MODEL=meta/llama-3.3-70b-instruct
NVIDIA_BASE_URL=https://integrate.api.nvidia.com/v1
```

Start FastAPI:

```powershell
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Test:

- `http://127.0.0.1:8000/health`
- `http://127.0.0.1:8000/docs`
- `http://127.0.0.1:8000/api/standards?q=electrical`
- `http://127.0.0.1:8000/api/standards?q=IS%20302`

## Run the website with the live search

Open a second PowerShell:

```powershell
cd final
py -m http.server 5500
```

Then open:

`http://127.0.0.1:5500/website/find-standards.html`

Try:

- `electrical`
- `IS 302`
- `food`
- `steel`
- `toy`
- `helmet`

## Run the Next.js frontend

In a third PowerShell:

```powershell
cd final\frontend
npm install
copy .env.local.example .env.local
npm run dev
```

Then open `http://localhost:3000`.

The static website and Next.js frontend are separate clients and both use the same FastAPI backend.


## Live Internet Search in Compliance Assistant

The Compliance Assistant now supports live BIS web search through Tavily. It searches authoritative BIS domains (`bis.gov.in`, `standards.bis.gov.in`, `services.bis.gov.in`, and `manakonline.in`) before sending the evidence to NVIDIA NIM.

1. Create a Tavily API key.
2. Put it in `backend/.env`:

```env
TAVILY_API_KEY=your_tavily_api_key_here
TAVILY_MAX_RESULTS=6
```

3. Install the new dependency:

```powershell
python -m pip install -r requirements.txt
```

4. Restart the backend.

The Compliance Assistant will then show live web sources below the AI answer. If the key is missing, the existing local RAG search still works, but live internet search is disabled.
