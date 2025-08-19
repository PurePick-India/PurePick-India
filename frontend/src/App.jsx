import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import { useAppContext } from './context/AppContext';
import Home from './pages/Home'
import { Toaster } from 'react-hot-toast';
import Footer from './components/Footer';
import Login from './components/Login';
import SignInPage from "./pages/SignIn";
import SignUpPage from "./pages/SignUp";
import SellerLayout from './pages/seller/SellerLayout'
import SellerLogin from './components/seller/SellerLogin'
import ProductList from './pages/seller/ProductList'
import Orders from './pages/seller/Orders'
import AddProduct from './pages/seller/AddProduct'
import AllProducts from './pages/AllProducts';
import ProductCategory from './pages/ProductCategory';
import ProductDetails from './pages/ProductDetails';
import ContactUs from './pages/ContactUs.jsx';
import Cart from './pages/Cart.jsx';
import AddAddress from './pages/AddAddress.jsx';
import PageNotFound from './pages/PageNotFound.jsx';
import MyOrders from './pages/MyOrders.jsx';


const App = () => {
  const isSellerPath = useLocation().pathname.includes("seller");
  const { showUserLogin, isSeller } = useAppContext();


  return (
    <div className='text-default min-h-screen text-gray-700 bg-white'>
      {/* This div ensures Navbar shows on all pages */}
      {isSellerPath ? null : <Navbar />}
      {showUserLogin ? <Login /> : null}
      <Toaster />

      {/* This div conatins all the dynamic contents on the body. */}
      <div className={`${isSellerPath ? "" : "px-6 md:px-16 lg-px-24 xl:px-32"}`}>
        <Routes>
          {/* Customer Portal Components */}
          <Route path='/' element={<Home />} />
          <Route path='/products' element={<AllProducts />} />
          <Route path='/products/:category' element={<ProductCategory />} />
          <Route path='/products/:category/:id' element={<ProductDetails />} />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/Cart" element={<Cart/>} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/AddAddress" element={<AddAddress />} />


          {/* Vendor Portal Components */}
          <Route path="/seller" element={isSeller ? <SellerLayout /> : <SellerLogin />}>
            <Route index element={isSeller ? <AddProduct /> : null} />
            <Route path="product-list" element={<ProductList />} />
            <Route path="orders" element={<Orders />} />
          </Route>

          {/* 404 Page */}
          <Route path="/*" element={<PageNotFound />} />
        </Routes>
      </div>

      {/* This ensures the Footer shows on all pages */}
      {!isSellerPath && <Footer />}
    </div>
  );
};

export default App;
