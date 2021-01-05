import { verifyUser } from '../../../lib/jwt'
import { cookieName } from '../../../lib/jwt'
import jwt from 'jsonwebtoken'
import axios from 'axios'

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
            const user_info_uri = `${backend_uri}/users/me`
            const headers = {
                Authorization: `Bearer ${token}`,
            }
            // try to fetch user info
            try {
				const response = await axios.get(user_info_uri,{ headers })
                const { data } = response 
                return res.json({
                    ...payload,
                    user: data.username,
                })
			} catch (e) {
                // failed to get user information
				res.status(401).end()
			}
        }
        default:
            return res.status(503).end()
    }
}

export default getUser