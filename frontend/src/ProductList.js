import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductList = ({ products }) => {
  const [productInfo, setProductInfo] = useState({});

  useEffect(() => {
    const fetchProductInfo = async (code) => {
      try {
        const response = await axios.get(`http://localhost:3000/get-sales-price?code=${code}`);
        setProductInfo((prevInfo) => ({
          ...prevInfo,
          [code]: response.data,
        }));
      } catch (error) {
        console.error('Erro ao buscar informações do produto:', error);
      }
    };

    products.forEach((product) => {
      if (!productInfo[product.code]) {
        fetchProductInfo(product.code);
      }
    });
  }, [products, productInfo]);

  return (
    <div>
    <h2>Produtos Validados</h2>
    <table>
      <thead>
        <tr>
          <th>Código</th>
          <th>Nome</th>
          <th>Custo</th>
          <th>Preço Atual</th>
          <th>Novo Preço</th>
          <th>Erros de Validação</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product, index) => (
          <tr key={index}>
            <td>{product.code}</td>
            <td>{productInfo[product.code]?.name}</td>
            <td>{productInfo[product.code]?.cost_price}</td>
            <td>{productInfo[product.code]?.sales_price}</td>
            <td>{product.newPrice}</td>
            <td>{product.validationErrors.join(', ')}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  );
};

export default ProductList;
