const _question = document.getElementById('question');
const _options = document.querySelector('.quiz-options');
const _correctScore = document.getElementById('correct-score');
const _totalQuestion = document.getElementById('total-question');
const _checkBtn = document.getElementById('check-answer');
const _playAgainBtn = document.getElementById('play-again');
const _result = document.getElementById('result');

let correctAnswer = "", correctScore = 0, askedCount = 0, totalQuestion = 10;

// Event listeners
function eventListeners() {
    _checkBtn.addEventListener('click', checkAnswer);
    _playAgainBtn.addEventListener('click', restartQuiz); // Fixed typo
}

document.addEventListener('DOMContentLoaded', () => {
    loadQuestion();
    eventListeners();
    _totalQuestion.textContent = totalQuestion;
    _correctScore.textContent = correctScore;
});

async function loadQuestion() {
    const APIUrl = 'https://opentdb.com/api.php?amount=10&category=17&type=multiple';
    const result = await fetch(`${APIUrl}`);
    const data = await result.json();
    // console.log(data);
    _result.innerHTML = "";
    showQuestion(data.results[0]);
}

// Displaying questions and options
function showQuestion(data) {
    _checkBtn.disabled = false;
    correctAnswer = data.correct_answer;
    let incorrectAnswers = data.incorrect_answers;
    let optionsList = [...incorrectAnswers]; // Copy incorrect answers to optionsList

    // Inserting correct answer randomly
    optionsList.splice(Math.floor(Math.random() * (incorrectAnswers.length + 1)), 0, correctAnswer);

    _question.innerHTML = `${data.question} <br> <span class="category">${data.category}</span>`;
    _options.innerHTML = `${optionsList.map((option, index) => `<li> ${index + 1}. <span> ${option} </span> </li>`).join('')}`;

    selectOption();
}

// Function for selecting option
function selectOption() {
    _options.querySelectorAll('li').forEach((option) => {
        option.addEventListener('click', () => {
            if (_options.querySelector('.selected')) {
                const activeOption = _options.querySelector('.selected');
                activeOption.classList.remove('selected');
            }
            option.classList.add('selected');
        });
    });
}

function checkAnswer() {
    _checkBtn.disabled = true;
    if (_options.querySelector('.selected')) {
        let selectedAnswer = _options.querySelector('.selected span').textContent;
        // console.log(selectedAnswer);
        if (selectedAnswer.trim() === HTMLDecode(correctAnswer)) {
            correctScore++;
            _result.innerHTML = `<p> <i class="fas fa-check"></i>Correct Answer!</p>`;
        } else {
            _result.innerHTML = `<p> <i class="fas fa-times"></i>Incorrect Answer! </p> <p><small><b>Correct Answer:</b> ${correctAnswer}</small></p>`;
        }
        checkCount();
    } else {
        _result.innerHTML = `<p><i class="fas fa-question"></i> Please select an option!</p>`;
        _checkBtn.disabled = false;
    }
}

function HTMLDecode(textString) {
    let doc = new DOMParser().parseFromString(textString, "text/html");
    return doc.documentElement.textContent;
}

function checkCount() {
    askedCount++;
    setCount();

    if (askedCount === totalQuestion) {
        _result.innerHTML = `<p>Your score is ${correctScore}.</p>`;
        _playAgainBtn.style.display = "block";
        _checkBtn.style.display = "none";
    } else {
        setTimeout(() => {
            loadQuestion();
        }, 300);
    }
}

function setCount() {
    _totalQuestion.textContent = totalQuestion;
    _correctScore.textContent = correctScore;
}

function restartQuiz() {
    correctScore = askedCount = 0;
    _playAgainBtn.style.display = "none";
    _checkBtn.style.display = "block";
    _checkBtn.disabled = false;
    setCount();
    loadQuestion();
}
