import { createContext, useState } from 'react';
import { productService } from '../services/productService';

export const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async (params) => {
    setLoading(true);
    try {
      const response = await productService.getAll(params);
      setProducts(response.data);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (data) => {
    const response = await productService.create(data);
    setProducts([...products, response.data]);
    return response.data;
  };

  const updateProduct = async (id, data) => {
    const response = await productService.update(id, data);
    setProducts(products.map(p => p._id === id ? response.data : p));
    return response.data;
  };

  const deleteProduct = async (id) => {
    await productService.delete(id);
    setProducts(products.filter(p => p._id !== id));
  };

  return (
    <InventoryContext.Provider value={{ 
      products, 
      loading, 
      fetchProducts, 
      addProduct, 
      updateProduct, 
      deleteProduct 
    }}>
      {children}
    </InventoryContext.Provider>
  );
};
