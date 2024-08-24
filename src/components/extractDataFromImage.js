// src/components/extractDataFromImage.js
import Tesseract from 'tesseract.js';

const extractDataFromImage = async (image) => {
  try {
    const { data: { text } } = await Tesseract.recognize(
      image,
      'ron+eng+fra', // Limba română, engleză și franceză
      {
        logger: (m) => console.log(m), // opțional: urmărește progresul
      }
    );
    
    // Returnează atât textul extras cât și datele procesate
    return {
      rawText: text,
      processedData: parseIdData(text)
    };
  } catch (error) {
    console.error("Eroare la recunoașterea textului: ", error);
    return {
      rawText: 'Eroare la recunoașterea textului',
      processedData: {
        cnp: 'Informație lipsă',
        serie: 'Informație lipsă',
        numar: 'Informație lipsă',
        nume: 'Informație lipsă',
        prenume: 'Informație lipsă',
        nationalitate: 'Informație lipsă',
        locNastere: 'Informație lipsă',
        domiciliu: 'Informație lipsă'
      }
    };
  }
};

const parseIdData = (text) => {
  // Normalize the text
  const cleanedText = text
    .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
    .replace(/[\n\r]+/g, ' ') // Replace newlines with a space
    .replace(/[^a-zA-Z0-9\s\/\-:]+/g, '') // Remove unwanted characters, keeping alphanumeric, spaces, slashes, dashes, and colons
    .toUpperCase(); // Convert to uppercase for consistency

  const patterns = {
    serie: /SERIA\s*([A-Z]{2})/i, // Două litere mari
    numar: /NR\s*(\d{1,6})/i, // Până la 6 cifre
    cnp: /\b\d{13}\b/i, // CNP format din exact 13 cifre
    nume: /Nume\/Nom\/Last name\s*:\s*([A-Z\s\-]+)/i, // Nume scris cu litere mari
    prenume: /Prenume\/Prenom\/First name\s*:\s*([A-Z\s\-]+)/i, // Prenume scris cu litere mari
    nationalitate: /Cetăţenie\/Nationalite\/Nationality\s*:\s*([A-Z\s\/]+)/i, // Naționalitate
    locNastere: /Loc naștere\/Lieu de naissance\/Place of birth\s*:\s*([^\d]+)\d*/i, // Loc de naștere (până la prima cifră)
    domiciliu: /Domiciliu\/Adresse\/Address\s*:\s*(.*)/i // Domiciliu
  };

  const matchedData = {};
  for (const [key, pattern] of Object.entries(patterns)) {
    const match = cleanedText.match(pattern);
    matchedData[key] = match && match[1] ? match[1].trim() : 'Informație lipsă';
  }

  return matchedData;
};

export default extractDataFromImage;
