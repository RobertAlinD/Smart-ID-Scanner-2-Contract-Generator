import React, { useRef, useState, useEffect } from 'react';
import { Box, Image, Button } from '@chakra-ui/react';

const IDScanner = ({ onImageCaptured }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  useEffect(() => {
    if (isCameraActive) {
      startCamera();
    }
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [isCameraActive]);

  const startCamera = () => {
    navigator.mediaDevices.getUserMedia({
      video: { facingMode: { exact: 'environment' } } // Folosește camera din spate
    })
    .then(stream => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
      }
    })
    .catch(error => {
      console.error('Eroare la accesarea camerei: ', error);
      alert('Camera din spate nu este disponibilă. Vă rugăm să verificați setările browserului.');
    });
  };

  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (video && canvas) {
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL('image/png');
      setCapturedImage(dataUrl);
      onImageCaptured(dataUrl);
      setIsCameraActive(false);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setIsCameraActive(true);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      width="100vw"
      p={2}
      bg="gray.50"
    >
      <Box mb={4} display="flex" flexDirection="column" alignItems="center">
        {capturedImage && (
          <Image
            src={capturedImage}
            alt="Captured"
            maxWidth="90%"
            maxHeight="90%"
            borderRadius="md"
            boxShadow="md"
            border="2px solid #3182ce"
          />
        )}
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
        {isCameraActive ? (
          <>
            <video
              ref={videoRef}
              width="320"
              height="240"
              style={{ borderRadius: 'md', boxShadow: 'md', border: '2px solid #3182ce' }}
            />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            <Button onClick={captureImage} colorScheme="teal" size="sm" mt={2}>
              Capture Image
            </Button>
          </>
        ) : (
          <>
            {!capturedImage ? (
              <Button onClick={() => setIsCameraActive(true)} colorScheme="blue" size="sm" mt={2}>
                Start Camera
              </Button>
            ) : (
              <Button onClick={handleRetake} colorScheme="teal" size="sm" mt={2}>
                Retake Photo
              </Button>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default IDScanner;
