import styles from "../../styles/time-quizz/TimeQuizzGame.module.scss"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronUp } from '@fortawesome/free-solid-svg-icons'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { useRef, useState, useEffect } from "react"

export default function OptionsGame({selectedCategories, onSelectedCategory, selectedCategoryByUser, onlineUsersCount, timer, onStartGame}){
    const categories = ["General Knowledge", "Books", "Film", "Music", "Musicals & Theatres", "Television", "Video Games", "Board Games", "Science & Nature", "Computers", "Mathematics", "Mythology", "Sports", "Geography", "History", "Politics", "Art", "Celebrities", "Animals", "Vehicles", "Comics", "Gadgets", "Japanese Anime & Manga", "Cartoon & Animations" ]
    const defaultSeconds = 4;
    const [seconds, setSeconds] = useState(defaultSeconds);
    const refCategories = useRef(null);

    const handleMoveCategories = (value)=>{
        refCategories.current.scrollTop += value;
    }
    useEffect(() => {
        let interval = null;
        if (timer && seconds > 0) {
            interval = setInterval(() => {
                setSeconds(seconds => seconds - 1);
            }, 1000);
        } else if(timer && seconds === 0){
            setSeconds(defaultSeconds);
            clearInterval(interval);
            onStartGame();
        }else if (!timer) {
            setSeconds(defaultSeconds);
            clearInterval(interval);
        } 
        return () => clearInterval(interval);
    }, [timer, seconds]);

    return <div className={styles.form}>
            <div className={styles.carrousel}>
                <button type="button" className={styles.carrouselArrow} onClick={()=>handleMoveCategories(-92)}>
                    <FontAwesomeIcon icon={faChevronUp} />
                </button>
                <div className={styles.categories} ref={refCategories}>
                    {categories.map((category, index) => {
                        return <div key={index} className={styles.category} style={{backgroundColor: (selectedCategoryByUser === category) && "rgb(86, 255, 162)"}} onClick={()=>onSelectedCategory(index+9, categories[index])}>
                            <p>{category}</p>
                            {selectedCategories.map((element, index) => {
                                if(element.category === category){
                                    return <p key={index}>{element.count}/{onlineUsersCount}</p>
                                }
                            })}
                        </div>
                    })}
                </div>
                <button type="button" className={styles.carrouselArrow} onClick={()=>handleMoveCategories(92)}>
                    <FontAwesomeIcon icon={faChevronDown} />
                </button>
            </div>
            <p className={styles.explication}>{timer ? `The game start in ${seconds}.\nRemove your selected or select another category to stop the time.` : "The game start when all of you choose the same category.\nOnly if you finish with live, you can added points to you."}</p>
        </div>
}