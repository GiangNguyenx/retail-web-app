import React, {useState} from "react";
import Home from "./pages/Home";
import Header from "./components/Header";
import Cart from "./pages/Cart";
import Shop from "./pages/Shop";
import {Login} from "./pages/Login";

import {productsData} from "./api/Api";
import Product from "./components/Product";
import Footer from "./components/Footer";
import {
    createBrowserRouter,
    Outlet,
    RouterProvider,
    ScrollRestoration,
} from "react-router-dom";
import {Contact} from "./pages/Contact";
import {WarehouseManagement} from "./pages/WarehouseManagement"; // Import the new page

const Layout = () => {
    return (
        <div>
            <Header/>
            <ScrollRestoration/>
            <Outlet/>
            <Footer/>
        </div>
    );
};

const App = () => {
    const [role, setRole] = useState("user"); // State to manage user role

    const router = createBrowserRouter([
        {
            path: "/",
            element: <Layout/>,
            children: [
                {
                    path: "/",
                    element: <Home/>,
                    loader: productsData,
                },
                {
                    path: "/product/:id",
                    element: <Product/>,
                },
                {
                    path: "/cart",
                    element: <Cart/>,
                },
                {
                    path: "/shop",
                    element: <Shop/>,
                    loader: productsData,
                },
                {
                    path: "/login",
                    element: <Login/>,
                },
                {
                    path: "/management",
                    element: <WarehouseManagement/>,
                },
                {
                    path: role === "admin" ? "/warehouse" : "/contact", // Conditional path
                    element: role === "admin" ? <WarehouseManagement/> : <Contact/>, // Conditional element
                },
            ],
        },
    ]);

    return (
        <div className="font-bodyFont">
            <RouterProvider router={router}/>
        </div>
    );
};

export default App;
