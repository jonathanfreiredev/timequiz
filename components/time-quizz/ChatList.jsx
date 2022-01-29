import styles from "../../styles/time-quizz/TimeQuizzGame.module.scss"

export default function ChatList ({ chat, currentUser }){
  return <div className={styles.message}>
    <div className={styles.textMessage}>
      <p>{chat.message}</p>
    </div>
    <div className={styles.usernameMessage}>
      <p>{chat.username}</p>
    </div>
    <style jsx>
      {`.${styles.message}{
          align-items: ${chat.username === currentUser ? "flex-end" : "flex-start"};
          align-self: ${chat.username === currentUser ? "flex-end" : "flex-start"};
          margin: ${chat.username === currentUser ? "5px 7px 5px 0" : "5px 0 5px 7px"};
        }
        .${styles.usernameMessage}{
          ${chat.username === currentUser ? 
            "text-align: right;"
          :
            "text-align: left;"
          };
        }`}
    </style>
  </div>
}