import Head from "next/head"
import Layout from "../components/Layout"
import Interface from "../components/time-quizz/Interface"

export default function TimeQuizz() {
  const descriptionProject= "Time quizz is a game of questions to play in real-time with connected people. So, invite your friends to this public room. Also, you can talk with the people using the chat to decide a category and make it funnier."
  const accordionInfo = [
    {
      title: "How can I play with other people?",
      content: "You can play with connected players. You can also invite friends to the room using the link above. You can also play alone if no one is in the room."
    },
    {
      title: "I am a recruiter. I want to try multiplayer mode.",
      content: "Then I recommend you to have two open windows simultaneously with two different users to test the performance of the game and the chat in multiplayer mode. Notice that the chat messages, game questions, connected users' points and selected categories are shared among all connected users. That is possible thanks to Pusher.js, which is a library that allows data transfer using sockets safely and quickly."
    },
    {
      title: "Are chat and game information stored in a database?",
      content: "No. It is not a commercial game. So it is not necessary to save the data for future rounds. For this reason, if you reload the page, your points will be lost. However, the chat conversation will be preserved until the last player leaves the game. This method is safe and free of database use."
    },
    {
      title: "How were the questions and answers chosen?",
      content: "To get them, I use Trivia API (https://opentdb.com/api_config.php). My game 'Time Quiz' translates the questions and their answers into natural language and orders the answers randomly.",
    }
  ];
  return <div>
  <Head>
    <title>Time quizz - Jonathan Freire</title>
    <meta name="description" content="A real time game of questions" />
  </Head>
  <Layout title="Time Quiz." subtitle="Jonathan Freire." refTitle="/">
    <Interface descriptionProject={descriptionProject} accordionInfo={accordionInfo} />
  </Layout>
  </div>
}