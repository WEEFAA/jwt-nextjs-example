import { Typography, CircularProgress, Link } from "@material-ui/core"
import { Elevated } from "../components/layout"
import { Page } from "../components/page"
import { useUser } from "../lib/auth"

const api = () => {
    // next router
    const { error, data, isValidating } = useUser()
    // check errors
    if(isValidating) return <CircularProgress />

    // redirect to login if any errors occured
    if(error){
        return <Page>
            <Elevated>
                <Typography variant="h4" align="center" color="primary" component="h1">Not Authorize</Typography>
                <Typography component="p" variant="subtitle1" align="center">please log in first</Typography>
                <div style={{width: "50%", margin: "0 auto", display: "flex", justifyContent: "center" }}>
                    <Link color="primary" align="center" href="/login">Log in</Link>
                </div>
                
            </Elevated>
        </Page>
    }
    const {
        user = ""
    } = data || {}
    // show authenticated user
    return <Page>
        <Elevated>
            <Typography variant="h3" component="h1" color="primary">Welcome {user}</Typography>
            <Typography variant="subtitle1" component="p" color="textSecondary" paragraph>you are now authroized, congratulations!</Typography>
            <Link color="secondary" href="/logout">Log out</Link>
        </Elevated>
    </Page>
}

export default api