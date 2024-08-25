import React, { useState } from 'react';
import IDScanner from './IDScanner';
import extractDataFromImage from './ocrService';
import { Box, Input, Text } from '@chakra-ui/react';

function App() {
  const [rawText, setRawText] = useState('');
  const [capturedImage, setCapturedImage] = useState('');

  const handleImageCapture = async (image) => {
    setCapturedImage(image);
    try {
      const result = await extractDataFromImage(image);
      setRawText(result.ParsedText || 'Informație lipsă');
    } catch (error) {
      console.error("Eroare la capturarea imaginii sau extragerea datelor: ", error);
      setRawText('Eroare la recunoașterea textului.');
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result.replace(/^data:image\/[a-z]+;base64,/, '');
        await handleImageCapture(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      width="100vw"
      p={4}
      bg="gray.50"
    >
      <IDScanner onImageCaptured={handleImageCapture} />
      <Input
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        mt={4}
        variant="outline"
        width={{ base: 'full', sm: 'md' }}
      />
      <Box
        mt={4}
        p={4}
        borderWidth={1}
        borderRadius="md"
        bg="white"
        boxShadow="md"
        width={{ base: 'full', sm: 'md' }}
        textAlign="center"
      >
        <Text fontWeight="bold" fontSize="lg" mb={2}>Text extras:</Text>
        <Text whiteSpace="pre-wrap">{rawText}</Text>
      </Box>
    </Box>
  );
}

export default App;
