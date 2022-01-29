import { getSession } from "next-auth/client"
import pusher from "../../../../lib/pusher"

export default async function handler( req, res ) {
  const session = await getSession({req});
  // see https://pusher.com/docs/channels/server_api/authenticating-users
  const { socket_id, channel_name } = req.body;
  if(session){
    const presenceData = {
      user_id: session.user.user.id,
      user_info: {
        username: session.user.user.username,
        image: session.user.user.image,
      },
    };
    try{
      const auth = pusher.authenticate(socket_id, channel_name, presenceData);
      res.send(auth);
    }catch(error) {
      console.log("error",error);
    }
  }else{
    res.status(403).json({});
  }
}