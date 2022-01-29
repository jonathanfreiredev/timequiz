import styles from "../styles/Avatar.module.scss"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { useState } from "react"

export default function Avatar({name, width, height, selectedAvatar, onSelectedAvatar, style}){
    const [checked, setChecked] = useState(false);
    return <div className={styles.root}>
        <img src={`https://joeschmoe.io/api/v1/${name}`} alt="avatar" className={styles.image} onClick={()=>onSelectedAvatar(name)} style={style}></img>
        <style jsx>
            {`.${styles.image}{
                width: ${width};
                height: ${height};
                }
            `}
        </style>
        {selectedAvatar == name &&
            <div className={styles.check}>
                <FontAwesomeIcon icon={faCheck} />
            </div>
        }
    </div>
}