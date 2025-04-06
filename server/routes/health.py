# /Users/macm1/Documents/MedTech/2024/ISS/zyarat-mobile/server/routes/health.py
from fastapi import APIRouter, Response
import json
from datetime import datetime
import socket
import platform
import os

router = APIRouter()

@router.get("/health")
async def health_check():
    """
    Basic health check endpoint that returns system information
    """
    # System information
    hostname = socket.gethostname()
    ip_address = socket.gethostbyname(hostname)
    platform_info = platform.platform()
    python_version = platform.python_version()
    current_time = datetime.now().isoformat()
    
    # Process information
    pid = os.getpid()
    
    health_data = {
        "status": "ok",
        "timestamp": current_time,
        "system": {
            "hostname": hostname,
            "ip": ip_address,
            "platform": platform_info,
            "python_version": python_version,
            "process_id": pid
        },
        "server": {
            "uptime": "N/A",  # Would need to track server start time
            "version": "0.1.0"
        }
    }
    
    return Response(
        content=json.dumps(health_data),
        media_type="application/json"
    )

@router.get("/ping")
async def ping():
    """
    Simple ping endpoint for basic connectivity testing
    """
    return {"ping": "pong", "timestamp": datetime.now().isoformat()}