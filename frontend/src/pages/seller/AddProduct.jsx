import React, { useState } from 'react'
import { assets, categories } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const AddProduct = () => {
    const {axios} = useAppContext();
   const [files,setfiles]=useState([]);
   const [name,setName]=useState('');
   const [description,setdescription]=useState('');
   const [category,setcategory]=useState('');
   const [price,setprice]=useState('');
   const [offerPrice,setofferPrice]=useState('')

   const onsubmitHandler=async (event) => {
     try {
        event.preventDefault();
        const productData = {
            name,
            description,
            category,
            price,
            offerPrice
        };
        const formData = new FormData();
        formData.append('productData', JSON.stringify(productData));
       for(let i=0;i<files.length;i++) {
            formData.append(`images`, files[i]);
        }
        const {data}=await axios.post('/api/product/add', formData);
        if(data.success) {
            toast.success("Product added successfully");
            setfiles([]);
            setName('');
            setdescription('');
            setcategory('');
            setprice('');
            setofferPrice('');
        } else {
            toast.error(data.message || "Failed to add product");
        }
     } catch (error) {
        toast.error(error.message)
     }
   }
    return (
        <div className="relative no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between">
            <form className="md:p-10 p-4 space-y-5 max-w-lg" onSubmit={onsubmitHandler}>
                <div>
                    <p className="text-base font-medium">Product Image</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                        {Array(4).fill('').map((_, index) => (
                            <label key={index} htmlFor={`image${index}`}>
                                <input accept="image/*" onChange={(e)=>{
                                  const updatedfile=[...files]
                                  updatedfile[index]=e.target.files[0];
                                  setfiles(updatedfile);
                                }} type="file" id={`image${index}`} hidden />
                                <img className="max-w-24 cursor-pointer" src={files[index] ? URL.createObjectURL(files[index]) : assets.upload_area} alt="uploadArea" width={100} height={100} />
                            </label>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-1 max-w-md">
                    <label className="text-base font-medium" htmlFor="product-name">Product Name</label>
                    <input id="product-name" type="text" placeholder="Type here" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" value={name} onChange={(e)=>setName(e.target.value)} required />
                </div>
                <div className="flex flex-col gap-1 max-w-md">
                    <label className="text-base font-medium" htmlFor="product-description">Product Description</label>
                    <textarea id="product-description" rows={4} className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none" value={description} onChange={(e)=>setdescription(e.target.value)} placeholder="Type here"></textarea>
                </div>
                <div className="w-full flex flex-col gap-1">
                    <label className="text-base font-medium" htmlFor="category">Category</label>
                    <select id="category" className="relative z-50 outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" value={category} onChange={(e)=>setcategory(e.target.value)}>
                        <option value="">Select Category</option>
                        {categories.map((item,index)=>(
                          <option value={item.path} key={index}>{item.path}</option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center gap-5 flex-wrap">
                    <div className="flex-1 flex flex-col gap-1 w-32">
                        <label className="text-base font-medium" htmlFor="product-price">Product Price</label>
                        <input id="product-price" type="number" placeholder="0" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" value={price} onChange={(e)=>setprice(e.target.value)} required />
                    </div>
                    <div className="flex-1 flex flex-col gap-1 w-32">
                        <label className="text-base font-medium" htmlFor="offer-price">Offer Price</label>
                        <input id="offer-price" type="number" placeholder="0" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" value={offerPrice} onChange={(e)=>setofferPrice(e.target.value)} required />
                    </div>
                </div>
                <button className="px-8 py-2.5 bg-primary text-white font-medium rounded cursor-pointer hover:bg-primary-dull transition">List Product</button>
            </form>
        </div>
    );
};

export default AddProduct
