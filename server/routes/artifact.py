import random
import io
import json
from fastapi import APIRouter, File, UploadFile, HTTPException
from PIL import Image

from config import settings
from logger import logger
from utils.api_client import OpenRouterClient
from utils.json_parser import extract_json_from_llm_response, validate_artifact_recognition
from utils.constants import SAMPLE_ARTIFACTS, ARTIFACT_ANALYSIS_PROMPT

router = APIRouter()

@router.post("/analyze")
async def analyze_image(image: UploadFile = File(...)):
    """Analyze an uploaded image to identify the artifact"""
    # If sample data mode is enabled, return a random sample artifact immediately
    if settings.use_sample_data:
        logger.info("Using sample data (USE_SAMPLE_DATA=True)")
        return random.choice(SAMPLE_ARTIFACTS)
        
    try:
        # Read and process the image
        logger.info("Reading uploaded image")
        contents = await image.read()
        img = Image.open(io.BytesIO(contents))
        
        # Create API client
        client = OpenRouterClient()
        
        try:
            # Get analysis from OpenRouter API
            response_text = client.analyze_image(img, ARTIFACT_ANALYSIS_PROMPT)
            logger.info(f"Response length: {len(response_text)} characters")
            
            # Extract and validate JSON response
            try:
                artifact_data = extract_json_from_llm_response(response_text)
                return validate_artifact_recognition(artifact_data)
                
            except json.JSONDecodeError:
                # Return an error response with possible information about what was in the image
                error_response = {
                    "error": "Failed to parse response",
                    "possible_identification": "The image couldn't be properly analyzed",
                    "explanation": "The AI detected something in the image but couldn't provide a structured analysis.",
                    "confidence": 0.2
                }
                logger.info("Returning error response due to JSON parsing failure")
                return error_response
                
        except Exception as api_error:
            logger.exception("Full API error details:")
            # Return an error response instead of a sample
            error_response = {
                "error": "Analysis failed",
                "possible_identification": "Unknown",
                "explanation": "The analysis service encountered a technical problem.",
                "confidence": 0.1
            }
            logger.info("Returning error response due to API error")
            return error_response
            
    except Exception as e:
        logger.exception(f"Error processing image: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
