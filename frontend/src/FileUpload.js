import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = ({ setProducts, setIsUpdateEnabled }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };


  const handleUpload = async () => {
    if (!file) {
      alert('Nenhum arquivo selecionado');
      return;
    }


    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:3000/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setProducts(response.data.products);

      const allProductsValidated = response.data.products.every(
        (product) => product.validationErrors.length === 0
      );

      setIsUpdateEnabled(allProductsValidated);
    } catch (error) {
      console.error('Erro ao fazer upload do arquivo:', error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>VALIDAR</button>
    </div>
  );
};


export default FileUpload;