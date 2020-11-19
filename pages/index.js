import { Error, Page } from "../components/page"
import { Typography, OutlinedInput, FormControl, InputLabel, Button, Container, Input, formatMs } from "@material-ui/core"
import { Buttons, Elevated, Form } from "../components/layout"
import { useState, createRef, useEffect } from "react"
import { useRouter } from "next/router"
import { authLogin } from "../lib/auth"

function Home(){
    const router = useRouter()
    // states
    const [fields, toggleFields] = useState({
        username: "",
        password: ""
    })
    const [errors, setErrors] = useState([])
    const [message, setMessage] = useState("")

    // form control
    function onChange(e){
        const { target } = e 
        toggleFields({
            ...fields,
            [target.name]: target.value
        })
    }

    useEffect(() => {
        const query = router.query 
        // check errors 
        const { errors = "", message = "" } = query
        const failing = errors.split(',') 
        // set errors if exist
        setErrors(failing)
        setMessage(message)
    },[router.query])

    return <Page>
        <Elevated>
            <Typography variant="h3" component="h1" color="primary" style={{textAlign: 'center'}}>
                Login
            </Typography>
            <Typography variant="h6" component="h2" color="textSecondary" style={{textAlign: 'center'}}>
                JWT authorization DEMO
            </Typography>
            <Form method="POST" action="/api/auth/login" >
                <Error message={message}/>
                <FormControl variant="outlined" fullWidth margin="normal" size="small" required>
                    <InputLabel htmlFor="username">Username</InputLabel>
                    <OutlinedInput 
                        id="username" name="username" 
                        placeholder="emela" label="username" error={errors.includes('user')}
                        value={fields.username} onChange={onChange} required/>
                </FormControl>
                <FormControl variant="outlined" fullWidth size="small" required>
                    <InputLabel htmlFor="password">Password</InputLabel>
                    <OutlinedInput 
                        id="password" name="password" type="password"
                        placeholder="************" label="password" error={errors.includes('pass')}
                        value={fields.password} onChange={onChange} required/>
                </FormControl>
                <Buttons>
                    <Input type="submit" value="submit"/>
                    <Button color="primary" variant="contained" >Login</Button>
                    <Button variant="contained">Info</Button>
                </Buttons>
            </Form>
        </Elevated>
    </Page>
}

export default Home