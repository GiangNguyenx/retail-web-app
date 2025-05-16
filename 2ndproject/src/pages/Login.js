import React, { useState, useEffect } from "react";
import {Googlelogo, githublogo} from "../assets";
import {
    GoogleAuthProvider,
    getAuth,
    signInWithPopup,
    signOut,
} from "firebase/auth";
import {ToastContainer, toast} from "react-toastify";
import {useDispatch} from "react-redux";
import {addUser, removeUser} from "../redux/bazarSlice";
import {useNavigate} from "react-router-dom";

export const Login = () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status

    useEffect(() => {
        // Check if a user is already logged in (e.g., from Redux or Firebase auth state)
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
            }
        });
        return () => unsubscribe();
    }, [auth]);

    const handleGoogleLogin = (e) => {
        e.preventDefault();
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                console.log(user);
                dispatch(
                    addUser({
                        _id: user.uid,
                        name: user.displayName,
                        email: user.email,
                        image: user.photoURL,
                    })
                );
                setIsLoggedIn(true); // Update login status
                setTimeout(() => {
                    navigate(-1);
                }, 1500);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleSignOut = () => {
        signOut(auth)
            .then(() => {
                toast.success("Log Out Successfully!");
                dispatch(removeUser());
                setIsLoggedIn(false); // Update login status
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            if (response.ok) {
                toast.success("Login Successful!");
                dispatch(
                    addUser({
                        _id: data._id,
                        name: data.name,
                        email: data.email,
                        image: data.image,
                    })
                );
                setIsLoggedIn(true); // Update login status
                setTimeout(() => {
                    navigate(-1);
                }, 1500);
            } else {
                toast.error(data.message || "Login Failed!");
            }
        } catch (error) {
            console.error("Error during login:", error);
            toast.error("An error occurred. Please try again.");
        }
    };

    return (
        <div className="w-full flex flex-col items-center justify-center gap-10 py-20">
            {!isLoggedIn && (
                <>
                    {/* Username/Password Login Form */}
                    <form
                        onSubmit={handleLogin}
                        className="w-full max-w-sm flex flex-col items-center gap-4"
                    >
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full border-[1px] border-gray-400 rounded-md p-2"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border-[1px] border-gray-400 rounded-md p-2"
                            required
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 text-white text-base py-3 px-8 tracking-wide rounded-md hover:bg-blue-700 duration-300"
                        >
                            Login
                        </button>
                    </form>

                    {/* Google Login Section */}
                    <div
                        onClick={handleGoogleLogin}
                        className="text-base w-60 h-12 tracking-wide border-[1px] border-gray-400
                        rounded-md flex items-center justify-center gap-2 hover:border-blue-600 cursor-pointer duration-300 p-1"
                    >
                        <img className="w-6 h-6" src={Googlelogo} alt="googlelogo" />
                        <span className="text-md text-gray-900 flex items-center justify-center">
                            Sign in with Google
                        </span>
                    </div>
                </>
            )}

            {/* Sign Out Button */}
            {isLoggedIn && (
                <button
                    onClick={handleSignOut}
                    className="bg-black text-white text-base py-3 px-8 tracking-wide rounded-md hover:bg-gray-800 duration-300"
                >
                    Sign Out
                </button>
            )}

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

