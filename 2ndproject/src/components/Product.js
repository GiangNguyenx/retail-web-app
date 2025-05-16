import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { MdOutlineStar } from "react-icons/md";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/bazarSlice";
import { ToastContainer, toast } from "react-toastify";

const Product = () => {
    const dispatch = useDispatch();
    const [details, setDetails] = useState({});
    let [baseQty, setBaseQty] = useState(1);
    const [rating, setRating] = useState(0); // State for rating
    const [review, setReview] = useState(""); // State for review input
    const [reviews, setReviews] = useState([]); // State to store submitted reviews

    const location = useLocation();
    useEffect(() => {
        setDetails(location.state.item);
    }, []);

    const handleReviewSubmit = () => {
        if (rating > 0 && review.trim()) {
            setReviews([...reviews, { rating, review }]);
            setRating(0);
            setReview("");
            toast.success("Review submitted successfully!");
        } else {
            toast.error("Please provide a rating and a review.");
        }
    };

    return (
        <div>
            <div className="max-w-screen-xl mx-auto my-10 flex gap-10">
                <div className="w-2/5 relative">
                    <img
                        className="w-full h-[550px] object-cover"
                        src={details.image}
                        alt="productImg"
                    />
                    <div className="absolute top-4 right-0">
                        {details.isNew && (
                            <p className="bg-black text-white font-semibold font-titleFont px-8 py-1">
                                Sale
                            </p>
                        )}
                    </div>
                </div>
                <div className="w-3/5 flex flex-col justify-center gap-12">
                    <div>
                        <h2 className="text-4xl font-semibold">{details.title}</h2>
                        <div className="flex items-center gap-4 mt-3">
                            <p className="line-through font-base text-gray-500">${details.oldPrice}</p>
                            <p className="text-2xl font-medium text-gray-900">${details.price}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-base">
                        <div className="flex">
                            <MdOutlineStar />
                            <MdOutlineStar />
                            <MdOutlineStar />
                            <MdOutlineStar />
                            <MdOutlineStar />
                        </div>
                        <p className="text-xs text-gray-500">(1 Customer review)</p>
                    </div>
                    <p className="text-base text-gray-500 -mt-3">{details.description}</p>
                    <div className="flex gap-4">
                        <div className="w-52 flex items-center justify-between text-gray-500 gap-4 border p-3">
                            <p className="text-sm">Quantity</p>
                            <div className="flex items-center gap-4 text-sm font-semibold">
                                <button onClick={() => setBaseQty(baseQty === 1 ? (baseQty = 1) : baseQty - 1)} className="border h-5 font-normal text-lg flex items-center
                             justify-center px-2 hover:bg-gray-700 hover:text-white cursor-pointer
                             duration-300 active:bg-black">
                                    -
                                </button>
                                <span>{baseQty}</span>
                                <button onClick={() => setBaseQty(baseQty + 1)} className="border h-5 font-normal text-lg flex items-center
                             justify-center px-2 hover:bg-gray-700 hover:text-white cursor-pointer
                             duration-300 active:bg-black">
                                    +
                                </button>
                            </div>
                        </div>
                        <button onClick={() => dispatch(addToCart({
                            _id: details._id,
                            title: details.title,
                            image: details.image,
                            price: details.price,
                            quantity: baseQty,
                            description: details.description,
                        })
                        ) & toast.success(`${details.title} is added`)
                        } className="bg-black text-white py-3 px-6 active:bg-gray-800">
                            add to cart
                        </button>
                    </div>
                    <p className="text-base text-gray-500">
                        Category: <span className="font-medium capitalize">{details.category}</span>
                    </p>
                    <div className="mt-10">
                        <h3 className="text-2xl font-semibold">Write a Review</h3>
                        <div className="flex items-center gap-2 mt-4">
                            <p className="text-base">Your Rating:</p>
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <MdOutlineStar
                                        key={star}
                                        className={`cursor-pointer ${
                                            star <= rating ? "text-yellow-500" : "text-gray-400"
                                        }`}
                                        onClick={() => setRating(star)}
                                    />
                                ))}
                            </div>
                        </div>
                        <textarea
                            className="w-full mt-4 p-3 border rounded-md"
                            rows="4"
                            placeholder="Write your review here..."
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                        ></textarea>
                        <button
                            onClick={handleReviewSubmit}
                            className="bg-black text-white py-2 px-6 mt-4 active:bg-gray-800"
                        >
                            Submit Review
                        </button>
                    </div>
                    <div className="mt-10">
                        <h3 className="text-2xl font-semibold">Customer Reviews</h3>
                        {reviews.length > 0 ? (
                            <div className="mt-4">
                                {reviews.map((rev, index) => (
                                    <div key={index} className="border-b py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="flex">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <MdOutlineStar
                                                        key={star}
                                                        className={`${
                                                            star <= rev.rating
                                                                ? "text-yellow-500"
                                                                : "text-gray-400"
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="mt-2 text-gray-600">{rev.review}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="mt-4 text-gray-500">No reviews yet. Be the first to review this product!</p>
                        )}
                    </div>
                </div>
            </div>
            <ToastContainer
                position="top-left"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
        </div>
    );
};

export default Product;
