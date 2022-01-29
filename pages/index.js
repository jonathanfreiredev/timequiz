import Head from "next/head"
import Layout from "../components/Layout"
import Interface from "../components/time-quizz/Interface"
import { useSession } from "next-auth/client"

export default function TimeQuizz() {
  const [session, loading] = useSession();

  if(loading){
    return <div>Loading...</div>
  }
  return <div>
  <Head>
    <title>Time quizz - Jonathan Freire</title>
    <meta name="description" content="A real time game of questions" />
  </Head>
  <Layout title="Time Quiz." refTitle="/">
    <Interface />
  </Layout>
  </div>
}