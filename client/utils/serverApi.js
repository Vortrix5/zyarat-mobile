import * as FileSystem from 'expo-file-system';

// URL to your Python server
// Replace 'localhost' with your computer's actual IP address
// For example: 'http://192.168.1.100:8000'
const API_URL = 'http://192.168.1.38:8000';

// Function to check if the server is reachable
export const checkServerHealth = async () => {
  try {
    console.log(`Checking server health at ${API_URL}...`);
    const response = await fetch(`${API_URL}/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      // Set a timeout of 5 seconds
      timeout: 5000,
    });

    if (!response.ok) {
      throw new Error(`Server health check failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log('Server health check successful:', data);

    // Server status check
    if (data.status !== 'ok') {
      return {
        success: false,
        error: `Server is not ready: ${data.status}`
      };
    }

    return {
      success: true,
      data
    };
  } catch (error) {
    console.error(`Server health check failed: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Analyzes an image by sending it to the server
 * @param {string} imageUri - Local URI of the image to analyze
 * @returns {Promise<Object>} Analysis results from the server
 */
export const analyzeImageWithServer = async (imageUri) => {
  try {
    console.log(`Starting upload of image to server at ${API_URL}...`);

    // Check if the file exists
    const fileInfo = await FileSystem.getInfoAsync(imageUri);
    if (!fileInfo.exists) {
      throw new Error('Image file does not exist');
    }
    console.log('Image file exists, size:', fileInfo.size);

    // First check if the server is reachable
    const healthCheck = await checkServerHealth();
    if (!healthCheck.success) {
      throw new Error(`Server is not reachable: ${healthCheck.error}`);
    }

    // Create a FormData object
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      name: 'artifact.jpg',
      type: 'image/jpeg'
    });

    console.log('Sending request to server...');

    // Upload the image to the server using the new endpoint
    const response = await fetch(`${API_URL}/analyze`, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    // Handle server response
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error (${response.status}): ${errorText}`);
    }

    const resultData = await response.json();
    console.log('Server analysis complete:', resultData);

    // Additional logging for error/identification cases
    if (resultData.error) {
      console.log(`Not recognized as artifact. Possible ID: ${resultData.possible_identification}, Confidence: ${resultData.confidence}`);
    }

    return {
      success: true,
      data: resultData
    };
  } catch (error) {
    console.error('Error in analyzeImageWithServer:', error);
    return {
      success: false,
      error: error.message || 'Unknown error occurred during server analysis'
    };
  }
};
