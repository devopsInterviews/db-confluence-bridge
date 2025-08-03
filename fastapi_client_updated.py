from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="MCP Client")

# Mount static files (React assets)
app.mount("/assets", StaticFiles(directory="static/assets"), name="assets")
app.mount("/static", StaticFiles(directory="static"), name="static")

templates = Jinja2Templates(directory="templates")

# Data models for the API
class DatabaseConfig(BaseModel):
    host: str
    port: int
    user: str
    password: str
    database: str
    limit: int

class ConfluenceConfig(BaseModel):
    space: str
    title: str

class SyncRequest(BaseModel):
    dbConfig: DatabaseConfig
    confluenceConfig: ConfluenceConfig

@app.get("/", response_class=HTMLResponse)
async def serve_react_app(request: Request):
    """Serve the React application"""
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/sync-all-tables")
async def sync_tables_api(request: SyncRequest):
    """API endpoint for syncing tables - replace with your actual logic"""
    
    # TODO: Replace this with your actual MCP server logic
    # This is just example structure
    
    try:
        # Your existing database sync logic here
        # Example response structure:
        results = [
            {
                "table": "users",
                "columns_added": 2,
                "status": "success",
                "error": None
            },
            {
                "table": "products", 
                "columns_added": 0,
                "status": "no_changes",
                "error": None
            }
        ]
        
        return {
            "results": results,
            "total_tables": len(results),
            "total_columns": sum(r["columns_added"] for r in results),
            "errors": sum(1 for r in results if r["error"])
        }
        
    except Exception as e:
        return {"error": str(e)}