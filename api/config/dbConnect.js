import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();


const dbConnect = async()=> {
    try {
        const connected = await mongoose.connect(process.env.MONGO_URI);
        console.log(`mongodb connected ${connected.connection.host}`);
    } catch (error) {
        console.log(`Error : ${error.message}`);
    }

}

export default dbConnect;