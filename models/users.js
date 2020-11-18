import mongoose from "mongoose"
const { Schema } = mongoose

export const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

userSchema.static('login', async function({ username, password }){
    try{
        const user = await this.findOne({ username })
        if(!user){
            return { err: "Invalid username or password", user: true }
        }
        // if user is found,
        // check if the password is not correct
        const valid = await user.hasCorrectPassword(password)
        if(!valid){
            return { err: "Incorrect password", pass: true }
        }
        // otherwise, 
        return { 
            err: null
        }
    }catch(e){
        console.error(e)
        return {
            err: e.message
        }
    }
})

userSchema.methods.hasCorrectPassword = async function(password){
    // Todo: HASH
    return this.password === password
}

