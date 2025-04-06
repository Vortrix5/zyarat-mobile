# /Users/macm1/Documents/MedTech/2024/ISS/zyarat-mobile/server/app.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import sys

# Ensure that the current directory is in the Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.append(current_dir)

# Import configuration and logger
from config import settings
from logger import logger

# Import route modules
from routes.health import router as health_router
from routes.artifact import router as artifact_router

# Create FastAPI application
app = FastAPI(
    title="Zyarat Artifact Analysis API",
    description="API for analyzing and identifying Tunisian artifacts",
    version="0.1.0"
)

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with actual frontend origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health_router)
app.include_router(artifact_router)

# Startup event
@app.on_event("startup")
async def startup_event():
    logger.info("=== Zyarat Artifact Analysis Server starting up ===")
    logger.info(f"Server configured to run on {settings.host}:{settings.port}")
    
    if settings.use_sample_data:
        logger.info("Running in SAMPLE DATA MODE - no real API calls will be made")
    else:
        if not settings.openrouter_api_key:
            logger.warning("WARNING: No OpenRouter API key configured. API calls will fail.")
        else:
            logger.info(f"OpenRouter API configured with model: {settings.openrouter_model}")

    logger.info("Server ready to accept connections")

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    logger.info("=== Zyarat Artifact Analysis Server shutting down ===")

# Root endpoint
@app.get("/")
async def root():
    return {
        "name": "Zyarat Artifact Analysis API",
        "status": "online",
        "documentation": "/docs",
        "health_check": "/health"
    }