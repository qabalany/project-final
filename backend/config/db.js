import mongoose from "mongoose";

// Establish connection to the MongoDB database
const connectToDatabase = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Database connected: ${connection.connection.host}`);
    } catch (error) {
        console.error(`Database connection failed: ${error.message}`);
        // Exit the process if the database connection fails, as the application cannot function without it.
        process.exit(1);
    }
};

export default connectToDatabase;
