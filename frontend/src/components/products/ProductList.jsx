import { useState, useEffect } from 'react';
import { productService } from '../../services/productService';
import ProductForm from './ProductForm';

import { Plus, Pencil, Trash2, Search } from "lucide-react";

export default function ProductList() {

  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [search, setSearch] = useState('');

  /* fetch products when search changes */

  useEffect(() => {
    fetchProducts();
  }, [search]);


  /* listen for inventory updates from chat */

  useEffect(() => {

    const handler = () => {
      fetchProducts();
    };

    window.addEventListener("inventoryUpdated", handler);

    return () => {
      window.removeEventListener("inventoryUpdated", handler);
    };

  }, []);


  const fetchProducts = async () => {

    try {

      const response = await productService.getAll({ search });

      /* support both API response formats */

      const data = response.data?.products || response.data;

      setProducts(data);

    } catch (error) {

      console.error('Error fetching products:', error);

    }

  };


  const handleDelete = async (id) => {

    if (window.confirm('Delete this product?')) {

      try {

        await productService.delete(id);

        fetchProducts();

      } catch (error) {

        alert('Error deleting product');

      }

    }

  };


  const handleEdit = (product) => {

    setEditProduct(product);

    setShowForm(true);

  };


  const handleFormClose = () => {

    setShowForm(false);

    setEditProduct(null);

    fetchProducts();

  };


  return (

    <div className="space-y-8">

      {/* HEADER */}

      <div className="flex justify-between items-center">

        <h1 className="text-2xl font-semibold text-gray-800">
          Products
        </h1>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-xl shadow hover:opacity-90 transition"
        >
          <Plus size={16} />
          Add Product
        </button>

      </div>


      {/* SEARCH */}

      <div className="relative max-w-md">

        <Search
          size={16}
          className="absolute left-3 top-3 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

      </div>


      {/* FORM */}

      {showForm && (
        <ProductForm product={editProduct} onClose={handleFormClose} />
      )}


      {/* PRODUCT TABLE */}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-gray-50 text-gray-600">

            <tr>

              <th className="text-left px-6 py-4">Name</th>

              <th className="text-left px-6 py-4">Unit Price</th>

              <th className="text-left px-6 py-4">Quantity</th>

              <th className="text-left px-6 py-4">Min Stock</th>

              <th className="text-left px-6 py-4">Total Value</th>

              <th className="text-right px-6 py-4">Actions</th>

            </tr>

          </thead>

          <tbody>

            {products.map(product => {

              const lowStock =
                product.quantity <= (product.minStockLevel || 10);

              const totalValue = product.price * product.quantity;

              return (

                <tr
                  key={product._id}
                  className="border-t hover:bg-gray-50 transition"
                >

                  {/* NAME */}

                  <td className="px-6 py-4 font-medium text-gray-800">
                    {product.name}
                  </td>


                  {/* UNIT PRICE */}

                  <td className="px-6 py-4 text-gray-600">
                    ₹{product.price}
                  </td>


                  {/* QUANTITY */}

                  <td className="px-6 py-4">

                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium
                      ${lowStock
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                      }`}
                    >
                      {product.quantity}
                    </span>

                  </td>


                  {/* MIN STOCK */}

                  <td className="px-6 py-4 text-gray-600">
                    {product.minStockLevel}
                  </td>


                  {/* TOTAL VALUE */}

                  <td className="px-6 py-4 font-medium text-indigo-600">
                    ₹{totalValue.toLocaleString("en-IN")}
                  </td>


                  {/* ACTIONS */}

                  <td className="px-6 py-4 flex justify-end gap-2">

                    <button
                      onClick={() => handleEdit(product)}
                      className="p-2 rounded-lg hover:bg-gray-100"
                    >
                      <Pencil size={16} className="text-indigo-500" />
                    </button>

                    <button
                      onClick={() => handleDelete(product._id)}
                      className="p-2 rounded-lg hover:bg-gray-100"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </button>

                  </td>

                </tr>

              );

            })}

          </tbody>

        </table>

      </div>

    </div>

  );

}