import React from 'react';
import { Box, Button } from '@chakra-ui/react';

const FileUploadButton = ({ onFileChange }) => {
  const fileInputRef = React.useRef(null);

  const handleClick = () => {
    fileInputRef.current.click(); // Triggerează click-ul pe input-ul ascuns
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={onFileChange}
        style={{ display: 'none' }} // Ascunde input-ul real
      />
      <Button
        onClick={handleClick}
        colorScheme="blue"
        variant="outline"
        size="sm"
        borderRadius="md"
        boxShadow="md"
        _hover={{ bg: 'blue.100' }}
        mt={4}
      >
        Upload Image
      </Button>
    </Box>
  );
};

export default FileUploadButton;
