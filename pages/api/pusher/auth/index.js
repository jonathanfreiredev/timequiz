import pusher from "../../../../lib/pusher"
import { v4 as uuidv4 } from 'uuid';

export default async function handler( req, res ) {
  // see https://pusher.com/docs/channels/server_api/authenticating-users
  const { socket_id, channel_name, username, image } = req.body;
  const presenceData = {
    user_id: uuidv4(),
    user_info: {
      username: username,
      image: image,
    },
  };
  try{
    const auth = pusher.authenticate(socket_id, channel_name, presenceData);
    res.send(auth);
  }catch(error) {
    console.log("error",error);
  }
}