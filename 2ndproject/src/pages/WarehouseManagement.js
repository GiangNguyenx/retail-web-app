import React, { useState, useEffect, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaEdit, FaTrash, FaPlus, FaTimes } from "react-icons/fa";
import { productApi, categoryApi } from "../api/apiService";
import LoadingSpinner from "../components/LoadingSpinner"; // Đảm bảo bạn có component này

// Các Input component có thể giữ nguyên hoặc cải tiến nếu muốn (ví dụ: thêm label prop)
const WarehouseTextArea = ({ label, row, placeholder, name, value, onChange, required }) => (
    <div className="mb-4">
        {label && <label htmlFor={name} className="block mb-1 text-sm font-medium text-gray-700">{label}</label>}
        <textarea
            id={name} rows={row} placeholder={placeholder} name={name} value={value} onChange={onChange} required={required}
            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
    </div>
);

const WarehouseInputBox = ({ label, type, placeholder, name, value, onChange, required, step, min }) => (
     <div className="mb-4">
        {label && <label htmlFor={name} className="block mb-1 text-sm font-medium text-gray-700">{label}</label>}
        <input
            id={name} type={type} placeholder={placeholder} name={name} value={value} onChange={onChange} required={required} step={step} min={min}
            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
    </div>
);


export const WarehouseManagement = () => {
    const navigate = useNavigate();
    const userInfo = useSelector((store) => store.bazar.userInfo);

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [formMode, setFormMode] = useState("add"); // "add" or "edit"
    const [currentProduct, setCurrentProduct] = useState(null); // Sản phẩm đang được chỉnh sửa
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const initialFormData = {
        name: "", // API 4.3 yêu cầu 'name', không phải 'title'
        title: "", // API 4.1 có 'title', API 4.3 không có 'title' -> Nên thống nhất backend. Tạm dùng name.
        price: "",
        oldPrice: "",
        stock: "", // Đổi 'quantity' thành 'stock' cho khớp API 4.3
        description: "",
        categoryId: "", // Sẽ lưu ID của category
        image: "",
        images: [], // API 4.3 có images là mảng string
        isNew: false,
        isFeatured: false, // Thêm isFeatured nếu API hỗ trợ
    };
    const [formData, setFormData] = useState(initialFormData);

    // Kiểm tra quyền admin
    useEffect(() => {
        if (userInfo && userInfo.role !== 'admin') {
            toast.error('Access denied. Admin privileges required.');
            navigate('/');
        }
    }, [userInfo, navigate]);

    // Fetch dữ liệu ban đầu (products và categories)
    const loadInitialData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [productsData, categoriesData] = await Promise.all([
                productApi.getProducts(),
                categoryApi.getCategories()
            ]);

            if (Array.isArray(productsData)) {
                setProducts(productsData);
            } else {
                console.warn("Unexpected products data structure:", productsData);
                setProducts([]);
            }

            if (Array.isArray(categoriesData)) {
                setCategories(categoriesData);
            } else {
                console.warn("Unexpected categories data structure:", categoriesData);
                setCategories([]);
            }
        } catch (err) {
            setError(err.message || "Failed to load initial data.");
            console.error("Error loading initial data:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (userInfo && userInfo.role === 'admin') { // Chỉ load data nếu là admin
             loadInitialData();
        }
    }, [userInfo, loadInitialData]);


    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };
    
    // Xử lý khi thay đổi nhiều URL ảnh (images)
    const handleImagesChange = (e) => {
        // Giả sử người dùng nhập các URL cách nhau bằng dấu phẩy
        const urls = e.target.value.split(',').map(url => url.trim()).filter(url => url);
        setFormData(prev => ({ ...prev, images: urls }));
    };


    const resetAndHideForm = () => {
        setFormData(initialFormData);
        setCurrentProduct(null);
        setFormMode("add");
        setIsFormVisible(false);
    };

    const handleAddNewClick = () => {
        resetAndHideForm();
        setFormMode("add");
        setIsFormVisible(true);
    };

    const handleEditClick = (product) => {
        setFormMode("edit");
        setCurrentProduct(product);
        setFormData({
            name: product.name || product.title || "", // Ưu tiên 'name'
            title: product.title || product.name || "", // Giữ title nếu có, hoặc dùng name
            price: product.price || "",
            oldPrice: product.oldPrice || "",
            stock: product.stock || product.quantity || "", // Ưu tiên 'stock'
            description: product.description || "",
            categoryId: product.categoryId || (typeof product.category === 'object' ? product.category.id || product.category._id : ""),
            image: product.image || "",
            images: product.images || [],
            isNew: product.isNew || false,
            isFeatured: product.isFeatured || false,
        });
        setIsFormVisible(true);
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Cuộn lên đầu trang để thấy form
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const payload = {
            name: formData.name, // API 4.3 yêu cầu name
            title: formData.title || formData.name, // Backend có thể tự xử lý title từ name nếu cần
            description: formData.description,
            price: parseFloat(formData.price),
            oldPrice: formData.oldPrice ? parseFloat(formData.oldPrice) : null,
            stock: parseInt(formData.stock, 10),
            image: formData.image,
            images: formData.images, // Gửi mảng images
            categoryId: formData.categoryId,
            isNew: formData.isNew,
            isFeatured: formData.isFeatured,
            // isActive: true, // API 4.3, 4.4 không có isActive, thường được set mặc định ở backend
        };
        // Loại bỏ các trường null/undefined không cần thiết nếu backend không muốn nhận
        // Object.keys(payload).forEach(key => (payload[key] == null || payload[key] === '') && delete payload[key]);


        try {
            if (formMode === "add") {
                const newProduct = await productApi.createProduct(payload); // API trả về product object
                if (newProduct && (newProduct.id || newProduct._id)) {
                    setProducts(prevProducts => [newProduct, ...prevProducts]);
                    toast.success("Product added successfully!");
                    resetAndHideForm();
                } else {
                    toast.error(newProduct?.message || "Failed to add product, invalid response.");
                }
            } else if (currentProduct) {
                const updatedProduct = await productApi.updateProduct(currentProduct.id || currentProduct._id, payload);
                if (updatedProduct && (updatedProduct.id || updatedProduct._id)) {
                    setProducts(prevProducts =>
                        prevProducts.map(p => (p.id || p._id) === (currentProduct.id || currentProduct._id) ? updatedProduct : p)
                    );
                    toast.success("Product updated successfully!");
                    resetAndHideForm();
                } else {
                     toast.error(updatedProduct?.message || "Failed to update product, invalid response.");
                }
            }
        } catch (error) {
            // Lỗi đã được toast bởi apiService interceptor
            console.error("Error saving product:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm("Are you sure you want to delete this product? This action might be irreversible.")) {
            try {
                const response = await productApi.deleteProduct(productId); // API trả về {message: "..."}
                if (response && response.message) {
                    toast.success(response.message);
                    setProducts(prevProducts => prevProducts.filter(p => (p.id || p._id) !== productId));
                } else {
                     toast.error(response?.message || "Failed to delete product.");
                }
            } catch (error) {
                console.error("Error deleting product:", error);
            }
        }
    };


    if (loading) return (
        <div className="flex items-center justify-center h-screen">
            <LoadingSpinner text="Loading warehouse data..." size="large"/>
        </div>
    );
    if (error) return (
        <div className="container px-4 py-8 mx-auto text-center">
            <p className="text-xl text-red-500">{error}</p>
            <button onClick={loadInitialData} className="px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600">Retry</button>
        </div>
    );


    return (
        <>
            <section className="py-10 bg-gray-50 lg:py-16">
                <div className="container px-4 mx-auto">
                    <div className="flex flex-col items-center justify-between gap-4 mb-10 md:flex-row">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Product Warehouse</h1>
                            <p className="mt-1 text-gray-600">Manage your product inventory.</p>
                        </div>
                        {!isFormVisible && (
                            <button
                                onClick={handleAddNewClick}
                                className="flex items-center px-6 py-3 text-sm font-medium text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                <FaPlus className="mr-2" /> Add New Product
                            </button>
                        )}
                    </div>

                    {isFormVisible && (
                        <div className="p-6 mb-10 bg-white rounded-lg shadow-xl md:p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-semibold text-gray-700">
                                    {formMode === "add" ? "Create New Product" : `Edit Product: ${currentProduct?.name || currentProduct?.title || ''}`}
                                </h2>
                                <button type="button" onClick={resetAndHideForm} className="text-gray-500 hover:text-red-600">
                                    <FaTimes size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2 lg:grid-cols-3">
                                    <WarehouseInputBox label="Product Name *" type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                                    <WarehouseInputBox label="Title (SEO/Display)" type="text" name="title" value={formData.title} onChange={handleInputChange} />
                                     <div>
                                        <label htmlFor="categoryId" className="block mb-1 text-sm font-medium text-gray-700">Category *</label>
                                        <select name="categoryId" id="categoryId" value={formData.categoryId} onChange={handleInputChange} required
                                            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                            <option value="">Select Category</option>
                                            {categories.map(cat => (
                                                <option key={cat.id || cat._id} value={cat.id || cat._id}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <WarehouseInputBox label="Current Price ($) *" type="number" name="price" value={formData.price} onChange={handleInputChange} required step="0.01" min="0"/>
                                    <WarehouseInputBox label="Old Price ($)" type="number" name="oldPrice" value={formData.oldPrice} onChange={handleInputChange} step="0.01" min="0"/>
                                    <WarehouseInputBox label="Stock Quantity *" type="number" name="stock" value={formData.stock} onChange={handleInputChange} required min="0"/>
                                    <div className="md:col-span-2 lg:col-span-3">
                                      <WarehouseInputBox label="Main Image URL *" type="text" name="image" value={formData.image} onChange={handleInputChange} required />
                                      {formData.image && <img src={formData.image} alt="Main preview" className="object-contain mt-2 rounded h-28"/>}
                                    </div>
                                     <div className="md:col-span-2 lg:col-span-3">
                                        <WarehouseTextArea label="Other Image URLs (comma-separated)" name="images" value={formData.images.join(', ')} onChange={handleImagesChange} row="2" placeholder="url1.jpg, url2.png, ..." />
                                        {formData.images.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {formData.images.map((imgUrl, idx) => (
                                                    <img key={idx} src={imgUrl} alt={`Preview ${idx+1}`} className="object-contain border rounded h-14 w-14"/>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="md:col-span-2 lg:col-span-3">
                                        <WarehouseTextArea label="Product Description *" name="description" value={formData.description} onChange={handleInputChange} required row="4" />
                                    </div>
                                    <div className="flex items-center gap-6 md:col-span-2 lg:col-span-3">
                                        <label className="flex items-center mt-2">
                                            <input type="checkbox" name="isNew" checked={formData.isNew} onChange={handleInputChange} className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                                            <span className="ml-2 text-sm text-gray-700">Mark as New Product</span>
                                        </label>
                                        <label className="flex items-center mt-2">
                                            <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleInputChange} className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                                            <span className="ml-2 text-sm text-gray-700">Mark as Featured Product</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="flex items-center justify-end gap-4 pt-6 mt-6 border-t">
                                    <button type="button" onClick={resetAndHideForm} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md shadow-sm hover:bg-gray-200 focus:outline-none">Cancel</button>
                                    <button type="submit" disabled={isSubmitting} className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none disabled:bg-indigo-300">
                                        {isSubmitting ? <LoadingSpinner size="small" text=""/> : (formMode === "add" ? "Add Product" : "Update Product")}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Products List */}
                     {loading && products.length > 0 && <div className="py-4 text-center"><LoadingSpinner text="Refreshing products..." /></div>}

                    {!loading && products.length === 0 && !error && (
                        <div className="p-10 text-center bg-white rounded-lg shadow">
                            <p className="text-xl text-gray-500">No products found.</p>
                            <p className="mt-2 text-gray-400">Click "Add New Product" to get started.</p>
                        </div>
                    )}
                    
                    {products.length > 0 && (
                        <div className="overflow-x-auto bg-white rounded-lg shadow">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Image</th>
                                        <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Name</th>
                                        <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Category</th>
                                        <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Price</th>
                                        <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Stock</th>
                                        <th className="px-4 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {products.map((product) => (
                                        <tr key={product.id || product._id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <img src={product.image || 'https://via.placeholder.com/48'} alt={product.name || product.title} className="object-cover w-12 h-12 rounded-md" />
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="text-sm font-medium text-gray-900">{product.name || product.title}</div>
                                                <div className="text-xs text-gray-500">ID: {product.id || product._id}</div>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">
                                                    {product.category?.name || categories.find(c => c.id === product.categoryId)?.name || 'N/A'}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">${parseFloat(product.price).toFixed(2)}</div>
                                                {product.oldPrice && <div className="text-xs text-gray-500 line-through">${parseFloat(product.oldPrice).toFixed(2)}</div>}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className={`text-sm font-semibold ${ (product.stock || product.quantity || 0) < 10 ? 'text-red-600' : 'text-green-600'}`}>
                                                    {product.stock || product.quantity || 0}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-center whitespace-nowrap">
                                                <div className="flex items-center justify-center space-x-2">
                                                    <button onClick={() => handleEditClick(product)} title="Edit Product" className="p-2 text-indigo-600 rounded-md hover:bg-indigo-100">
                                                        <FaEdit className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleDeleteProduct(product.id || product._id)} title="Delete Product" className="p-2 text-red-600 rounded-md hover:bg-red-100">
                                                        <FaTrash className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </section>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
        </>
    );
};

export default WarehouseManagement; // Đảm bảo export default nếu đây là file chính