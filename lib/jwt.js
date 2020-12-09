import jwt from "jsonwebtoken"
// secret key
export const cookieName = 'jwt-weefa'
const flags = 'HttpOnly=true;Path=/'
const defaultJWTSecret = 'jwt-secret'
// sign jwt token
export const runJWTMiddleware = async function(req,res,info){
	const jwt_secret = process.env.SECRET_JWT || defaultJWTSecret
	const {
		// if login is initiated by an app
		// use tihs query to redirect to that app callback
		query: { app_callback = '/' },
	} = req
	// create expiration
	const payload = {
		sub: info.username,
		user_id: info._id,
		expiresIn: '1d',
	}
	// sign
	const token = await jwt.sign(payload, jwt_secret)
	// set the cookie
	res.setHeader('Set-Cookie', `${cookieName}=${token};${flags}`)
	// redirect to resource with the sid, containing the token (if legitimate)
	const should_redirect_with_token = isLegitimateCallbackUri(
		process.env.APP_CALLBACK_URIS,
		app_callback
	)
	const go_to_uri = should_redirect_with_token
		? `${app_callback}?sid=${token}`
		: app_callback
	res.writeHead(303, {
		Location: go_to_uri,
	})
	return res.end()
}

// returns a booelan 
export const verifyUser = async (req) => {
	const jwt_secret = process.env.SECRET_JWT || defaultJWTSecret
	try{
		const jwt_token = req.cookies[cookieName]
		return jwt.verify(jwt_token, jwt_secret, (err, payload) => {
			if (err) return false
			// return payload
			return true
		})
	}catch(e){
		console.error(e) // ideally, log the error to a logging service
		return false
	}
}

export const destroyJWT = function (res) {
	res.setHeader(
		'Set-Cookie',
		`${cookieName}=0;${flags};MaxAge=0;Expires=${new Date()}`
	)
	return null
}

// check if legitimate callback_uri
function isLegitimateCallbackUri(uris = [], app_callback){
    const legitimate_uris = uris.split(',')
    return legitimate_uris.includes(app_callback)
}