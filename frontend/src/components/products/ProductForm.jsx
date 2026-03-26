import { useState, useEffect } from 'react';
import { productService } from '../../services/productService';

export default function ProductForm({ product, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    quantity: '',
    minStockLevel: 10,
    description: ''
  });

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (product) {
        await productService.update(product._id, formData);
      } else {
        await productService.create(formData);
      }
      onClose();
    } catch (error) {
      alert('Error saving product');
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', padding: '30px', borderRadius: '8px', width: '500px' }}>
        <h2>{product ? 'Edit Product' : 'Add Product'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Product Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
            required
          />
          <input
            type="number"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
            required
          />
          <input
            type="number"
            placeholder="Min Stock Level"
            value={formData.minStockLevel}
            onChange={(e) => setFormData({ ...formData, minStockLevel: e.target.value })}
            style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            style={{ width: '100%', padding: '10px', marginBottom: '10px', minHeight: '80px' }}
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" style={{ flex: 1, padding: '10px', background: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>
              Save
            </button>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: '10px', background: '#6c757d', color: 'white', border: 'none', cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
