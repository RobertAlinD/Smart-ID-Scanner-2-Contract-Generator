import axios from 'axios';

const API_KEY = 'K83887165588957';  // Cheia ta API de la OCR.Space
const OCR_API_URL = 'https://api.ocr.space/parse/image';

async function extractDataFromImage(image) {
    try {
        const formData = new FormData();
        formData.append('base64image', `data:image/jpeg;base64,${image}`);
        formData.append('apikey', API_KEY);
        
        const response = await axios.post(OCR_API_URL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        console.log('API Response:', response.data);  // Afișează răspunsul complet

        if (response.data && response.data.ParsedResults && response.data.ParsedResults.length > 0) {
            // Normalizează textul pentru a elimina diacriticele
            const text = removeDiacritics(response.data.ParsedResults[0].ParsedText || 'Nu s-a putut extrage textul din imagine.');
            return {
                rawText: text,
                processedData: parseIdData(text)
            };
        } else {
            throw new Error('Nu s-a putut extrage textul din imagine.');
        }
    } catch (error) {
        console.error('Eroare la extragerea textului: ', error);
        return {
            rawText: 'Eroare la recunoașterea textului.',
            processedData: {
                cnp: 'Completează câmpul manual',
                serie: 'Completează câmpul manual',
                numar: 'Completează câmpul manual',
                nume: 'Completează câmpul manual',
                prenume: 'Completează câmpul manual',
                nationalitate: 'Completează câmpul manual',
                locNastere: 'Completează câmpul manual',
                domiciliu: 'Completează câmpul manual'
            }
        };
    }
}

// Functie pentru eliminarea diacriticelor
function removeDiacritics(text) {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}

const parseIdData = (text) => {
    const cleanedText = text
        .replace(/\s+/g, ' ')
        .replace(/[\n\r]+/g, ' ')
        .replace(/[^a-zA-Z0-9\s\/\-:ăâîșțåä\.]+/g, '')
        .toUpperCase();

    const patterns = {
        seria: /\bTZ\s*([A-Z]{2})\b/i,
        nr: /\bNR\s*(\d{1,6})\b/i,
        cnp: /\bCNP\s*(\d{13})\b/i,
        nume: /NUME\/NOM\/LAST NAME\s*([A-ZĂÂÎȘȚÅÄ]+)/i,
        prenume: /PRENUME\/PRENOM\/FIRST NAME\s*([A-ZĂÂÎȘȚÅÄ\-]+)/i,
        cetatenie: /Cetatenie\/Natlonalite\/Nationality\s*([A-ZĂÂÎȘȚÅÄä\s]+)\s*\/\s*([A-Z]{3})/i,
        locNastere: /Loc nastere\/Lieu de naissance\/Place of birth\s*(Jud|Mun|Ors)\.([A-Z]{2})\s*(Mun|Ors)?\.([A-Z][a-z]+)/i,
        adresa: /DOMICILIU\/ADRESSE\/ADDRESS\s*([\wăâîșțåä\s\.]+?(?=\s*(?:SEX|EMIS|VALABILITATE|ID|$)))/i,
    };

    const data = {
        cnp: cleanedText.match(patterns.cnp)?.[1] || 'Completează câmpul manual',
        nume: cleanedText.match(patterns.nume)?.[1] || 'Completează câmpul manual',
        prenume: cleanedText.match(patterns.prenume)?.[1] || 'Completează câmpul manual',
        cetatenie: cleanedText.match(patterns.cetatenie)
            ? `${cleanedText.match(patterns.cetatenie)[1]} / ${cleanedText.match(patterns.cetatenie)[2]}`
            : 'Completează câmpul manual',
        locNastere: cleanedText.match(patterns.locNastere)
            ? `Jud.${cleanedText.match(patterns.locNastere)[2]} Mun.${cleanedText.match(patterns.locNastere)[4]}`
            : 'Completează câmpul manual',
        adresa: cleanedText.match(patterns.adresa)?.[1] || 'Completează câmpul manual',
        seria: cleanedText.match(patterns.seria)?.[1] || 'Completează câmpul manual',
        nr: cleanedText.match(patterns.nr)?.[1] || 'Completează câmpul manual'
    };

    return data;
};

export default extractDataFromImage;
