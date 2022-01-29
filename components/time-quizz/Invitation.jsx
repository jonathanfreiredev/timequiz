import styles from "../../styles/time-quizz/Invitation.module.scss"
import { useState, useRef } from "react"

export default function Invitation(){
    const [textCopy, setTextCopy] = useState("Copy");
    const refCopy = useRef(null);

    const handleCopyLink = ()=>{
        navigator.clipboard.writeText(`https://timequiz.jonathanfreire.com`);
        setTextCopy("Copied");
        refCopy.current.classList.remove(styles.animationLink);
        setTimeout(()=>{
            refCopy.current.classList.add(styles.animationLink);
        }, 30);
        setTimeout(()=>{
            setTextCopy("Copy");
        },3000);
    }
    return <div className={styles.root}>
        <p>Invite your friends to this game with this link:</p>
        <div className={styles.link}>
            <p>https://timequiz.jonathanfreire.com</p><button className={styles.animationLink} type="button" ref={refCopy} onClick={handleCopyLink}>{textCopy}</button>
        </div>
    </div>
}