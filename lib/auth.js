// login auth helper
export const authLogin = (credentials) => {
    const url = "/api/auth/login"
    return async () => {
        try{
            const res = await fetch(url, {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            })
            // return auth result
            return res.json()
        }catch(e){
            // fetch network issues or CORS
            return {
                ok: false,
                message: "Something went wrong logging in."
            }
        }
    }
}
