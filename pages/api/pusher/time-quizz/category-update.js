import pusher from "../../../../lib/pusher"
// chat channel handler
export default async function handler(req, res) {
  const arrayCategories = req.body;
  // trigger a new post event via pusher
  await pusher.trigger(`presence-chat-time-quizz`, "category-update", {
    arrayCategories
  });

  res.json({ status: 200 });
}