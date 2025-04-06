#!/bin/bash

# Check if Python 3 is installed
if command -v python3 &>/dev/null; then
    PYTHON=python3
elif command -v python &>/dev/null; then
    PYTHON=python
else
    echo "Error: Python 3 is required but not installed."
    exit 1
fi

# Check if pip is installed
if ! command -v pip3 &>/dev/null && ! command -v pip &>/dev/null; then
    echo "Error: pip is required but not installed."
    exit 1
fi

PIP="$PYTHON -m pip"

# Create logs directory if it doesn't exist
mkdir -p logs

# Check if .env file exists and create from example if not
if [ ! -f ".env" ]; then
    echo "Warning: .env file not found. Creating with default settings."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "Please edit .env and add your OpenRouter API key."
    else
        echo "Error: .env.example file not found."
        exit 1
    fi
fi

# Check if API key is configured
if grep -q "OPENROUTER_API_KEY=your_openrouter_api_key_here" .env; then
    echo "Warning: OpenRouter API key is not configured in .env file."
    echo "You will only be able to use sample data mode."
    echo "Setting USE_SAMPLE_DATA=True in .env"
    # Update USE_SAMPLE_DATA in .env file
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS requires an empty string for -i
        sed -i '' 's/USE_SAMPLE_DATA=False/USE_SAMPLE_DATA=True/g' .env
    else
        # Linux/others
        sed -i 's/USE_SAMPLE_DATA=False/USE_SAMPLE_DATA=True/g' .env
    fi
fi

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    $PYTHON -m venv venv
fi

# Activate virtual environment
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    # Windows
    source venv/Scripts/activate
else
    # Unix/Linux/MacOS
    source venv/bin/activate
fi

# Install requirements
echo "Installing dependencies..."
$PIP install --upgrade pip
$PIP install -r requirements.txt

# Run the server
echo "Starting server..."
echo "Logs will be saved to logs/zyarat_server.log"

# Start server using uvicorn
$PYTHON -m uvicorn app:app --host 0.0.0.0 --port 8000 --reload
