import { createConnection } from "../../../lib/db"
import { runJWTMiddleware } from "../../../lib/jwt"

const login = async (req,res) => {
    const { method } = req 
    switch(method){
        case "POST": {
            // established connection
            const conn = await createConnection()
            const User = conn.models['User']
            const { body: credentials } = req 
            // handle login 
            const result = await User.login(credentials)
            conn.close()
            // create jwt if user is valid
            if(!result.err){
                return await runJWTMiddleware(req,res,credentials)
            }
            // redirect to login with errors
            res.writeHead(302, {
                "Location": `/login?message=${result.err || ""}&errors=${result.failing.join(',')}`
            })
            return res.end()
        }
        default: 
            return res.status(503).end()
    }
}

export default login