import { createConnection } from "../../../lib/db"

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
            // console.log(result)
            return res.json({
                ok: result.err ? false : true,
                message: result.err,
                user: !!result.user,
                pass: !!result.pass
            })
        }
        default: 
            return res.status(503).end()
    }
}

export default login