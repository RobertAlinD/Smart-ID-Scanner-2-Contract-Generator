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

        console.log('API Response:', response.data);  

        if (response.data && response.data.ParsedResults && response.data.ParsedResults.length > 0) {
            const text = response.data.ParsedResults[0].ParsedText || 'Nu s-a putut extrage textul din imagine.';
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

const parseIdData = (text) => {
    const cleanedText = text
        .replace(/\s+/g, ' ')
        .replace(/[\n\r]+/g, ' ')
        .replace(/[^a-zA-Z0-9\s\/\-:ăâîșțȘȚåä\.]+/g, '') 
        .toUpperCase();

    const patterns = {
        seria: /SERIA\s*([A-Z]{2})\b/,
        nr: /\s*(\d{6})\b/i,
        cnp: /\b(\d{13})\b/i,
        nume: /NUME\/NOM\/LAST NAME\s*([A-ZĂÂÎȘȚÅÄ]+)/i,
        prenume: /PRENUME\/PRENOM\/FIRST NAME\s*([A-ZĂÂÎȘȚÅÄ\-]+)/i,
        cetatenie: /ty\s*([A-ZĂÂÎȘȚÅÄä\s]+)\s*\/\s*([A-Z]{3})/i,
        locNastere: /(JUD\..*?)(?=\s*DOM)/i,
        adresa: /DOMICILIU\/ADRESSE\/ADDRESS\s*([\wăâîșțȘȚåä\s\.]+?(?=\s*(?:SEX|EMIS|VALABILITATE|ID|$)))/i,
    };

    const formatLocation = (location) => {
        // Înlocuiește cifra '9' cu 'Ș'
        const updatedLocation = location
            .replace(/\b(\w*9\w*)\b/g, (match) => match.replace(/9/g, 'Ș'));
    
        // Adaugă virgulă între locații, dar nu între litere și prescurtări
        const withComma = updatedLocation
            .replace(/(?<!\.\w)([A-ZȘȚ][A-ZĂÂÎȘȚÅÄ][a-zâăîșțä]*\b)(?=\s+(?:[A-ZȘȚ][A-ZĂÂÎȘȚÅÄ][a-zâăîșțä]*))+/g, '$1, ')
            .replace(/(\b[A-ZȘȚ]{1,2}\.\w+)/g, '$1, ')  // Adaugă virgulă după NR., BL., AP.
            .replace(/\s*,\s*/g, ', ')  // Normalizează spațiile înainte și după virgulă
            .replace(/,\s*$/, '');  // Elimină virgulă finală dacă există
    
        return withComma;
    };

    const data = {
        cnp: cleanedText.match(patterns.cnp)?.[1] || 'Completează câmpul manual',
        nume: cleanedText.match(patterns.nume)?.[1] || 'Completează câmpul manual',
        prenume: cleanedText.match(patterns.prenume)?.[1] || 'Completează câmpul manual',
        cetatenie: cleanedText.match(patterns.cetatenie)
            ? `${cleanedText.match(patterns.cetatenie)[1]} / ${cleanedText.match(patterns.cetatenie)[2]}`
            : 'Completează câmpul manual',
        locNastere: cleanedText.match(patterns.locNastere) 
            ? formatLocation(cleanedText.match(patterns.locNastere)[1]) 
            : 'Completează câmpul manual',
        adresa: cleanedText.match(patterns.adresa) 
            ? formatLocation(cleanedText.match(patterns.adresa)[1]) 
            : 'Completează câmpul manual',
        seria: cleanedText.match(patterns.seria)?.[1] || 'Completează câmpul manual',
        nr: cleanedText.match(patterns.nr)?.[1] || 'Completează câmpul manual'
    };

    return data;
};

export default extractDataFromImage;
