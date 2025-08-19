import jwt from 'jsonwebtoken';
const authSeller = async (req, res, next) => {
    const { SellerToken } = req.cookies;

    if (!SellerToken) {
        return res.status(401).json({ success: false, message: "Not Authorized! user" });
    }

    try {
        const tokenDecode = jwt.verify(SellerToken, process.env.JWT_SECRET);
        if (tokenDecode.id && tokenDecode.role === 'seller') {
            next();
        } else {
            return res.json({ success: false, message: "Seller Not Authorized!" });
        }
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
export default authSeller;