import { useEffect, useState, useRef } from "react"
import Pusher from "pusher-js"
import SendMessage from "../../components/time-quizz/SendMessage"
import OptionsGame from "../../components/time-quizz/OptionsGame"
import ChatList from "../../components/time-quizz/ChatList"
import Game from "../../components/time-quizz/Game"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCrown, faHeart, faTrophy, faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import styles from "../../styles/time-quizz/TimeQuizzGame.module.scss"
import Invitation from "../../components/time-quizz/Invitation"
import DescriptionProject from "../../components/DescriptionProject"
import Avatar from "../Avatar"
import cn from "classnames"

export default function TimeQuizzGame({descriptionProject, accordionInfo}){
    const [chats, setChats] = useState([]);
    const [messageToSend, setMessageToSend] = useState("");
    const [onlineUsersCount, setOnlineUsersCount] = useState(0);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [usersRemoved, setUsersRemoved] = useState([]);
    const [isNewUserOnline, setIsNewUserOnline] = useState(false);
    const [newUserOnline, setNewUserOnline] = useState();
    const [selectedCategoryByAllUsers, setSelectedCategoryByAllUsers] = useState();
    const [selectedCategoryTextByAllUsers, setSelectedCategoryTextByAllUsers] = useState();
    const [selectedCategoryText, setSelectedCategoryText] = useState();
    const [isACategorySelectedByUser, setIsACategorySelectedByUser] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [username, setUsername] = useState("");
    const [errorUsername, setErrorUsername] = useState("");
    const [usernameChoosing, setUsernameChoosing] = useState("");
    const [isUserOnline, setIsUserOnline] = useState(false);
    const [timer, setTimer] = useState(false);
    const [startGame, setStartGame] = useState(false);
    const [questionsGame, setQuestionsGame] = useState([]);
    const [hearts, setHearts] = useState([]);
    const [resultsGame, setResultsGame] = useState([]);
    const [winner, setWinner] = useState();
    const [selectedAvatar, setSelectedAvatar] = useState("joe");
    const refAvatars = useRef(null);
    const avatars = ["james", "jerry", "joe", "jeri", "jazebelle", "jude", "jacques", "jocelyn", "josephine", "jabala", "jake", "josh", "jess", "jodi", "jai", "jordan", "jon", "jeane", "julie", "jana", "jia", "jane", "jean", "jolee", "jed", "jaqueline", "jenni", "jack"]
    const refMessages = useRef(null);

    const numQuestions = 5;
    const dev = process.env.NODE_ENV === "development" ? "http://localhost:3000/" : "https://timequiz.jonathanfreire.com/";

    const pusher = new Pusher(process.env.NEXT_PUBLIC_KEY_PUSHER, {
        cluster: "eu",
        authEndpoint:`${dev}/api/pusher/auth`,
        forceTLS: true,
        auth: {
          params: {
            username: username,
            image: `https://joeschmoe.io/api/v1/${selectedAvatar}`
          }
        }
    });
    /* Handles */
    const handleUsername = (e)=>{
      setUsernameChoosing(e.target.value);
    }

    const handleSubmitUsername = ()=>{
      if(usernameChoosing == "") {
        setErrorUsername("Introduce your name");
      }else{
        setErrorUsername("");
        setUsername(usernameChoosing);
        setUsernameChoosing("");
        setIsUserOnline(true);
      }
    }
    const handleSliderMessages = ()=>{
      refMessages.current.scrollTop = refMessages.current.scrollHeight - refMessages.current.clientHeight;
    }
    const handleChatSubmit = (e) => {
      e.preventDefault();
      postData({
        username,
        message: messageToSend
      }, "chat-update");
      setMessageToSend("");
    };

    /* User form */
    const handleMoveAvatars = (value)=>{
      refAvatars.current.scrollLeft += value;
    }
    const handleSelectedAvatar = (value)=>{
        setSelectedAvatar(value);
    }

    const handleHearts = async (heartsCopy)=>{
      await postData(heartsCopy, "hearts-game-update");
    }
    const handleRemoveCategoryUser = (member)=>{
      let selectedCategoriesCopy = JSON.parse(JSON.stringify(selectedCategories));
      let countCategories = selectedCategoriesCopy.length;
      let found = false;
      let i = 0, indexUser;
      if(countCategories>0){
        while(!found && i < countCategories){
          indexUser = selectedCategoriesCopy[i].users.findIndex(user => user === member);
          if(indexUser != -1){
            found = true;
            break;
          }
          i++;
        }
        if(found){
          if(selectedCategoriesCopy[i].count === 1){
            selectedCategoriesCopy.splice(i, 1);
          //More than one user in this category
          }else if(selectedCategoriesCopy[i].count > 1){
            selectedCategoriesCopy[i].users.splice(indexUser, 1);
            selectedCategoriesCopy[i].count--;
          }
          postData(selectedCategoriesCopy, "category-update");
        }
      }
    }
    const handleSelectedCategory = (index, category)=>{
      let selectedCategoriesCopy = JSON.parse(JSON.stringify(selectedCategories));
      const indexCategory = selectedCategoriesCopy.findIndex(element => element.category === category);
      
      //Remove the last category
      const removeSelectedCategory = ()=>{
        const indexLastCategory = selectedCategoriesCopy.findIndex(element => element.category === selectedCategoryText);
        const users = selectedCategoriesCopy[indexLastCategory].users;
        //Only one user in this category
        if(users.length === 1){
          selectedCategoriesCopy.splice(indexLastCategory, 1);
          //More than one user in this category
        }else if(users.length > 1){
          const indexUserInCategory = users.findIndex(element => element === username);
          users.splice(indexUserInCategory, 1);
          selectedCategoriesCopy[indexLastCategory].count--;
        }
      }
      //Select a Category
      const selectCategory = ()=>{
        const newCategory = {category: category, indexApi: index, users:[username], count: 1};
        if(selectedCategoriesCopy.length > 0 && indexCategory !== -1){
          selectedCategoriesCopy[indexCategory].count++;
          selectedCategoriesCopy[indexCategory].users.push(username);
        }
        if(selectedCategoriesCopy.length === 0 || (selectedCategoriesCopy.length > 0 && indexCategory === -1)){
          selectedCategoriesCopy.push(newCategory);
        }
      }
      /* There are 3 options:
        1. To select an category for the first time
        2. To delete his last category
        3. To select a new category (and to delete the last one automatically)
      */
      const select = (onlyRemove, isSelectedByUser)=>{
        if(!onlyRemove) selectCategory();
        if(!isSelectedByUser){
          setIsACategorySelectedByUser(true);
        }else{
          removeSelectedCategory();
        }
        postData(selectedCategoriesCopy, "category-update");
        if(onlyRemove) setIsACategorySelectedByUser(false);
        setSelectedCategoryText(onlyRemove ? undefined : category);
      }

      if(!isACategorySelectedByUser){
        select(false, false);
      }else if(isACategorySelectedByUser){
        if(indexCategory === -1){
          select(false, true);
        }else if(indexCategory !== -1){
          if(selectedCategoriesCopy[indexCategory].users.find(el=>el === username) === undefined){
            select(false, true);
          // User select his last choise
          }else if(selectedCategoriesCopy[indexCategory].users.find(el=>el === username) !== undefined){
            select(true, true);
          }
        }
      }
    }

    const handleRemoveHeartsUser = (user)=>{
      let heartsCopy = JSON.parse(JSON.stringify(hearts));
      const index = heartsCopy.findIndex(e => e.username === user);
      if(index !== -1){
        heartsCopy[index].hearts = 0;
        postData(heartsCopy, "hearts-game-update");
      }
    }

    const handleStartGame = ()=>{
      setTimer(false);
      setSelectedCategoryByAllUsers(selectedCategories[0].indexApi);
      setSelectedCategoryTextByAllUsers(selectedCategories[0].category);
      //Start game
      getHearts();
      getQuestions(selectedCategories[0].indexApi);
    }

    const getQuestions = async (val)=>{
      if(onlineUsers[0].username === username){
          try{
              const body = await fetch(`https://opentdb.com/api.php?amount=${numQuestions}&category=${val}&difficulty=medium&encode=url3986`, {
                  method:'GET'
              }).then(response => response.json())
              .then(data => {
                  const array_questions = data.results.map((element)=>{
                      const correct_question = decodeURIComponent(element.question);
                      const incorrect_answers = element.incorrect_answers.map((val) => decodeURIComponent(val));
                      const correct_answer = decodeURIComponent(element.correct_answer);
                      const array_answers = [...incorrect_answers, correct_answer].sort(()=> Math.random() - 0.5 );
                      return {correct_question, correct_answer, array_answers};
                  })
                  return array_questions;
              });
              await postData(body, "questions-game-update");
          }catch(error){
              console.log(error);
          }
      }
    }

    const getHearts = async ()=>{
      if(onlineUsers[0].username === username){
        try{
          const usersHearts = onlineUsers.map((user)=>{
            return {username: user.username, hearts: 3};
          });
          await postData(usersHearts, "hearts-game-update");
        }catch(error){
          console.log(error);
        }
      }
    }
    /* Get results of the Game */
    const getResultsGame = ()=>{
      let resultsGameCopy = JSON.parse(JSON.stringify(resultsGame));
      let arrayNewUsers = [];
      onlineUsers.forEach((element)=>{
        const hasUserResults = resultsGameCopy.some(e => e.username === element.username);
        if(!hasUserResults){
          arrayNewUsers = [...arrayNewUsers, {username: element.username, gamesWon: 0}];
        }
      })
      if(arrayNewUsers.length > 0){
        postData([...resultsGameCopy,...arrayNewUsers], "results-game-update");
      }else{
        postData(resultsGame, "results-game-update");
      }
    }
    
    //Go back to the menu of categories (in order to don't lost the chat)
    const handleBackToMenu = (isWinner, numRightQuestions)=>{
      setStartGame(false);
      setQuestionsGame([]);
      let resultsGameCopy = JSON.parse(JSON.stringify(resultsGame));
      const index = resultsGameCopy.findIndex(e => e.username === username);
      resultsGameCopy[index].gamesWon += numRightQuestions;
      if(isWinner){
        resultsGameCopy[index].gamesWon += 2;
      }
      postData(resultsGameCopy, "results-game-update");
    }

    /* Post */
    const postData = async(data, api)=>{
      await fetch(`/api/pusher/time-quizz/${api}`, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(data)
      });
    }

    useEffect(() => {
      if(isUserOnline){
        setIsUserOnline(false);
        const channel = pusher.subscribe(`presence-chat-time-quizz`);
        /* Update members using the members of the channel */
        const updateMembers = ()=>{
          const array = Object.values(channel.members.members).map((memb)=>{
            return {username: memb.username, image: memb.image};
          })
          array.sort();
          setOnlineUsers(array);
          setOnlineUsersCount(channel.members.count);
        }
        // when a new member successfully subscribes to the channel
        channel.bind("pusher:subscription_succeeded", (members) => {
          updateMembers();
          console.log("subscription_succeeded");
        });
        // when a new member joins the chat
        channel.bind("pusher:member_added", (member) => {
          updateMembers();
          console.log("added");
          setIsNewUserOnline(true);
          setNewUserOnline(member.info.username);
        });
        // when a member leaves the chat
        channel.bind("pusher:member_removed", (member) => {
          console.log("removed");
          setUsersRemoved(prev => [...prev, member.info.username]);
          updateMembers();
        });

        // updates chats on every message
        channel.bind("chat-update", (data)=>{
            const {username, message} = data
            setChats((prevState) => [
                ...prevState,
                { username, message },
            ]);
            handleSliderMessages();
        });
        // update the complete chat
        channel.bind("complete-chat-update", (data)=>{
          const {chat} = data;
          setChats(chat);
        });
        /* updates category  */
        channel.bind("category-update", (data)=>{
          const {arrayCategories} = data;
          setSelectedCategories(arrayCategories);
        });
        /* updates question game  */
        channel.bind("questions-game-update", (data)=>{
          const {questions} = data;
          setQuestionsGame(questions);
        });
        // update the hearts of the users
        channel.bind("hearts-game-update", (data)=>{
          const {usersHearts} = data;
          setHearts(usersHearts);
        });
        // update the results of the users
        channel.bind("results-game-update", (data)=>{
          const {usersResults} = data;
          setResultsGame(usersResults);
        });
        //update the winner of the game
        channel.bind("winner-update", (data)=>{
          const {winner} = data;
          setWinner(winner);
        });

        return () => {
            pusher.unsubscribe("presence-chat");
        };
      }
    }, [isUserOnline]);

    useEffect(()=>{
      if(isNewUserOnline){
        if(onlineUsers[0].username === username){
          postData(selectedCategories, "category-update");
          postData(chats, "complete-chat-update");
          postData(winner, "winner-update");
          setIsNewUserOnline(false);
        }
      }
    },[isNewUserOnline]);

    useEffect(()=>{
      if(resultsGame.length > 0){
        if(resultsGame[0].username === username){
          let wins = 0
          let user;
          resultsGame.forEach(e => {
            if(e.gamesWon > wins){
              user = e;
              wins = e.gamesWon;
            }
          });
          if(user){
            if(!winner || (winner && (winner.username !== user.username))){
              postData(user, "winner-update");
            }
          }
        }
      }
    }, [resultsGame])

    useEffect(()=>{
      if(onlineUsers.length === 1){
        getResultsGame();
      }
    },[onlineUsers]);
    useEffect(()=>{
      if(newUserOnline && onlineUsers.length > 1 && resultsGame.length>0){
        //find the first user in resultsGame who is connected
        const index = resultsGame.findIndex((elem) => {
          if(elem.username !== newUserOnline){
            const userOnline = onlineUsers.findIndex(e => e.username === elem.username);
            if(userOnline !== -1){
              return true;
            }else{
              return false;
            }
          }
        });
        if(index !== -1 && resultsGame[index].username === username){
          getResultsGame();
        }
      }
      setNewUserOnline();
    },[newUserOnline])

    useEffect(()=>{
      let users_removed = JSON.parse(JSON.stringify(usersRemoved));
      if(usersRemoved.length > 0){
        handleRemoveCategoryUser(users_removed[0]);
        handleRemoveHeartsUser(users_removed[0]);
        users_removed.splice(0,1);
        setUsersRemoved(users_removed);
      }
    },[usersRemoved]);

    useEffect(()=>{
      let selectedCategoriesCopy = JSON.parse(JSON.stringify(selectedCategories));
      const lengthUsers = onlineUsers.length;
      const allSelected = selectedCategoriesCopy.some((element)=> element.count === lengthUsers)
      setTimer(allSelected);
    },[selectedCategories]);

    useEffect(()=>{
      if(questionsGame.length>0){
        setStartGame(true);
        //Go back to default state;
        setSelectedCategoryText();
        setIsACategorySelectedByUser(false);
        setSelectedCategories([]);
      }
    },[questionsGame]);

    return <div>
        <div className={styles.root}>
            <h3>Hi {username == "" ? usernameChoosing : username}!</h3>
            {username == "" ? 
              <div className={styles.formUser}>
                <p>{"Say your name and choose an avatar"}</p>
                <div className={styles.carrouselUserForm}>
                  <button type="button" className={cn(styles.carrouselArrowUserForm, styles.carrouselArrowPrevUserForm)} onClick={()=>handleMoveAvatars(-92)}>
                      <FontAwesomeIcon icon={faChevronLeft} />
                  </button>
                  <div className={styles.avatars} ref={refAvatars}>
                      {avatars.map((avatar, index) => <Avatar key={index} name={avatar} width={"70px"} height={"70px"} selectedAvatar={selectedAvatar} onSelectedAvatar={handleSelectedAvatar} />)}
                  </div>
                  <button type="button" className={cn(styles.carrouselArrowUserForm, styles.carrouselArrowNextUserForm)} onClick={()=>handleMoveAvatars(92)}>
                      <FontAwesomeIcon icon={faChevronRight} />
                  </button>
                </div>
                <div className={styles.inputUserForm}>
                  <label htmlFor="username"></label>
                  <input type="text" id="username" name="username" placeholder="Name" value={usernameChoosing} onChange={handleUsername} autoComplete="off" />
                </div>
                <button className={styles.buttonUserForm} onClick={handleSubmitUsername} type="button">OK</button>
                {errorUsername && <p className={styles.errorUsername}>{errorUsername}</p>}
              </div>
            :
              <Invitation />
            }
            <div className={username=="" ? cn(styles.disabledContainer,styles.container) : styles.container}>
                <div className={styles.usersOnline}>
                {onlineUsers.map((user, index)=>{
                    return <div key={index} className={styles.containerAvatar}>
                        <div className={styles.avatarCrown}>
                        {winner && user.username === winner.username &&
                            <FontAwesomeIcon icon={faCrown} className={styles.crown} />
                        }
                        <img src={user.image} alt="avatar" className={styles.avatar}></img>
                        </div>
                        {startGame ? 
                        hearts.some(e => e.username === user.username) && 
                        <div className={styles.containerHearts}>
                            {(hearts.find(e => e.username === user.username).hearts > 0) && [...Array(hearts.find(e => e.username === user.username).hearts)].map((e, index)=>{
                            return <FontAwesomeIcon key={index} icon={faHeart} className={styles.hearts} />
                            })}
                        </div>
                        :
                        resultsGame.some(e => e.username === user.username) &&
                        <div className={styles.containerHearts}>
                            <p>{resultsGame.find(e => e.username === user.username).gamesWon}</p>
                            <FontAwesomeIcon icon={faTrophy} className={styles.points} />
                        </div>
                        }
                    </div>
                    })
                }
                </div>
                <div className={styles.containerGame}>
                  <div className={styles.containerElement}>
                      {startGame ?
                      <Game username={username} category={selectedCategoryByAllUsers} categoryText={selectedCategoryTextByAllUsers} postData={postData} questions={questionsGame} numQuestions={numQuestions} onBackToMenu={handleBackToMenu} onHearts={handleHearts} hearts={hearts} /> 
                      :
                      <OptionsGame selectedCategories={selectedCategories} onSelectedCategory={handleSelectedCategory} selectedCategoryByUser={selectedCategoryText} onlineUsersCount={onlineUsersCount} timer={timer} onStartGame={handleStartGame} />
                      }
                  </div>
                  <div className={styles.containerElement}>
                      <div className={styles.chat}>
                          <div className={styles.advice}>
                            <p>I recommend you to not share personal data.</p>
                          </div>
                          <div className={styles.messages} ref={refMessages}>
                            {chats.map((chat, index) => {
                            return <ChatList key={index} chat={chat} currentUser={username} />
                            })}
                          </div>
                          <div>
                              <SendMessage
                              message={messageToSend}
                              handleMessageChange={(e) => setMessageToSend(e.target.value)}
                              handleSubmit={(e) => handleChatSubmit(e)}
                              />
                          </div>
                      </div>
                  </div>
                </div>
            </div>
        </div>
        <DescriptionProject title={"Time quizz"} description={descriptionProject} accordionInfo={accordionInfo} />
    </div>
}