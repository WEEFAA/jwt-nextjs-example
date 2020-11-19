import { verifyJWT } from "../../../lib/jwt"

const getUser = async (req,res) => {
    const { method } = req 
    switch(method){
        case "GET": {
            await verifyJWT(req,res)
        }
        default:
            return res.status(503).end()
    }
}

export default getUser