import Authentication from "../components/Authentication"
import Head from 'next/head'
import Layout from '../components/Layout'

export default function signup(){
    return <div>
        <Head>
            <title>Jonathan Freire - Sign up</title>
            <meta name="description" content="Sign up" />
        </Head>
        <Layout title="Time quizz." subtitle="Jonathan Freire." refTitle="/" firstRef="/#works" firstName="Works." secondRef="#footer" secondName="Contact me.">
            <Authentication type="signup" />
        </Layout>
    </div>
}