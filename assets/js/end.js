// const username = document.getElementById("username");
// const saveScoreBtn = document.getElementById("saveScoreBtn");
// const finalScore = document.getElementById("finalScore");
const mostRecentScore = localStorage.getItem("mostRecentScore");

// const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
// 
// const MAX_HIGH_SCORES = 5;

finalScore.innerText = mostRecentScore;

// username.addEventListener("keyup", () => {
//   saveScoreBtn.disabled = !username.value;
// });

// Save High Score to Local Storage
// saveHighScore = e => {
//   e.preventDefault();
// 
//   const score = {
//     score: finalScore.innerText,
//     name: username.value
//   };
//   highScores.push(score);
//   highScores.sort((a, b) => b.score - a.score);
//   highScores.splice(5);
// 
//   localStorage.setItem("highScores", JSON.stringify(highScores));
//   window.location.assign("../html/highscores.html");
// };

document.addEventListener('DOMContentLoaded', () => {
    const usernameElement = document.getElementById('username');
    const username = getQueryParam('username');

    if (username) {
        usernameElement.textContent = username;
    } else {
        usernameElement.textContent = 'Username not provided';
    }
});

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}
