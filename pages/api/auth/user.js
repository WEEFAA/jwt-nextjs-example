import { verifyUser } from '../../../lib/jwt'
import { cookieName } from '../../../lib/jwt'
import { getUserInfo } from "../../../lib/user"
import jwt from 'jsonwebtoken'

const getUser = async (req,res) => {
    const { method } = req 
    switch(method){
        case "GET": {
            const verified = await verifyUser(req)
			if (!verified) return res.status(401).json({})

			// decode the token
			const token = req.cookies[cookieName]
            const payload = jwt.decode(token) 
            const backend_uri = process.env.BACKEND_URI || ""
            // fetch user info
            const user_info = await getUserInfo(backend_uri, token)
            
            // reject request when there's no user info
            if(!user_info){
                res.status(401).end()
            }
            // return user info
            return res.json({
                ...payload,
                user: user_info.username,
            })
            
        }
        default:
            return res.status(503).end()
    }
}

export default getUser