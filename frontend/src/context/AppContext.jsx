/* Central hub for managing global state and shared functions across all the components in our React application using React Context API.
Purpose: avoid prop drilling, keep a single source of truth, and share data/functions easily across components */

import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import axios from "axios";

axios.defaults.withCredentials = true; // Allow cookies to be sent with requests
axios.defaults.baseURL = "https://purepick-backend-47u4.onrender.com" || import.meta.env.VITE_BACKEND_URL?.trim(); // Set the base URL for axios requests

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    /* Initializes navigate to change routes programmatically using useNavigate from react-router-dom. */
    const navigate = useNavigate();

    /* The line is importing the environment variable `VITE_CURRENCY` */
    const currency = import.meta.env.VITE_CURRENCY;

    /* Creates a user state (initially null) and setUser to update it in React. */
    const [user, setUser] = useState(null);
    const [isSeller, setIsSeller] = useState(false);
    const [showUserLogin, setShowUserLogin] = useState(false)
    const [products, setProducts] = useState([])
    const [cartItems, setCartItems] = useState({})
    const [searchQuery, setSearchQuery] = useState("");


    // ----------------------------------------------- FUNCTIONS -----------------------------------------------

    // Fetch Seller Status
    const fetchseller = async () => {
        try {
            const { data } = await axios.get("/api/seller/is-auth");
            if (data.success) {
                setIsSeller(true);
                navigate("/seller");
            } else {
                setIsSeller(false);
            }
        } catch (error) {
            setIsSeller(false);
        }
    }

    // Fetch User Auth Status, User Data, and Cart Items
    const fetchUser = async () => {
        try {
            const { data } = await axios.get('/api/user/is-auth')
            if (data.success) {
                setUser(data.user)
                setCartItems(data.user.cartItems)
                return data.user;
            }
        } catch (error) {
            if (error.response?.status !== 401) {
                console.error("fetchUser error:", error);
            }
            setUser(null);
            return null;
        }
    }



    //Fetch products from dummy data
    const fetchProducts = async () => {
        try {
            const { data } = await axios.get('/api/product/list')
            if (data.success) {
                setProducts(data.products)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }

    }

    useEffect(() => {
        fetchUser();
        fetchseller();
        fetchProducts()
    }, [])

    //Add Products to Cart
    const addToCart = (itemId) => {
        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            cartData[itemId] += 1;
        } else {
            cartData[itemId] = 1;
        }

        setCartItems(cartData);

        toast.success("Added to Cart")
    }

    //Update cart items quantity
    const updateCartItem = (itemId, quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId] = quantity;
        setCartItems(cartData);
        toast.success("Cart Updated");
    }

    //Remove item from cart
    const removeFromCart = (itemId) => {
        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            cartData[itemId] -= 1;
            if (cartData[itemId] === 0) {
                delete cartData[itemId];
            }
        }
        toast.success("Removed from Cart");
        setCartItems(cartData);
    }

    // Get cart Item Count
    const getCartCount = () => {
        let totalCount = 0;
        for (const item in cartItems) {
            totalCount += cartItems[item];
        }
        return totalCount;
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            if (cartItems[items] > 0) {
                totalAmount += itemInfo.offerPrice * cartItems[items];
            }
        }
        return Math.floor(totalAmount * 100) / 100;
    }
   
    //update database cart items
    useEffect(() => {
        const updateCart = async () => {
            try {
                const { data } = await axios.post('/api/cart/update', { cartItems })
                if (!data.success) {
                    toast.error(data.message)
                }
            } catch (error) {
                toast.error(error.message)
            }
        }
        if (user) {
            updateCart()
        }
    }, [cartItems])

    //---------------------------------------------------------------------------------------------------------------------------------
    /* const value holds state and functions shared via React Context API. */
    const value = {
        navigate, user, setUser, isSeller, setIsSeller, showUserLogin, setShowUserLogin, products, currency, cartItems, addToCart, updateCartItem, removeFromCart, searchQuery, setSearchQuery, getCartAmount, getCartCount, axios, fetchProducts, setCartItems
    }

    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}

/* useAppContext() lets any component access data from the value object in Context. */
export const useAppContext = () => {
    return useContext(AppContext)
}
