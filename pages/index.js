import Head from "next/head"
import Layout from "../components/Layout"
import Loading from "../components/Loading"
import Interface from "../components/time-quizz/Interface"
import { useSession } from "next-auth/client"

export default function TimeQuizz() {
  const [session, loading] = useSession();

  if(loading){
    return <Loading />
  }
  return <div>
  <Head>
    <title>Time quizz - Jonathan Freire</title>
    <meta name="description" content="A real time game of questions" />
  </Head>
  <Layout title="Time Quiz." subtitle="Jonathan Freire." refTitle="/">
    <Interface />
  </Layout>
  </div>
}