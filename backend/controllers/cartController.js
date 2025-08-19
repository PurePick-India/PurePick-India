// update User cartdata : /api/cart/update
import User from "../models/User.js";

export const updateCart = async (req, res) => {
    try {
        const { cartItems } = req.body;

        // Use userId from the authUser middleware
        await User.findByIdAndUpdate(req.userId, { cartItems });

        res.json({ success: true, message: "Cart Updated" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};