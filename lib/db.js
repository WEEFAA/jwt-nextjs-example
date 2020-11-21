import mongoose from "mongoose"
import { userSchema } from "../models/users"

// use prod url or dev mongo
const db_url = process.env.DB || "mongodb://localhost:27017/jwt_next"

export const createConnection = async (url = db_url) => {
    const options = { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true }
    // make a connection & return
    const connection = await mongoose.createConnection(url, options)
    
    // register models
    connection.model('User', userSchema)
    
    return connection
}