import React, { useState } from 'react';
import { Box, Button, Input, Image, VStack, Heading } from '@chakra-ui/react';
import AutoFormComplet from './autoFormComplet';
import extractDataFromImage from './ocrService';
import '../App.css'; // Asigură-te că calea către fișierul CSS este corectă

function App() {
  const [image, setImage] = useState(null);
  const [data, setData] = useState({
    nume: '',
    prenume: '',
    cnp: '',
    cetatenie: '',
    locNastere: '',
    adresa: '',
    seria: '',
    nr: ''
  });

  const handleImageCapture = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result.replace("data:", "").replace(/^.+,/, "");

        // Extrage textul din imagine folosind API-ul OCR.Space
        const result = await extractDataFromImage(base64String);
        console.log("Extracted Text:", result.rawText);

        setData(result.processedData); // Actualizează starea cu datele extrase
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (values) => {
    console.log("Submitted Values:", values);
  };

  return (
    <VStack className="app-container" spacing={4}>
      <Heading as="h1" size="xl" textAlign="center" mb={4}>
     Smart ID Scanner 2 Contract Generator
      </Heading>
      
      <Box textAlign="center">
        <Input
          type="file"
          accept="image/*"
          onChange={handleImageCapture}
          display="none"
          id="file-upload"
        />
        <label htmlFor="file-upload">
          <Button
            as="span"
            colorScheme="blue"
            mb={4}
            className="upload-button"
          >
            Upload Image
          </Button>
        </label>
        {image && (
          <Box mt={4} textAlign="center">
            <Image
              src={image}
              alt="Preview"
              boxSize="500px"
              objectFit="contain"
              borderWidth={1}
              borderColor="gray.300"
            />
          </Box>
        )}
      </Box>
      <AutoFormComplet
        initialData={data}
        onSubmit={handleSubmit}
        className="form-container"
      />
    </VStack>
  );
}

export default App;
