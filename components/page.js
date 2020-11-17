import { Container } from "@material-ui/core"

export const Page = ({ children }) => {
    return <Container component="main" maxWidth="sm">
        { children }
    </Container>
}