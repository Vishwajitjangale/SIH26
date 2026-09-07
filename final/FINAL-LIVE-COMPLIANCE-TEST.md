# Final Live Compliance Test

1. Backend:
```powershell
cd D:\Projects\BIS_ISI_2\SIH26\final\backend
.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

2. Check configuration:
`http://127.0.0.1:8000/health`
Both `nvidia_nim` and `tavily_web_search` must say `configured`.

3. Test Tavily directly:
`http://127.0.0.1:8000/api/web-search-test?q=electric%20room%20heater%20BIS`
It must show `configured: true` and at least one result.

4. Website:
```powershell
cd D:\Projects\BIS_ISI_2\SIH26\final
py -m http.server 5500
```
Open `http://127.0.0.1:5500/website/compliance-assistant.html`.

5. Enter a real product, e.g. Electric room heater + a real description, then Analyze Compliance.

IMPORTANT: The backend loads `backend/.env` by absolute path, so the key must be in the same `backend` folder as `main.py`. Restart Uvicorn after changing `.env`.
