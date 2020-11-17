import Head from "next/head"
import "./index.css"

function App({Component, props}){
    return <>
        <Head>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
        </Head>
        <Component {...props}/>
    
    </>
}

export default App