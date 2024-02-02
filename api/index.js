import express from 'express';
import dbConnect from './config/dbConnect.js';
import userRouter from './routes/userRoutes.js';
import authRouter from './routes/authRoutes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import listingRouter from './routes/listingRoutes.js';

const app = express();
app.use(cors(
    {
        origin: 'https://myproperty.vercel.app',
        methods: ["POST", "GET", "PUT", "DELETE"],
        credentials: true,
    }
));


app.use(express.json());
app.use(cookieParser());

app.use('/',(req,res)=>{
    res.status(200).json({message:welcome})
})

//routes
app.use('/api/user',userRouter);
app.use('/api/auth',authRouter);
app.use('/api/listing',listingRouter); 


//middleware
app.use((err,req,res,next)=>{
    const statusCode = err?.statusCode || 500;
    const message = err?.message ? err?.message : "internal server error"
    return res.status(statusCode).json({
        success : false,
        statusCode,
        message
    })
})







//create server
const PORT = process.env.PORT || 3000;

app.listen(PORT,()=> {
    dbConnect();
    console.log(`server is running on port  ${PORT}`);
});
