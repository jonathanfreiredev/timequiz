import pusher from "../../../../lib/pusher"
// chat channel handler
export default async function handler(req, res) {
  const winner = req.body;
  // trigger a new post event via pusher
  await pusher.trigger(`presence-chat-time-quizz`, "winner-update", {
    winner
  });

  res.json({ status: 200 });
}