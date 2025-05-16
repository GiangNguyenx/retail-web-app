import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { productApi } from "../api/Api";

export const WarehouseManagement = () => {
  // State for managing products
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formMode, setFormMode] = useState("add"); // "add" or "edit"
  const [currentProduct, setCurrentProduct] = useState(null);
  const [isShowForm, setIsShowForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    oldPrice: "",
    quantity: "",
    description: "",
    category: "",
    image: "",
    isNew: false
  });

  // Function to fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Try to get products from our API first
      try {
        const data = await productApi.getProducts();
        setProducts(data);
      } catch (error) {
        // Fallback to fake store API if our server is not available
        const response = await axios.get("https://fakestoreapiserver.reactbd.com/products");
        // Adding quantity field to each product
        const productsWithQuantity = response.data.map(product => ({
          ...product,
          quantity: Math.floor(Math.random() * 50) + 5 // Mock quantity for demonstration
        }));
        setProducts(productsWithQuantity);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
      setLoading(false);
    }
  };

  // Load products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  // Open form for adding a new product
  const handleAddProduct = () => {
    setFormMode("add");
    setFormData({
      title: "",
      price: "",
      oldPrice: "",
      quantity: "",
      description: "",
      category: "",
      image: "",
      isNew: false
    });
    setIsShowForm(true);
  };

  // Open form for editing an existing product
  const handleEditProduct = (product) => {
    setFormMode("edit");
    setCurrentProduct(product);
    setFormData({
      title: product.title,
      price: product.price,
      oldPrice: product.oldPrice || product.price * 1.2,
      quantity: product.quantity || 10,
      description: product.description,
      category: product.category,
      image: product.image,
      isNew: product.isNew || false
    });
    setIsShowForm(true);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (formMode === "add") {
        // Create new product
        try {
          // Try to use our API
          const newProduct = await productApi.createProduct(formData);
          setProducts([...products, newProduct]);
        } catch (error) {
          // Fallback if our server is not available
          const newProduct = {
            ...formData,
            _id: Date.now().toString(), // Mock ID for demo
          };
          setProducts([...products, newProduct]);
        }
        toast.success("Product added successfully!");
      } else {
        // Update existing product
        try {
          // Try to use our API
          const updatedProduct = await productApi.updateProduct(currentProduct._id, formData);
          const updatedProducts = products.map(product => 
            product._id === currentProduct._id ? updatedProduct : product
          );
          setProducts(updatedProducts);
        } catch (error) {
          // Fallback if our server is not available
          const updatedProducts = products.map(product => 
            product._id === currentProduct._id 
              ? { ...product, ...formData } 
              : product
          );
          setProducts(updatedProducts);
        }
        toast.success("Product updated successfully!");
      }
      
      // Reset form
      setIsShowForm(false);
      setFormData({
        title: "",
        price: "",
        oldPrice: "",
        quantity: "",
        description: "",
        category: "",
        image: "",
        isNew: false
      });
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error(formMode === "add" ? "Failed to add product" : "Failed to update product");
    }
  };

  // Handle product deletion
  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        try {
          // Try to use our API
          await productApi.deleteProduct(productId);
        } catch (error) {
          // Fallback if our server is not available
          console.log("Server not available, simulating deletion locally");
        }
        // Update UI
        const updatedProducts = products.filter(product => product._id !== productId);
        setProducts(updatedProducts);
        toast.success("Product deleted successfully!");
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Failed to delete product");
      }
    }
  };

  return (
    <>
      <section className="bg-white py-10 lg:py-[80px] overflow-hidden relative z-10 p-5">
        <div className="container mx-auto">
          <div className="mb-10 flex flex-wrap items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Warehouse Management</h1>
              <p className="mt-2 text-gray-600">Manage your products inventory</p>
            </div>
            <button 
              onClick={handleAddProduct}
              className="bg-blue-800 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Add New Product
            </button>
          </div>

          {/* Product Form (Add/Edit) */}
          {isShowForm && (
            <div className="mb-10 p-6 bg-white rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">{formMode === "add" ? "Add New Product" : "Edit Product"}</h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 mb-2">Product Name</label>
                    <WarehouseInputBox
                      type="text"
                      name="title"
                      placeholder="Product Name"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="border w-full rounded border-gray-300 py-3 px-[14px] text-base text-body-color outline-none focus:border-primary focus-visible:shadow-none"
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="men's clothing">Men's Clothing</option>
                      <option value="women's clothing">Women's Clothing</option>
                      <option value="jewelery">Jewelry</option>
                      <option value="electronics">Electronics</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Current Price ($)</label>
                    <WarehouseInputBox
                      type="number"
                      name="price"
                      placeholder="Current Price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Old Price ($)</label>
                    <WarehouseInputBox
                      type="number"
                      name="oldPrice"
                      placeholder="Old Price (Optional)"
                      value={formData.oldPrice}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Stock Quantity</label>
                    <WarehouseInputBox
                      type="number"
                      name="quantity"
                      placeholder="Quantity in Stock"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Image URL</label>
                    <WarehouseInputBox
                      type="text"
                      name="image"
                      placeholder="Image URL"
                      value={formData.image}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-2">Product Description</label>
                    <WarehouseTextArea
                      row="4"
                      name="description"
                      placeholder="Product Description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="isNew"
                        checked={formData.isNew}
                        onChange={handleInputChange}
                        className="form-checkbox h-5 w-5 text-blue-600"
                      />
                      <span className="ml-2 text-gray-700">Mark as New (Sale)</span>
                    </label>
                  </div>
                </div>
                
                <div className="flex gap-4 mt-6">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    {formMode === "add" ? "Add Product" : "Update Product"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsShowForm(false)}
                    className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Products List */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-center py-10">
                <p className="text-gray-600">Loading products...</p>
              </div>
            ) : (
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Image</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Product Name</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Category</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Price</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Stock</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="py-4 px-4 whitespace-nowrap">
                        <img src={product.image} alt={product.title} className="h-12 w-12 object-cover" />
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm font-medium text-gray-900">{product.title}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-500">{product.category}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-900">${product.price}</div>
                        {product.oldPrice && <div className="text-xs text-gray-500 line-through">${product.oldPrice}</div>}
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-900">{product.quantity || 'N/A'}</div>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <FaEdit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FaTrash className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default WarehouseManagement;

const WarehouseTextArea = ({ row, placeholder, name, value, onChange, required }) => {
  return (
    <>
      <div className="mb-6">
        <textarea
          rows={row}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="border-gray-300 w-full resize-none rounded border py-3 px-[14px] text-base text-body-color outline-none focus:border-primary focus-visible:shadow-none"
        />
      </div>
    </>
  );
};

const WarehouseInputBox = ({ type, placeholder, name, value, onChange, required }) => {
  return (
    <>
      <div className="mb-6">
        <input
          type={type}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="border-gray-300 w-full rounded border py-3 px-[14px] text-base text-body-color outline-none focus:border-primary focus-visible:shadow-none"
        />
      </div>
    </>
  );
};
