import jwt from "jsonwebtoken"
import { NextApiResponse } from "next"
// sign jwt token
export const runJWTMiddleware = async function(req,res,info){
    const key = process.env.SECRET_JWT || "jwt-weefa"
    // create expiration 
    const payload = {
        sub: info.username,
        user_id: info._id,
        expiresIn: "1d"
    }
    // sign 
    const token = await jwt.sign(payload, key)
    // set the cookie
    res.setHeader("Set-Cookie", `jwt-weefa=${token};HttpOnly=true;Path=/`)
    // redirect to resource
    res.writeHead(303, {
        "Location": "/data"
    })
    return res.end()
    
}