# Zyarat Artifact Analysis Server

This server uses the OpenRouter API to access Google's Gemma 3 27B model for analyzing images of Tunisian artifacts and providing detailed information about them.

## Prerequisites

- Python 3.8 or higher
- An OpenRouter API key (register at <https://openrouter.ai>)

## Setup

1. Make the run script executable:

   ```bash
   chmod +x run.sh
   ```

2. Add your OpenRouter API key to the `.env` file:

   ```
   OPENROUTER_API_KEY=your_api_key_here
   ```

3. Configure additional environment variables (optional):

   ```
   HOST=0.0.0.0             # Server host address
   PORT=8000                # Server port
   OPENROUTER_MODEL=google/gemma-3-27b-it:free  # OpenRouter model to use
   API_TIMEOUT=60           # Timeout for API calls in seconds
   LOG_LEVEL=INFO           # Logging level
   USE_SAMPLE_DATA=False    # Set to True to return sample data without using the API
   ```

4. Run the setup script:

   ```bash
   ./run.sh
   ```

   This will:
   - Check if Python 3 and pip are installed
   - Create a virtual environment
   - Install dependencies
   - Start the server

## API Endpoints

### Health Check

```
GET /health
```

Returns the current status of the server and the OpenRouter API connection.

### Analyze Image

```
POST /analyze
```

Upload an image file to analyze. The server will return JSON with the following structure:

```json
{
  "title": "Name of the artifact",
  "period": "Historical period (with years)",
  "description": "Brief description of what it is",
  "significance": "Historical and cultural significance",
  "confidence": 0.95
}
```

## Logging

Logs are stored in the `logs` directory with the following configuration:

- Log file: `logs/zyarat_server.log`
- File rotation: Logs rotate when they reach 10MB in size
- Backup count: 5 backup files are kept
- Format: `timestamp - logger_name - log_level - message`

You can check the logs to diagnose any issues with the server or the API integration.

## Testing Mode

For testing without using the OpenRouter API (or when you don't have an API key), you can set `USE_SAMPLE_DATA=True` in the `.env` file. This will make the server respond with predefined sample artifacts instead of analyzing images.

## Troubleshooting

If you encounter issues with the connection between the mobile app and the server:

1. Make sure the server is running on a network interface accessible from your mobile device
2. Update the `API_URL` in the mobile app's `utils/serverApi.js` file to point to your server's IP address
3. Check that ports are open and not blocked by firewalls

If you encounter issues with the OpenRouter API:

1. Verify your API key is correct in the `.env` file
2. Check if you have enough API credits in your OpenRouter account
3. Check the server logs in `logs/zyarat_server.log`
4. Set `USE_SAMPLE_DATA=True` in the `.env` file for testing without API dependency
