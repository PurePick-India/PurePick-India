import Order from "../models/Order.js";
import Product from "../models/Product.js";

// place Order COD: /api/prder/cod
export const placeOrderCOD = async (req, res)=>{
    try{
        const userId = req.userId;
        const { items, address } = req.body;
        if(!address || items.length === 0){
            return res.json({sucess: false, message: "Invalid data"})
        }
        //Calculate Amount Using Items
        let amount = await items.reduce(async (acc, item)=>{
          const product = await Product.findById(item.product);
          return (await acc) + product.offerPrice * item.quantity; 
        },0)

        //Add Tax Charge(2%)
        amount += Math.floor(amount*0.02);

        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "COD",
        });
        return res.json({sucess: true, message: "Order Placed Sucessfully"})
    } catch (error){
return res.json({sucess: false, message: error.message })
    }
}

// Get Orders by User ID : /api/orders/user

export const getUserOrders = async (req, res)=>{
    try{
    //    const {userId} = req.query;
       const userId = req.userId;
       const orders = await Order.find({
        userId,
        $or: [{paymentType: "COD"}, {isPaid: true}]
       }).populate("items.product address").sort({createdAt: -1});
       res.json({sucess: true, orders});
    } catch(error){
        res.json({sucess: false, message: error.message});
    }
}
export const getAllOrders = async (req, res)=>{
    try{
       const orders = await Order.find({
        $or: [{paymentType: "COD"}, {isPaid: true}]
       }).populate("items.product address");
       res.json({sucess: true, orders});
    } catch(error){
        res.json({sucess: false, message: error.message});
    }
}