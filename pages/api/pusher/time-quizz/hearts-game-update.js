import pusher from "../../../../lib/pusher"
// chat channel handler
export default async function handler(req, res) {
  const usersHearts = req.body;
  // trigger a new post event via pusher
  await pusher.trigger(`presence-chat-time-quizz`, "hearts-game-update", {
    usersHearts
  });

  res.json({ status: 200 });
}