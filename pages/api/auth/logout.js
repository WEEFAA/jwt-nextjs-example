import { validCSRF } from '../../../lib/csrf'
import { destroyJWT } from './../../../lib/jwt'
const logout = async function (req, res) {
	const { method } = req
	switch (method) {
		case 'POST': {
			if (!validCSRF(req, res)) {
				return res.status(400).end('CSRF Attack')
			}
			// unset session cookie token
			await destroyJWT(res)
			// redirect the user
			res.writeHead(302, { Location: '/login' })
			return res.end()
		}
		default:
			return res.status(503).end()
	}
}

export default logout
