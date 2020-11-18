import mongoose from "mongoose"
import { userSchema } from "../models/users"

export const createConnection = async (url = "mongodb://localhost:27017/jwt_next") => {
    const options = { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true }
    // make a connection & return
    const connection = await mongoose.createConnection(url, options)
    
    // register models
    connection.model('User', userSchema)
    
    return connection
}