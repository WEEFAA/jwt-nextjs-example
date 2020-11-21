import Token from 'csrf'
// generate a csrf token &&
// save it on a cookie &&
//  return cookie
const csrf_name = '_csrfToken'
export const generateCsrf = async function (response) {
	const tokens = new Token()
	// create a secret
	const secret = await tokens.secret()
	// create a token from secret
	const token = tokens.create(secret)
	// save the token to a cookie

	const cookie = `_csrfToken=${token};HttpOnly=true;SameSite=true;Path=/`
	response.setHeader('Set-Cookie', cookie)

	return token
}

export const validCSRF = function (req, res) {
	const cookie = req.cookies[csrf_name]
	const { body } = req
	if (!cookie || !body[csrf_name]) {
		// might be a csrf
		return false
	}
	if (cookie !== body[csrf_name]) {
		// csrf attack
		return false
	}
	return true
}
