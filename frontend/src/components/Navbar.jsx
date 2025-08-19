import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
// import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import LocationSelector from './LocationSelector';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [open, setOpen] = useState(false)

  /* For Clerk Authentication */
  // const { user, navigate, setSearchQuery, searchQuery, getCartCount } = useAppContext();

  /*For Native Authentication */
  const { user, setUser, setShowUserLogin, navigate, searchQuery, setSearchQuery, getCartCount, axios } = useAppContext();

  // Session Storage for selected location. This will save the selected location even after page refresh.
  const [selectedLocation, setSelectedLocation] = useState(() => {
    return sessionStorage.getItem("selectedLocation") || "Select Location";
  });

  // Search TextBox Animation
  const suggestions = ["apple", "eggs", "milk", "bread", "paneer"];
  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0);
  const [animate, setAnimate] = useState(false);

  // Comment it out (logout fucntion), if you are using Clerk Authentication
  const logout = async () => {
    try {
      const { data } = await axios.get('/api/user/logout')
      if (data.success) {
        toast.success(data.message)
        setUser(null);
        navigate('/');
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  }

  // Handle search query change
  useEffect(() => {
    if (searchQuery.length > 0) {
      navigate('/products')
    }
  }, [searchQuery, navigate]);

  // Search TextBox Animation
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimate(true);
      setTimeout(() => {
        setCurrentSuggestionIndex((prev) => (prev + 1) % suggestions.length);
        setAnimate(false);
      }, 300);
    }, 2000);

    return () => clearInterval(interval);
  }, [suggestions.length]);

  // sessionStorage for selected location, saves the selected location even after page refresh
  useEffect(() => {
    sessionStorage.setItem("selectedLocation", selectedLocation);
  }, [selectedLocation]);

  
  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">
      {/* Left section: Logo + Location Dropdown */}
      <div className="flex items-center space-x-7">
        {/* Logo hidden on mobile and tablet */}
        <NavLink to="/" onClick={() => setOpen(false)} className="hidden lg:block">
          <img className="h-11" src={assets.logo} alt="logo" />
        </NavLink>

        {/* Responsive LocationSelector */}
        <LocationSelector selectedLocation={selectedLocation} setSelectedLocation={setSelectedLocation} assets={assets} />
      </div>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-8">
        <NavLink to='/' className='transition-transform ease-in-out duration-300 transform hover:scale-105 hover:text-[#36a22c] hover:font-semibold'>Home</NavLink>
        <NavLink to='/products' className='transition-transform ease-in-out duration-300 transform hover:scale-105 hover:text-[#36a22c] hover:font-semibold'>All Product</NavLink>
        <NavLink to='/contact' className='transition-transform ease-in-out duration-300 transform hover:scale-105 hover:text-[#36a22c] hover:font-semibold'>Contact</NavLink>

        {/* //The My Order only appear when the user is signIn (For Clerk Authentication) */}
        {/* <SignedIn>
          <NavLink to='/my-orders' className='transition-transform ease-in-out duration-300 transform hover:scale-105 hover:text-[#36a22c] hover:font-semibold'>My Orders</NavLink>
        </SignedIn> */}

        {/* Animated Search Box */}
        <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full relative w-64">
          <input
            onChange={(e) => setSearchQuery(e.target.value)}
            value={typeof searchQuery === 'string' ? searchQuery : ""}
            type="text"
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500 z-10"
            placeholder=""
          />

          {!searchQuery && (
            <span
              className={`absolute left-4 top-1.5 text-gray-400 transition-all duration-300 ease-in-out pointer-events-none z-0 
                ${animate ? "translate-y-[-8px] opacity-0" : "translate-y-0 opacity-100"}`}
            >
              Search <span className="font-medium text-primary">{suggestions[currentSuggestionIndex]}</span>
            </span>
          )}

          <img src={assets.search_icon} alt="search" className="w-4 h-4 z-10" />
        </div>

        <div onClick={() => navigate("/cart")} className="relative cursor-pointer">
          <img src={assets.nav_cart_icon} alt='cart' className='w-6 opacity-80' />
          <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">{getCartCount()}</button>
        </div>

        {/*Native Authentication - User Login & Register Button */}
        {!user ? (<button onClick={() => setShowUserLogin(true)} className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full">
          Login
        </button>)
          :
          (
            <div className='relative group'>
              <img src={assets.profile_icon} className='w-10' alt='' />
              <ul className='hidden group-hover:block absolute top-10 right-0 bg-white shadow border border-gray-200 py-2.5 w-30 rounded-md text-sm z-40'>
                <li onClick={() => navigate("/my-orders")} className='p-1.5 pl-3 hover:bg-primary/10 cursor-pointer'>My Orders</li>
                <li onClick={logout} className='p-1.5 pl-3 hover:bg-primary/10 cursor-pointer'>Logout</li>
              </ul>
            </div>
          )}

        {/* Added the user authentication - Using Clerk Authentication */}
        {/* <SignedOut>
          <NavLink to="/sign-in" className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full">
            Sign In
          </NavLink>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn> */}
      </div>

      <div className='flex items-center gap-6 sm:hidden'>
        <div onClick={() => navigate("/cart")} className="relative cursor-pointer">
          <img src={assets.nav_cart_icon} alt='cart' className='w-6 opacity-80' />
          <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">{getCartCount()}</button>
        </div>

        <button onClick={() => open ? setOpen(false) : setOpen(true)} aria-label="Menu" className="">
          {/* Hamburger Menu Icon */}
          <img src={assets.menu_icon} alt='menu' />
        </button>
      </div>


      {/* Mobile Menu */}
      {open && (
        <div className={`${open ? 'flex' : 'hidden'} absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden z-50`}>
          <NavLink to='/' onClick={() => setOpen(false)} className='transition-transform ease-in-out duration-100 transform hover:scale-105 hover:text-[#36a22c] hover:font-semibold'>Home</NavLink>
          <NavLink to='/products' onClick={() => setOpen(false)} className='transition-transform ease-in-out duration-100 transform hover:scale-105 hover:text-[#36a22c] hover:font-semibold'>All Product</NavLink>
          {user && (
            <NavLink to='/my-orders' onClick={() => setOpen(false)} className='transition-transform ease-in-out duration-100 transform hover:scale-105 hover:text-[#36a22c] hover:font-semibold'>My Orders</NavLink>
          )}
          <NavLink to='/contact' onClick={() => setOpen(false)} className='transition-transform ease-in-out duration-100 transform hover:scale-105 hover:text-[#36a22c] hover:font-semibold'>Contact</NavLink>


          {!user ? (
            <button onClick={() => {
              setOpen(false);
              setShowUserLogin(true);
            }} className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm">
              Login
            </button>
          ) : (
            <button onClick={logout} className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm">
              Logout
            </button>
          )}


          {/* Added the user authentication - Using Clerk Authentication (Mobile View) */}

          {/* <SignedIn>
            <NavLink to='/my-orders' className='transition-transform ease-in-out duration-300 transform hover:scale-105 hover:text-[#36a22c] hover:font-semibold'>My Orders</NavLink>
          </SignedIn>
          <SignedOut>
            <NavLink to="/sign-in" className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full">
              Sign In
            </NavLink>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn> */}
        </div>
      )}
    </nav>
  )
}

export default Navbar
