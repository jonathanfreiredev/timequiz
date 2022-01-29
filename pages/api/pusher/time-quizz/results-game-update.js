import pusher from "../../../../lib/pusher"
// chat channel handler
export default async function handler(req, res) {
  const usersResults = req.body;
  // trigger a new post event via pusher
  await pusher.trigger(`presence-chat-time-quizz`, "results-game-update", {
    usersResults
  });

  res.json({ status: 200 });
}