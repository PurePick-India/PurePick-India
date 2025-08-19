import React, { useEffect } from "react";
import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";
const SellerLogin = () => {
  const { isSeller, setIsSeller, navigate,axios } = useAppContext();
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  useEffect(() => {
    if (isSeller) {
      navigate("/seller");
    }
  }, [isSeller]);

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    let {data} = await axios.post("/api/seller/login",{email,password});
    if (data.success) {
      setIsSeller(true);
      navigate("/seller");
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.error("Login failed:", error);
    toast.error("Login failed. Please try again.");
  }
};

  return !isSeller && 
      <div>
          <form className="flex items-center justify-center min-h-screen" onSubmit={handleSubmit}>
            <div className="flex flex-col border border-gray-200 w-[340px] gap-5 text-gray-600 shadow-xl rounded py-12 p-8 ">
            <p className="text-3xl font-semibold text-center m-auto"><span className="text-primary mr-2">Vender</span><span>Login</span></p>
            <div className="flex flex-col w-full gap-1">
                <label>Email</label>
                <input type="email" placeholder="Enter your email" className="border border-gray-200 rounded outline-primary p-2" value={email} onChange={(e)=>setemail(e.target.value)} required/>
            </div>
            <div className="flex flex-col w-full gap-1">
                <label>Password</label>
                <input type="password" placeholder="Enter your password"  className="border border-gray-200 rounded outline-primary p-2" value={password} onChange={(e)=>setpassword(e.target.value)} required/>
            </div>
            <button className="bg-primary text-white p-2 border rounded-xl">Login</button>
            </div>
          </form>
      </div>;
};

export default SellerLogin;
