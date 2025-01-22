import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const db = async (url: string): Promise<void> => {
    try {
        await mongoose.connect(url
            // , 
            // {
            //     useNewUrlParser: true,
            //     useUnifiedTopology: true,
            // }
        )
        .then(() => console.log("MongoDB connected"))
        .catch(err => console.error("MongoDB connection error:", err));
    }
    catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

export default db;