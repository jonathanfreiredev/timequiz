import pusher from "../../../../lib/pusher"
// chat channel handler
export default async function handler(req, res) {
  const { message, username } = req.body;
  // trigger a new post event via pusher
  await pusher.trigger(`presence-chat-time-quizz`, "chat-update", {
    message: message,
    username: username
  });

  res.json({ status: 200 });
}