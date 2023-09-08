import React, { useState } from 'react';
import './App.css';
import FileUpload from './FileUpload';
import ProductList from './ProductList';
import axios from 'axios';

function App() {
  const [products, setProducts] = useState([]);
  const [isUpdateEnabled, setIsUpdateEnabled] = useState(false);

  const handleUpdate = async () => {
    if (Array.isArray(products)) {
      const allProductsValidated = products.every((product) => product.validationErrors.length === 0);
  
      if (allProductsValidated) {
        try {
          const productsToUpdate = products.map((product) => ({
            code: product.code,
            costPrice: product.cost_price,
            newPrice: product.newPrice || product.sales_price,
          }));
  
          console.log("Dados enviados para atualização:", productsToUpdate);
  
          await axios.post('http://localhost:3000/update-prices', { updatedProducts: productsToUpdate });
          alert('Preços atualizados com sucesso');
        } catch (error) {
          console.error('Erro ao atualizar preços:', error);
          alert('Erro ao atualizar preços');
        }
      } else {
        alert('Não é possível atualizar. Verifique se todos os produtos estão validados.');
      }
    } else {
      alert('Nenhum produto para atualizar.');
    }
  };
  
  return (
    <div className="App">
      <h1>Validação de Arquivo de Precificação</h1>
      <FileUpload setProducts={setProducts} setIsUpdateEnabled={setIsUpdateEnabled} />
      <ProductList products={products} />

      <button onClick={handleUpdate} disabled={!isUpdateEnabled}>
        ATUALIZAR
      </button>
    </div>
  );
}

export default App;
