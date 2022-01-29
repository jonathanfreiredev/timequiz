import Pusher from "pusher"

const pusher = new Pusher({
  appId: process.env.APP_ID_PUSHER,
  key: process.env.KEY_PUSHER,
  secret: process.env.SECRET_PUSHER,
  cluster: process.env.CLUSTER_PUSHER,
  useTLS: true,
});
export default pusher;