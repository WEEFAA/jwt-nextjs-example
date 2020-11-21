import jwt from "jsonwebtoken"
// secret key
const cookieName = "jwt-weefa"
const key = process.env.SECRET_JWT || "jwt-weefa"
const flags = 'HttpOnly=true;Path=/'
// sign jwt token
export const runJWTMiddleware = async function(req,res,info){
    // create expiration 
    const payload = {
        sub: info.username,
        user_id: info._id,
        expiresIn: "1d"
    }
    // sign 
    const token = await jwt.sign(payload, key)
    // set the cookie
    res.setHeader('Set-Cookie', `${cookieName}=${token};${flags}`)
    // redirect to resource
    res.writeHead(303, {
        "Location": "/"
    })
    return res.end()
    
}

export const verifyJWT = async function(req,res){
    try{
        const jwt_token = req.cookies[cookieName]
        return jwt.verify(jwt_token, key, (err, payload) => {
            if(err) throw err 
            // return payload
            return res.json({
                ...payload,
                user: payload.sub,
            })
        })
    }catch(e){
        return res.status(403).json({})
    }
}

export const destroyJWT = function (res) {
	res.setHeader(
		'Set-Cookie',
		`${cookieName}=0;${flags};MaxAge=0;Expires=${new Date()}`
	)
	return null
}