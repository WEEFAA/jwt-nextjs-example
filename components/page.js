import { Container, Snackbar } from "@material-ui/core"
import MuiAlert from '@material-ui/lab/Alert';
import { useEffect, useState } from "react"

export const Page = ({ children }) => {
    return <Container component="main" maxWidth="sm">
        { children }
    </Container>
}

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

export const Error = ({ message }) => {
    const [open, setOpen] = useState(false)
    
    useEffect(() => {
        setOpen(Boolean(message))
    },[message])

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    }
    
    return <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
            { message || null }
        </Alert>
    </Snackbar>
}