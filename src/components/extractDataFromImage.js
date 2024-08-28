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

    // Verifică textul extras
    console.log("Extracted Text:", text);

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
        cetatenie: 'Informație lipsă',
        locNastere: 'Informație lipsă',
        adresa: 'Informație lipsă'
      }
    };
  }
};

const parseIdData = (text) => {
  // Normalizează textul
  const cleanedText = text
    .replace(/\s+/g, ' ') // Înlocuiește spațiile multiple cu un singur spațiu
    .replace(/[\n\r]+/g, ' ') // Înlocuiește liniile noi cu un spațiu
    .replace(/[^a-zA-Z0-9\s\/\-:]+/g, '') // Elimină caracterele nedorite
    .toUpperCase(); // Convertă la majuscule pentru consistență

  // Definește modele de căutare
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
