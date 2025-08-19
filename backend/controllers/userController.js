import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Register New User: /api/user/register
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate the input fields
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Missing fields!" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists!" });
        }

        // Encrypted the password before saving it to the database
        const hashedPassword = await bcrypt.hash(password, 10); //Applying 10 rounds of hashing

        // Create a new user document in the database
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' }); // Generate JWT token (_id is the Payload)

        res.cookie("token", token, {
            httpOnly: true, //Prevent Js to access the cookie
            secure: process.env.NODE_ENV === "production", //Use secure cookies in production
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // CSRF protection
            maxAge: 7 * 24 * 60 * 60 * 1000 // Cookie expiration time
        });

        return res.status(201).json({ 
            success: true, 
            message: "Registered successfully",
            user: { email: user.email, name: user.name }

         });

    } catch (error) {
        console.error("User Registration Error: ", error.message);
        res.json({ success: false, message: error.message });
    }
}

// Login Existing User: /api/user/login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate the input fields
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Missing fields!" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: "Account not found! Please Register" });
        }

        // Compare the provided password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid credentials!" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie("token", token, {
            httpOnly: true, // Prevent JS from accessing the cookie
            secure: process.env.NODE_ENV === "production", // Use secure cookies in production
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // CSRF protection
            maxAge: 7 * 24 * 60 * 60 * 1000 // Cookie expiration time
        });

        return res.status(200).json({ 
            success: true, 
            message: "Logged in successfully",
            user: { email: user.email, name: user.name }
         });

    } catch (error) {
        console.error("User Login Error: ", error.message);
        res.json({ success: false, message: error.message });
    }
}

// Check User Authentication: /api/user/is-auth
export const isAuth = async (req, res) => {
    try{
        // const { userId } = req.body;
        const userId = req.userId;

        const user = await User.findById(userId).select("-password"); // Exclude password from the response

        return res.json({ success: true, user });

    }catch (error){
        console.error("User Authentication Check Error: ", error.message);
        res.status(500).json({ success: false, message: "Server Error!" });
    }
}

// Logout User: /api/user/logout
export const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true, // Prevent JS from accessing the cookie
            secure: process.env.NODE_ENV === "production", // Use secure cookies in production
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // CSRF protection
        });

        return res.status(200).json({ success: true, message: "Logged out successfully" });

    } catch (error) {
        console.error("User Logout Error: ", error.message);
        res.status(500).json({ success: false, message: "Server Error!" });
    }
}
