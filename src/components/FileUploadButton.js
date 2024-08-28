import React from 'react';

const FileUploadButton = ({ onFileChange }) => {
  const fileInputRef = React.useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="file-upload-container">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={onFileChange}
        className="file-input-hidden"
      />
      <button onClick={handleClick} className="upload-button">
        Upload Image
      </button>
    </div>
  );
};

export default FileUploadButton;
