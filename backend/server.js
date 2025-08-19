import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';
import dotenv from 'dotenv';
dotenv.config();
import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import connectCloudinary from './configs/cloudinary.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';

const app = express();
const port = process.env.PORT || 4000;
await connectDB();

await connectCloudinary();
/* Defines allowed origins for CORS, permitting only http://localhost:5173 (Frontend)*/
// const allowedOrigins = ['http://localhost:5173'];
const allowedOrigins = ['https://purepick-frontend.onrender.com'];


//Middleware Configuration
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: allowedOrigins, credentials: true}));


app.get('/', (req, res) => {res.send("API is Working...")})

// Routes Configuration
app.use('/api/user', userRouter); // User routes
app.use('/api/seller', sellerRouter); // Seller routes
app.use('/api/product',productRouter);
app.use('/api/cart',cartRouter);
app.use('/api/address',addressRouter);
app.use('/api/order',orderRouter); // Order routes


//Starting the app
app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`);
});