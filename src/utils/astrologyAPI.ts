import axios from 'axios';

const API_URL = 'https://freeastrologyapi.com/api'; // Replace with the actual API endpoint

export const fetchKundaliData = async (kundaliDetails) => {
    try {
        const response = await axios.post(`${API_URL}/kundali`, kundaliDetails);
        return response.data;
    } catch (error) {
        console.error('Error fetching kundali data:', error);
        throw new Error('Failed to fetch kundali data');
    }
};

export const getGeminiResponse = async (kundaliData) => {
    try {
        const response = await axios.post(`${API_URL}/gemini`, kundaliData);
        return response.data;
    } catch (error) {
        console.error('Error fetching Gemini response:', error);
        throw new Error('Failed to fetch Gemini response');
    }
};

// Add more functions for other astrology-related API calls as needed
