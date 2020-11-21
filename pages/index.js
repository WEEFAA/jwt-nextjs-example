import { Typography, CircularProgress, Link, Input, Box } from '@material-ui/core'
import { Elevated, Form } from '../components/layout'
import { Page } from "../components/page"
import { useUser } from "../lib/auth"
import { generateCsrf } from '../lib/csrf'

const api = ({ _csrf }) => {
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
    return (
		<Page>
			<Elevated>
				<Typography variant="h3" component="h1" color="primary" align="center">
					Welcome {user}
				</Typography>
				<Typography
                    align="center"
					variant="subtitle1"
					component="p"
					color="textSecondary"
					paragraph>
					you are now authorized, congratulations!
				</Typography>
                <img className="magic-meme" width={365} height={250} alt="A guy saying magic!" src="https://media1.tenor.com/images/d820481ef14b1cd2a16ff4e7660deb5f/tenor.gif?itemid=9239559"/>
				<Form method="POST" action="/api/auth/logout">
                    <Box display="flex" justifyContent="center">
                        <Input type="submit" value="Logout" name="logout" disableUnderline/>
                    </Box>
					<Input type="hidden" name="_csrfToken" value={_csrf} />
				</Form>
			</Elevated>
		</Page>
	)
}

export const getServerSideProps = async function(context){
    const { res } = context 
    const _csrf = await generateCsrf(res)
    return {
        props: { _csrf }
    }
}

export default api