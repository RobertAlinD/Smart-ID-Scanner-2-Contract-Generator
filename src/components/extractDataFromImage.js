import Tesseract from 'tesseract.js';

const extractDataFromImage = async (image) => {
  try {
    const { data: { text } } = await Tesseract.recognize(
      image,
      'ron+eng+fra',
      {
        logger: (m) => console.log(m),
      }
    );

   
    console.log("Extracted Text:", text);

    
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
        cetatenie: 'Informație lipsă',
        locNastere: 'Informație lipsă',
        adresa: 'Informație lipsă'
      }
    };
  }
};

const parseIdData = (text) => {
  const cleanedText = text
    .replace(/\s+/g, ' ') 
    .replace(/[\n\r]+/g, ' ') 
    .replace(/[^a-zA-Z0-9\s\/\-:]+/g, '') 
    .toUpperCase(); 

  const patterns = {
    serie: /SERIA\s*([A-Z]{2})/i,
    numar: /NR\s*(\d{1,6})/i,
    cnp: /\b\d{13}\b/i,
    nume: /Nume\/Nom\/Last name\s*:\s*([A-Z\s\-]+)/i,
    prenume: /Prenume\/Prenom\/First name\s*:\s*([A-Z\s\-]+)/i,
    cetatenie: /Cetăţenie\/Nationalite\/Nationality\s*:\s*([A-Z\s\/]+)/i,
    locNastere: /Loc naștere\/Lieu de naissance\/Place of birth\s*:\s*([^\d]+)\d*/i,
    adresa: /Domiciliu\/Adresse\/Address\s*:\s*(.*)/i
  };

  const matchedData = {};
  for (const [key, pattern] of Object.entries(patterns)) {
    const match = cleanedText.match(pattern);
    matchedData[key] = match && match[1] ? match[1].trim() : 'Informație lipsă';
  }

  return matchedData;
};

export default extractDataFromImage;
