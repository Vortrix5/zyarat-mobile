# Zyarat Mobile App

A React Native mobile application for detecting and providing information about Tunisian historical artifacts using AI-powered image recognition.

## Features

- Scan artifacts using your phone's camera
- Get detailed historical information about the artifact
- Share discoveries with friends
- Browse artifact information even without scanning

## Architecture

The application consists of:

1. **Mobile client** - React Native app using Expo
2. **AI Server** - Python server with FastAPI and Gemma 3 for advanced artifact detection

## Getting Started

### Setting up the Mobile App

1. Install dependencies:

```bash
npm install
# or
yarn install
```

2. Update the server URL:
Open `utils/serverApi.js` and update the `API_URL` constant with your server's address.

3. Start the development server:

```bash
npx expo start
```

4. Run on your device:
   - Scan the QR code with the Expo Go app
   - Or press 'i' or 'a' in the terminal to run on iOS/Android emulator

### Setting up the Server

1. **Prerequisites**:
   - Install [Ollama](https://ollama.com/)
   - Make sure Ollama is running

2. Navigate to the server folder:

```bash
cd server
```

3. Run the setup script:

```bash
chmod +x run.sh
./run.sh
```

The script will:

- Check if Python 3 and pip are installed
- Verify Ollama is running and pull the Gemma 3 model if needed
- Create a virtual environment and install dependencies
- Start the server on port 8000

4. Access the server at `http://localhost:8000`

## Development

The app is built with:

- React Native with Expo
- React Navigation for routing
- Expo Camera for image capture
- FastAPI for the server
- Gemma 3 (via Ollama) for AI-powered artifact analysis

## Testing the App

1. Start both the mobile app and the server
2. On the app's home screen, tap "Scan"
3. Point the camera at a Tunisian historical artifact
4. Review the information displayed about the artifact

## Troubleshooting

### Server Connection Issues

If your mobile app cannot connect to the server:

1. Make sure the server is running and accessible from your mobile device
2. Update the `API_URL` in `utils/serverApi.js` to match your computer's IP address on the network
3. Ensure no firewall is blocking the connection

### Ollama Issues

If you encounter problems with Ollama:

1. Ensure Ollama is installed and running
2. Check if the Gemma model is available: `ollama list`
3. If not, pull it manually: `ollama pull gemma:3b`
