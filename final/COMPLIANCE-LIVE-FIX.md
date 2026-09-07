# Compliance Assistant — Live Search Fix

The Compliance Assistant now calls the FastAPI `/api/ask` endpoint when **Analyze Compliance** is clicked. The backend performs a Tavily search restricted to BIS-related domains, retrieves local evidence, and sends both to NVIDIA NIM.

## Run

### Backend
```powershell
cd D:\Projects\BIS_ISI_2\SIH26\final\backend
.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

### backend/.env
```env
NVIDIA_API_KEY=YOUR_NVIDIA_API_KEY
NVIDIA_MODEL=meta/llama-3.3-70b-instruct
NVIDIA_BASE_URL=https://integrate.api.nvidia.com/v1
TAVILY_API_KEY=YOUR_TAVILY_API_KEY
TAVILY_MAX_RESULTS=6
```

### Website
In a second terminal:
```powershell
cd D:\Projects\BIS_ISI_2\SIH26\final
py -m http.server 5500
```
Open:
`http://127.0.0.1:5500/website/compliance-assistant.html`

## Verify backend configuration
Open:
`http://127.0.0.1:8000/health`

Check:
- `nvidia_nim`: `configured`
- `tavily_web_search`: `configured`

If either says `not_configured`, check `backend/.env` and restart Uvicorn.
