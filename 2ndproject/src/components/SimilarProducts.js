// src/components/SimilarProducts.js
import React, { useState, useEffect } from 'react';
import { recommendationsApi } from '../api/apiService'; // Đảm bảo đường dẫn đúng
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify'; // Giữ lại nếu có toast tùy chỉnh
import LoadingSpinner from './LoadingSpinner'; // Giả sử bạn có component này

const SimilarProducts = ({ productId }) => {
    const [similarProducts, setSimilarProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSimilarProducts = async () => {
            if (!productId) {
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                setError(null);
                const response = await recommendationsApi.getSimilarProducts(productId);
                // API 6.2 trả về { success: true, data: [{...}] }
                if (response && response.success && Array.isArray(response.data)) {
                    setSimilarProducts(response.data);
                } else if (response && response.success === false) {
                    setError(response.message || 'Could not fetch similar products.');
                    setSimilarProducts([]);
                } else {
                    console.warn("Unexpected response structure for similar products:", response);
                    setSimilarProducts([]);
                }
            } catch (err) {
                setError(err.message || 'Failed to load similar products.');
                console.error("Error fetching similar products:", err);
                setSimilarProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSimilarProducts();
    }, [productId]);

    // Component Card Sản phẩm con (hoặc dùng chung từ một file khác)
    const ProductCard = ({ product }) => {
        let displayPrice = "N/A";
        if (product.price) {
            if (typeof product.price === 'object' && product.price.low !== undefined) {
                displayPrice = `$${parseFloat(product.price.low).toFixed(2)}`;
                if (product.price.high !== undefined && product.price.high !== product.price.low) {
                    displayPrice += ` - $${parseFloat(product.price.high).toFixed(2)}`;
                }
            } else if (typeof product.price === 'number' || !isNaN(parseFloat(product.price))) {
                displayPrice = `$${parseFloat(product.price).toFixed(2)}`;
            } else {
                displayPrice = product.price; // Giữ nguyên nếu là chuỗi không phải số
            }
        }

        return (
            <Link
                // API 6.2 trả về "productId", "title", "price", "priceDifference"
                // Hoặc có thể có "similarityScore" như bạn đã code trước đó
                key={product.productId}
                to={`/product/${product.productId}`}
                className="block p-4 transition-all duration-300 bg-white rounded-lg shadow group hover:shadow-lg"
            >
                {/* Thêm ảnh nếu API trả về */}
                {/* <img src={product.image || 'https://via.placeholder.com/150'} alt={product.title} className="object-cover w-full h-32 mb-3 rounded-md group-hover:opacity-80"/> */}
                <h3 className="mb-1 text-sm font-semibold text-gray-800 truncate group-hover:text-orange-600">
                    {product.title}
                </h3>
                <p className="text-base font-bold text-orange-500">
                    {displayPrice}
                </p>
                {product.priceDifference && (
                    <p className="mt-1 text-xs text-gray-500">
                        Price Difference: ${parseFloat(product.priceDifference).toFixed(2)}
                    </p>
                )}
                {product.similarityScore && (
                    <p className="mt-1 text-xs text-gray-500">
                        Similarity: {Math.round(product.similarityScore * 100)}%
                    </p>
                )}
            </Link>
        );
    };


    if (loading) return <div className="py-6 text-center"><LoadingSpinner text="Loading similar products..." /></div>;
    // Không hiển thị lỗi ở đây nếu không muốn làm gián đoạn UI chính của ProductDetail
    // if (error) return <div className="py-6 text-center text-red-500">{error}</div>;
    if (!similarProducts || similarProducts.length === 0) return null; // Không render gì nếu không có sản phẩm tương tự

    return (
        <div className="mt-12">
            <h2 className="mb-6 text-2xl font-semibold text-gray-800">Similar Products</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {similarProducts.map((product) => (
                    <ProductCard key={product.productId} product={product} />
                ))}
            </div>
        </div>
    );
};

export default SimilarProducts;