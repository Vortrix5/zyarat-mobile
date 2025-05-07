import json
import re
import time
from logger import logger

def extract_json_from_llm_response(response_text: str):
    """Extract and parse JSON from an LLM response text"""
    json_extraction_start = time.time()
    
    # Extract JSON from response (LLM might include markdown code blocks)
    json_match = re.search(r'```json\s*(.*?)\s*```', response_text, re.DOTALL)
    if json_match:
        json_str = json_match.group(1)
        logger.info("JSON found in code block")
    else:
        json_str = response_text
        logger.info("No JSON code block found, using raw response")
    
    # Clean up any non-JSON content
    json_str = re.sub(r'^[^{]*', '', json_str)
    json_str = re.sub(r'[^}]*$', '', json_str)
    
    logger.info(f"JSON extraction completed in {time.time() - json_extraction_start:.2f} seconds")
    logger.info(f"Extracted JSON: {json_str[:100]}...")
    
    try:
        return json.loads(json_str)
    except json.JSONDecodeError as json_error:
        logger.error(f"Failed to parse JSON from API response: {json_error}")
        logger.error(f"Problem JSON string: {json_str}")
        raise

def validate_artifact_recognition(artifact_data: dict):
    """Validate and clean up artifact recognition data"""
    # Check if the response has the expected structure
    if "error" in artifact_data:
        logger.info("API couldn't identify a Tunisian artifact with high confidence")
        # Make sure all required fields are present for non-recognized artifacts
        if "possible_identification" not in artifact_data:
            artifact_data["possible_identification"] = "Unknown object"
        if "explanation" not in artifact_data:
            artifact_data["explanation"] = "The image doesn't appear to show a recognized Tunisian artifact."
        if "confidence" not in artifact_data:
            artifact_data["confidence"] = 0.3
        
        # Ensure the confidence is appropriately low for non-artifacts
        if artifact_data["confidence"] > 0.5:
            artifact_data["confidence"] = 0.3
            
        logger.info(f"Returning not-recognized response with possible identification: {artifact_data['possible_identification']}")
        return artifact_data
        
    # Ensure all expected fields are present for recognized artifacts
    required_fields = ["title", "period", "description", "significance", "location", "confidence"]
    for field in required_fields:
        if field not in artifact_data:
            logger.warning(f"Missing field in response: {field}")
            artifact_data[field] = "Unknown" if field != "confidence" else 0.7
    
    logger.info(f"Successfully analyzed artifact: {artifact_data['title']}")
    return artifact_data
