// src/components/FrequentlyBoughtTogether.js
import React, { useState, useEffect } from 'react';
import { recommendationsApi } from '../api/apiService'; // Đảm bảo đường dẫn đúng
import { Link } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner'; // Đảm bảo đường dẫn đúng

const FrequentlyBoughtTogether = ({ productId }) => {
    const [frequentProducts, setFrequentProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFrequentProducts = async () => {
            if (!productId) {
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                setError(null);
                const response = await recommendationsApi.getFrequentlyBought(productId);
                if (response && response.success && Array.isArray(response.data)) {
                    setFrequentProducts(response.data);
                } else if (response && response.success === false) {
                    setError(response.message || 'Could not fetch frequently bought products.');
                    setFrequentProducts([]);
                } else {
                    console.warn("Unexpected response structure for frequently bought products:", response);
                    setFrequentProducts([]);
                }
            } catch (err) {
                setError(err.message || 'Failed to load frequently bought products.');
                console.error("Error fetching frequently bought products:", err);
                setFrequentProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchFrequentProducts();
    }, [productId]);

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
                displayPrice = product.price;
            }
        }

        // Xử lý hiển thị coPurchaseCount
        let displayCoPurchaseCount = "";
        if (product.coPurchaseCount) {
            if (typeof product.coPurchaseCount === 'object' && product.coPurchaseCount.low !== undefined) {
                // Giả sử bạn muốn hiển thị giá trị "low" hoặc một thông tin khác từ object này
                // Trong trường hợp này, API trả về low: 1, high: 0, có thể bạn muốn hiển thị số lần mua là giá trị low.
                displayCoPurchaseCount = `${product.coPurchaseCount.low} times`;
            } else if (typeof product.coPurchaseCount === 'number') {
                displayCoPurchaseCount = `${product.coPurchaseCount} times`;
            } else {
                // Nếu là một dạng khác không mong đợi
                displayCoPurchaseCount = "N/A times";
            }
        }


        return (
            <Link
                key={product.productId}
                to={`/product/${product.productId}`}
                className="block p-4 transition-all duration-300 bg-white rounded-lg shadow group hover:shadow-lg"
            >
                {/* <img src={product.image || 'https://via.placeholder.com/150'} alt={product.title} className="object-cover w-full h-32 mb-3 rounded-md group-hover:opacity-80"/> */}
                <h3 className="mb-1 text-sm font-semibold text-gray-800 truncate group-hover:text-orange-600">
                    {product.title}
                </h3>
                <p className="text-base font-bold text-orange-500">
                    {displayPrice}
                </p>
                {/* SỬA Ở ĐÂY: Hiển thị displayCoPurchaseCount thay vì product.coPurchaseCount trực tiếp */}
                {product.coPurchaseCount && (
                    <p className="mt-1 text-xs text-gray-500">
                        Bought together: {displayCoPurchaseCount}
                    </p>
                )}
            </Link>
        );
    };

    if (loading) return <div className="py-6 text-center"><LoadingSpinner text="Loading frequently bought products..." /></div>;
    if (!frequentProducts || frequentProducts.length === 0) return null;
    // Bạn có thể muốn hiển thị lỗi một cách tinh tế hơn hoặc log nó thay vì làm vỡ UI
    if (error) {
        console.error("FrequentlyBoughtTogether Error:", error);
        return <div className="py-6 text-xs text-center text-red-300">Could not load frequently bought items.</div>;
    }


    return (
        <div className="mt-12">
            <h2 className="mb-6 text-2xl font-semibold text-gray-800">Frequently Bought Together</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {frequentProducts.map((product) => (
                    <ProductCard key={product.productId} product={product} />
                ))}
            </div>
        </div>
    );
};

export default FrequentlyBoughtTogether;