import React, { useState, useEffect } from 'react';
import { FaRegTrashAlt } from "react-icons/fa";
import UseFormContext from "../../../src/context/UseFormContext";

export default function FileUpload(props) {
  const formContext = UseFormContext();
  const [selectedFile, setselectedFile] = useState(null);
  const [previewURL, setpreviewURL] = useState();


  useEffect(() => {
    props.returnData(selectedFile, previewURL, props.type)
  }, [selectedFile, previewURL]);
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    // Store the selected file in component state
    if (file?.size > 10000000) {
      formContext.notifyError("Size of document should be less than 10MB")
      return
    }
    setselectedFile(file)
    // Display preview for images
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setpreviewURL(reader.result)
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = () => {
    // Reset state to remove uploaded file
    setselectedFile(null)
    setpreviewURL("")

  };

  return (
    <div className='fileupload-wrap'>
      <label className="custom-file-upload primary-btn">
        <input type="file" onChange={(e) => handleFileChange(e)} />
        Upload
      </label>
      {selectedFile && (
        <div className='text-center'>
          {selectedFile?.type.startsWith('image/') ? (
            <img src={previewURL} alt="Preview" className="preview-image" />
          ) : (
            <p>Preview not available for this file type</p>
          )}
          <p className='mb-1'>{selectedFile?.name}</p>
          <button className='danger-btn' onClick={handleDelete}>Delete <FaRegTrashAlt /> </button>
        </div>
      )}
    </div>
  );


}

