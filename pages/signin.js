import Authentication from "../components/Authentication"
import Head from 'next/head'
import Layout from '../components/Layout'

export default function Signin(){
    return <div>
        <Head>
            <title>Jonathan Freire - Sign in</title>
            <meta name="description" content="Sign in" />
        </Head>
        <Layout title="Time quizz." subtitle="Jonathan Freire." refTitle="/">
            <Authentication type="signin" />
        </Layout>
    </div>
}