import { Error, Page } from "../components/page"
import { Typography, OutlinedInput, FormControl, InputLabel, Button, Container, Input, formatMs } from "@material-ui/core"
import { Buttons, Elevated, Form } from "../components/layout"
import { useState, createRef, useEffect } from "react"
import { authLogin } from "../lib/auth"

function Home(){
    // states
    const [fields, toggleFields] = useState({
        username: "",
        password: ""
    })
    const [errors, setErrors] = useState({
        user: false, // username & password error state
        pass: false
    })
    const [message, setMessage] = useState("")

    const formRef = createRef()
    // form control
    function onChange(e){
        const { target } = e 
        toggleFields({
            ...fields,
            [target.name]: target.value
        })
    }

    // submit handler
    async function onSubmit(){
        const {current: loginForm} = formRef
        // ref not established
        if(!loginForm) return null
        // submit the form
        const valid = loginForm.checkValidity()
        if(!valid) {
            return loginForm.reportValidity()
        }
        // authorize user 
        await submitHandler()
    }   
    
    async function submitHandler(){
        // get form data
        const formSrc = document.forms['loginForm']
        const formData = new FormData(formSrc)
        const authCredentials = {
            username: formData.get('username') || "",
            password: formData.get('password') || ""
        }
        // auth
        const authenticator = authLogin(authCredentials)   
        const authResult = await authenticator()
        // handle result
        authHandler(authResult)
    }

    function authHandler(result){
        if(!result.ok){
            // error message, if exist
            setMessage(result.message)
            // update error states
            setErrors({
                user: !!result.user,
                pass: !!result.pass 
            })
        }
    }

    return <Page>
        <Elevated>
            <Typography variant="h3" component="h1" color="primary" style={{textAlign: 'center'}}>
                Login
            </Typography>
            <Typography variant="h6" component="h2" color="textSecondary" style={{textAlign: 'center'}}>
                JWT authorization DEMO
            </Typography>
            <Form ref={formRef} method="POST" action="/api/auth/login" >
                <Error message={message}/>
                <FormControl variant="outlined" fullWidth margin="normal" size="small" required>
                    <InputLabel htmlFor="username">Username</InputLabel>
                    <OutlinedInput 
                        id="username" name="username" 
                        placeholder="emela" label="username" error={errors.user}
                        value={fields.username} onChange={onChange} required/>
                </FormControl>
                <FormControl variant="outlined" fullWidth size="small" required>
                    <InputLabel htmlFor="password">Password</InputLabel>
                    <OutlinedInput 
                        id="password" name="password" type="password"
                        placeholder="************" label="password" error={errors.pass}
                        value={fields.password} onChange={onChange} required/>
                </FormControl>
                <Buttons>
                    <Button color="primary" variant="contained" onClick={onSubmit}>Login</Button>
                    <Button variant="contained">Info</Button>
                </Buttons>
            </Form>
        </Elevated>
    </Page>
}

export default Home