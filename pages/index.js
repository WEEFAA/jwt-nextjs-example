import { Page } from "../components/page"
import { Typography, OutlinedInput, FormControl, InputLabel, Button, Container } from "@material-ui/core"
import { Buttons, Elevated, Form } from "../components/layout"
import { useState} from "react"

function Home(){
    // state
    const [fields, toggleFields] = useState({
        username: "",
        password: ""
    })
    // form control
    function onChange(e){
        const { target } = e 
        toggleFields({
            ...fields,
            [target.name]: target.value
        })
    }

    return <Page>
        <Elevated>
            <Typography variant="h3" component="h1" color="primary" style={{textAlign: 'center'}}>
                Login
            </Typography>
            <Typography variant="h6" component="h2" color="textSecondary" style={{textAlign: 'center'}}>
                JWT authorization DEMO
            </Typography>
            <Form>
                <FormControl variant="outlined" fullWidth margin="normal" size="small" required>
                    <InputLabel htmlFor="username">Username</InputLabel>
                    <OutlinedInput 
                        id="username" name="username" 
                        placeholder="emela" label="username"
                        value={fields.username} onChange={onChange} required/>
                </FormControl>
                <FormControl variant="outlined" fullWidth size="small" required>
                    <InputLabel htmlFor="password">Password</InputLabel>
                    <OutlinedInput 
                        id="password" name="password" type="password"
                        placeholder="************" label="password" 
                        value={fields.password} onChange={onChange} required/>
                </FormControl>
                <Buttons>
                    <Button color="primary" variant="contained">Login</Button>
                    <Button variant="contained">Info</Button>
                </Buttons>
            </Form>
        </Elevated>
    </Page>
}

export default Home