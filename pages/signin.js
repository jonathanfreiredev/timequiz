import Authentication from "../components/Authentication"
import Head from 'next/head'
import Layout from '../components/Layout'

export default function signin(){
    return <div>
        <Head>
            <title>Jonathan Freire - Sign in</title>
            <meta name="description" content="Sign in" />
        </Head>
        <Layout title="Time quizz." subtitle="Jonathan Freire." refTitle="/" firstRef="/#works" firstName="Works." secondRef="#footer" secondName="Contact me.">
            <Authentication type="signin" />
        </Layout>
    </div>
}