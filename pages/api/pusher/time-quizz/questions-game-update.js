import pusher from "../../../../lib/pusher"
// chat channel handler
export default async function handler(req, res) {
  const questions = req.body;
  // trigger a new post event via pusher
  await pusher.trigger(`presence-chat-time-quizz`, "questions-game-update", {
    questions
  });

  res.json({ status: 200 });
}