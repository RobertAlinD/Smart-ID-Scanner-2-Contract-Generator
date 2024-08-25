// src/ocrService.js

import axios from 'axios';

const API_KEY = 'K83887165588957';  // Cheia ta API de la OCR.Space
const OCR_API_URL = 'https://api.ocr.space/parse/image';

async function extractDataFromImage(image) {
    try {
      const formData = new FormData();
      formData.append('base64image', `data:image/png;base64,${image}`);
      formData.append('apikey', API_KEY);
      
      const response = await axios.post(OCR_API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      console.log('API Response:', response.data);  // Afișează răspunsul complet
  
      if (response.data && response.data.ParsedResults && response.data.ParsedResults.length > 0) {
        return response.data.ParsedResults[0];
      } else {
        throw new Error('Nu s-a putut extrage textul din imagine.');
      }
    } catch (error) {
      console.error('Eroare la extragerea textului: ', error);
      return { rawText: 'Eroare la recunoașterea textului.' };
    }
  }

export default extractDataFromImage;
