// src/services/taskService.js
import axios from 'axios';

// Path to your local JSON file
const LOCAL_JSON_FILE_URL = '/data/tasks.json'; 

// Create an Axios instance with base URL and headers
const apiClient = axios.create({
  baseURL: LOCAL_JSON_FILE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to fetch recommended tasks
// src/services/taskService.js
export const fetchRecommendedTasks = async () => {
  const response = await fetch('/data/tasks.json'); // Adjust path if needed
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json(); // Return the JSON data
};
