import { verifyUser } from '../../../lib/jwt'
import { cookieName } from '../../../lib/jwt'
import jwt from 'jsonwebtoken'

const getUser = async (req,res) => {
    const { method } = req 
    switch(method){
        case "GET": {
            const verified = await verifyUser(req)
			if (!verified) return res.status(403).json({})

			// decode the token
			const token = req.cookies[cookieName]
			const payload = jwt.decode(token)

			return res.json({
				...payload,
				user: payload.sub,
			})
        }
        default:
            return res.status(503).end()
    }
}

export default getUser