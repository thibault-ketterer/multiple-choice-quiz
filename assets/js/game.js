const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull");
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let questionSkipped = 0;
let availableQuesions = [];
let userAnswers = [];

// Import the functions you need from the SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, get, ref, set, update, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { firebaseConfig } from './firebase_12321312.js';


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

const username = getQueryParam('username');


// Function to read data from Firebase
async function hasAlreadyPlayed() {
    const dataRef = ref(database, 'quizz_user_x/');
    get(dataRef).then((snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            console.log("Data retrieved:", data);
            // Additional logic based on the retrieved data
            if (data.already_played) {
                decrementScore(100 * INCORRECT_TAX);
                alert("You have already played. You got malus.");
            } else {
                // Handle the case where 'already_played' is false or undefined
                console.log("User hasn't played yet.");
            }
        } else {
            console.log("FIRST PLAY OK");
        }
    }).catch((error) => {
        console.error('Failed to read data:', error);
        // Handle any errors that occur
    });
}



document.addEventListener('DOMContentLoaded', () => {
    const usernameElement = document.getElementById('username');
    const username = getQueryParam('username');

    if (username) {
        usernameElement.textContent = username;
    } else {
        usernameElement.textContent = 'Username not provided';
    }
    document.getElementById("skipBtn").addEventListener('click', (e) => {
        e.preventDefault();
        getNewQuestion();
    });

    hasAlreadyPlayed();
});


// Function to write data to Firebase
async function writeData(score, questionCounter) {
    const dataRef = ref(database, 'quizz_user_x/');
    // + Date.now());
    set(dataRef, {
        score: score,
        question_answered: questionCounter - 1,
        question_skipped: questionSkipped,
        username: username,
        already_played: true,
        answers: userAnswers
    }).then(() => {
        // readData(); // Read data after writing
    }).catch((error) => {
        console.log("score write error");
        // alert('Failed to write data: ' + error.message);
    });
}

// Fetch quiz questions from a JSON file
async function fetchQuestions() {
    const response = await fetch('../js/quizz_questions.json');
    const questions = await response.json();
    return questions;
}


//CONSTANTS
// see config.js
import * as Constants from "./config.js";
// const INCORRECT_TAX = 20;
// const MAX_QUESTIONS = 5;
// const SECONDS = 100;
// const RANDOM = false;
const INCORRECT_TAX = Constants.INCORRECT_TAX;
const MAX_QUESTIONS = Constants.MAX_QUESTIONS;
const SECONDS = Constants.SECONDS;
const RANDOM = Constants.RANDOM;

document.addEventListener('click', function(event) {
    // Your function logic here
    // console.log('Element clicked:', event.target);
    writeData(score, questionCounter);
    // The click event continues to behave normally
});

// Start Game & Timer
const startGame = (questions, username) => {
    questionCounter = 0;
    score = SECONDS;
    availableQuesions = [...questions];
    console.log("loaded ", availableQuesions.length, "questions");
    getNewQuestion();

    // Timer
    setInterval(function () {
        score--;
        scoreText.innerText = score;
        // console.log("store in fbase", score);
        writeData(score, questionCounter);
       

        if (score <= 0) {
            localStorage.setItem("mostRecentScore", score);

            //go to the end page
            return window.location.assign("../../assets/html/end.html?username=" + username);
        }
    }, 1000);
};

// Display Next Random Question and Answers
const getNewQuestion = (answered=false) => {
    if (availableQuesions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem("mostRecentScore", score);

        //go to the end page
        return window.location.assign("../../assets/html/end.html?username=" + username);
    }
    if (answered){
        questionCounter++;
    }else{
        questionSkipped++;
    }
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;

    //Update the progress bar
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    let questionIndex = 0;
    if (RANDOM){
        questionIndex = Math.floor(Math.random() * availableQuesions.length);
    }
    currentQuestion = availableQuesions[questionIndex];
    question.innerHTML = currentQuestion.questionText;

    // Get Answers
    choices.forEach((choice, index) => {
        // Assuming the dataset "number" is 1, 2, 3, 4
        const number = parseInt(choice.dataset["number"]);
        choice.innerText = currentQuestion.options[number - 1]; // Adjust index (0-3)
    });

    availableQuesions.splice(questionIndex, 1);
    acceptingAnswers = true;
};

//Get User's Choice
choices.forEach(choice => {
    choice.addEventListener("click", e => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.innerText;
        //selectedChoice.dataset["number"];
        console.log("ans", selectedAnswer);
        console.log("choice",selectedChoice );
        console.log("choice", parseInt(selectedChoice.dataset["number"]));
        console.log("choice", selectedChoice.innerText);
        console.log("right ans is", currentQuestion.answer);
        console.log("cur Q", currentQuestion);

        const questionInfo = {
            question: currentQuestion.questionText,
            selectedAnswer: selectedAnswer,
            isCorrect: selectedAnswer === currentQuestion.answer
        };

        userAnswers.push(questionInfo);

        const classToApply =
            selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

        if (classToApply === "incorrect") {
            decrementScore(INCORRECT_TAX);
            console.log("FALSE");
        }

        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion(true);
        }, 1000);
    });
});

//Penalty for wrong choice
const decrementScore = num => {
    console.log("apply negative point ");
    scoreText.innerText = score + " - " + num;
    score -= num;
};


fetchQuestions().then(questions => {
    // Use the fetched questions for your quiz
    // ...
    // At the end of the quiz
    startGame(questions, username);

    // const result = { /* your quiz result object */ };
    // storeQuizResult(result);
});


