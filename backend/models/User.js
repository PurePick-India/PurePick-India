import mongoose from "mongoose";

// User schema to define the structure of user documents in MongoDB
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartItems: { type: Object, default: {} },
}, {minimize: false})

// User model to interact with the users collection in MongoDB
const User = mongoose.models.user || mongoose.model("user", userSchema);

export default User
