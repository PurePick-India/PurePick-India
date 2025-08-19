import jwt from 'jsonwebtoken';
    

// Register New Seller: /api/seller/register
export const sellerLogin = async (req, res) => {
    try{
        const {email , password} = req.body;
        if(password === process.env.SELLER_PASSWORD && email === process.env.SELLER_EMAIL){
            const token = jwt.sign(
                { id: process.env.SELLER_EMAIL, role: 'seller' },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );
            res.cookie("SellerToken", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            return res.json({ success: true, message: "Seller logged in successfully!" });
        }else{
            return res.json({ success: false, message: "Invalid Credentials" });
        }
    }catch(error){
        console.error("Seller Login Error: ", error.message);
        res.json({ success: false, message: error.message });
    }
}

// Seller isAuth : /api/seller/auth
export const isSellerAuth = async (req, res) => {
    try{
        return res.json({ success: true});
    }catch(error){
        console.error(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Seller Logout: /api/seller/logout
export const sellerLogout = async (req, res) => {
    try {
        res.clearCookie("SellerToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        });

        return res.json({ success: true, message: "Seller logged out successfully" });
    } catch (error) {
        console.error("Seller Logout Error: ", error.message);
        res.json({ success: false, message: "Server Error!" });
    }
}