import { validCSRF } from '../../../lib/csrf'
import { runJWTMiddleware } from "../../../lib/jwt"
import { auth } from "../../../lib/strapi"

const login = async (req,res) => {
    const { method } = req 
    switch(method){
        case "POST": {
			const {
				body: credentials,
				query: { app_callback = '/' },
			} = req
			// handle login
			if (!validCSRF(req, res)) {
				return res.status(400).end('CSRF Attack')
			}
			// authenticate to backend
			const uri = process.env.BACKEND_URI || ''
			const auth_uri = `${uri}/auth/local`
			const auth_result = await auth(auth_uri, {
				identifier: credentials.username,
				password: credentials.password,
            })
            
			// set jwt if user successfully log in
			if (!auth_result.err) {
				return await runJWTMiddleware(req, res, auth_result.jwt)
            }
            
			// redirect to login with errors
			res.writeHead(302, {
				Location: encodeURI(
					`/login?app_callback=${app_callback}&message=${
						auth_result.err || ''
					}&errors=${auth_result.failing.join(',')}`
				),
			})
			return res.end()
		}
        default: 
            return res.status(503).end()
    }
}

export default login