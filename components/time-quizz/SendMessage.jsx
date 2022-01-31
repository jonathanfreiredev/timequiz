import styles from "../../styles/time-quizz/TimeQuizzGame.module.scss"
import cn from "classnames"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronCircleRight } from '@fortawesome/free-solid-svg-icons'

export default function SendMessage ({ handleSubmit, handleMessageChange, message }) {
  return <form className={styles.formSendMessage}>
      <input
        type="text"
        value={message}
        onChange={handleMessageChange}
        className={cn(styles.deleteDefectStyleInput, styles.typing)}
        placeholder="Say something!"
      ></input>
      <button type="submit" onClick={handleSubmit} className={cn(styles.deleteDefectStyleInput, styles.buttonSubmit)}>
        <FontAwesomeIcon icon={faChevronCircleRight} className={styles.iconChevronCircleRight} />
      </button>
    </form>
}
  