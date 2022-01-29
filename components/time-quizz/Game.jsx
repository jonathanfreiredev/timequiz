import { useEffect, useState } from "react"
import styles from "../../styles/time-quizz/TimeQuizzGame.module.scss"
import cn from "classnames"

export default function Game({username, categoryText, questions, numQuestions, onBackToMenu, onHearts, hearts}){
    const defaultCount = 8;
    const [question, setQuestion] = useState("");
    const [answers, setAnswers] = useState([]);
    const [correctAnswer, setCorrectAnswer] = useState();
    const [selectedAnswer, setSelectedAnswer] = useState();
    const [count, setCount] = useState(defaultCount);
    const [counterRunning, setCounterRunning] = useState(true);
    const [countQuestions, setCountQuestions] = useState(0);
    const [resultMessage, setResultMessage] = useState("");
    const [disabledAnswers, setDisabledAnswers] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    const [numRightQuestions, setNumRightQuestions] = useState(0);
    const getQuestion = ()=>{
        if(questions){
            setQuestion(questions[countQuestions].correct_question);
            setAnswers(questions[countQuestions].array_answers);
            setCorrectAnswer(questions[countQuestions].correct_answer);
        }
    }
    const handleSelectedAnswer = (value)=>{
        let heartsCopy = JSON.parse(JSON.stringify(hearts));
        const index = heartsCopy.findIndex(e => e.username  === username);
        setSelectedAnswer(value);
        if(value === correctAnswer) {
            setNumRightQuestions(numRightQuestions+1);
            setResultMessage("Great!");
        }else if(value === "Time is over"){
            setResultMessage(value);
            heartsCopy[index].hearts--;
            onHearts(heartsCopy);
            if(heartsCopy[index].hearts<1){
                setIsGameOver(true);
            }
        }else{
            setResultMessage("Fail");
            heartsCopy[index].hearts--;
            onHearts(heartsCopy);
            if(heartsCopy[index].hearts<1){
                setIsGameOver(true);
            }
        }
        setCounterRunning(false);
        setDisabledAnswers(true);
    }
    const resetValues = (isWinner)=>{
        const numRightQuestionsCopy = numRightQuestions;
        setSelectedAnswer();
        setResultMessage("");
        setDisabledAnswers(false);
        setCountQuestions(0);
        setAnswers([]);
        setCorrectAnswer();
        setCounterRunning(false);
        setCount(defaultCount);
        setDisabledAnswers(false);
        setQuestion("");
        setIsGameOver(false);
        setNumRightQuestions(0);
        onBackToMenu(isWinner, numRightQuestionsCopy);
    }
    //Continue or finish the game
    const handleContinue = ()=>{
        setSelectedAnswer();
        setResultMessage("");
        setDisabledAnswers(false);
        //Continue
        if(!isGameOver){
            if((countQuestions+1) < numQuestions){
                setCountQuestions(prev=>prev+1);
            }else{
                resetValues(true);
            }
        //Finish the game
        }else if(isGameOver){
            resetValues(false);
        }
    }
    useEffect(()=>{
        if(questions.length > 0){
            getQuestion();
            setCounterRunning(true);
            setCount(defaultCount);
        }
    }, [countQuestions]);

    useEffect(() => {
        let interval = undefined;
        if (counterRunning) {
            interval = setInterval(() => {
            if(count >=0 ){
                setCount((prev) => prev - 1);
            }
          }, 1000);
        }
        return () => clearInterval(interval);
    }, [counterRunning]);

    useEffect(() => {
        if (count <= 0) {
            handleSelectedAnswer("Time is over");
            setCounterRunning(false);
            setDisabledAnswers(true);
        }
    }, [count]);


    return <div className={styles.form}>
        <h3>{categoryText}</h3>
        <div className={styles.panelQuestion}>
            <p className={styles.question}>{question}</p>
            <div className={styles.answers}>
                {answers.map((answer, index) => 
                    <div key={index} className={(selectedAnswer && correctAnswer === answer) ? cn(styles.answer, styles.correctAnswer) : styles.answer} onClick={()=>handleSelectedAnswer(answer)} disabled={disabledAnswers}>
                        <p>{answer}</p>
                    </div>
                )}
            </div>
        </div>
        <div className={styles.counter} style={{width:`${(count-1)*100/defaultCount}%`}}></div>
        <p>{`Question: ${countQuestions+1}/${numQuestions}`}</p>
        <p>{resultMessage}</p>
        {(count === 0 || disabledAnswers) &&
            <button type="button" className={styles.buttonNextQuestion} onClick={handleContinue}>{((countQuestions+1) < numQuestions && !isGameOver) ? "Continue" : "Finish"}</button>
        }
</div>
}