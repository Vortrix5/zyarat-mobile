import time
import requests
import base64
from io import BytesIO
from PIL import Image

from config import settings
from logger import logger

class OpenRouterClient:
    """Client for interacting with the OpenRouter API"""
    
    def __init__(self):
        self.api_key = settings.openrouter_api_key
        self.model = settings.openrouter_model
        self.timeout = settings.api_timeout
        
    def get_available_models(self):
        """Get a list of available models from OpenRouter"""
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "HTTP-Referer": "https://zyarat-app.com"
        }
        
        try:
            response = requests.get(
                "https://openrouter.ai/api/v1/models",
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                logger.error(f"OpenRouter API error: {response.status_code} - {response.text}")
                return None
                
        except Exception as e:
            logger.error(f"Error getting models from OpenRouter: {str(e)}")
            return None
    
    def analyze_image(self, image: Image.Image, prompt: str):
        """Analyze an image using the OpenRouter API"""
        # Convert image to base64
        buffered = BytesIO()
        image.save(buffered, format="JPEG")
        img_base64 = base64.b64encode(buffered.getvalue()).decode()
        
        # Prepare API request
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://zyarat-app.com"
        }
        
        payload = {
            "model": self.model,
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{img_base64}"}}
                    ]
                }
            ]
        }
        
        # Make the API request
        logger.info(f"Sending request to OpenRouter API with model {self.model} (timeout: {self.timeout}s)")
        api_start_time = time.time()
        
        try:
            response = requests.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers=headers,
                json=payload,
                timeout=self.timeout
            )
            
            api_time_taken = time.time() - api_start_time
            logger.info(f"OpenRouter API response received in {api_time_taken:.2f} seconds")
            
            if response.status_code != 200:
                logger.error(f"OpenRouter API error: {response.status_code} - {response.text}")
                raise Exception(f"API returned status code {response.status_code}: {response.text}")
                
            response_data = response.json()
            return response_data["choices"][0]["message"]["content"]
        
        except Exception as api_error:
            logger.exception(f"Error calling OpenRouter API: {str(api_error)}")
            raise
