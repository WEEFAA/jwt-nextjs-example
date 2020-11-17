import { Container, Paper } from "@material-ui/core"
import { forwardRef } from "react"

// Elevated paper layout
export const Elevated = ({ el, children}) => {
    return <Paper component="section" elevation={el || 3} style={{minHeight: "40vh"}}>
        { children }
    </Paper> 
}

// Form layout
export const Form = forwardRef((props,ref) => {
    const {  children, maxWidth = "xs", onSubmit = () => {}, ...rest } = props
    
    return <form onSubmit={onSubmit} ref={ref} {...rest}>
        <Container maxWidth={maxWidth} fixed>
            { children }
        </Container>
    </form>
})

export const Buttons = ({ children }) => {
    return <div className="button-group">
        { children }
    </div>
}