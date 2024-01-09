
import { SECONDS, MAX_QUESTIONS, INCORRECT_TAX } from "./assets/js/config.js";

document.addEventListener('DOMContentLoaded', () => {

    document.getElementById('timeLimit').innerHTML = SECONDS;
    document.getElementById('maxQuestions').innerHTML = MAX_QUESTIONS;
    document.getElementById('incorrectPenalty').innerHTML = INCORRECT_TAX;
    const usernameInput = document.getElementById('username');
    const playButton = document.getElementById('playButton');

    usernameInput.addEventListener('input', () => {
        const username = usernameInput.value;
        playButton.href = 'assets/html/game.html' + (username ? `?username=${encodeURIComponent(username)}` : '');
    });
});
