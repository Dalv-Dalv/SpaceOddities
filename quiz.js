const urlParams = new URLSearchParams(window.location.search);
const quizzType = urlParams.get('quiz');
let quizData;
getQuizData();
function getQuizData() {
    const url = "quizzes/" + quizzType + ".json";

    fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            return response.text();
        }).then(function (text) {
            quizData = JSON.parse(text);
            const event = new CustomEvent('quizDataLoaded');
            document.dispatchEvent(event);
        }).catch((error) => {
            alert(error);
        });
}
document.addEventListener('quizDataLoaded', handleQuizzDataReceived);
function handleQuizzDataReceived() {
    shuffle(quizData.questions);

    const quizTitleElement = document.getElementById('quizTitle');
    quizTitleElement.textContent = quizData.title;

    const questionTemplate = document.getElementById("questionTemplate");

    document.getElementById("remainingQuestions").textContent = quizData.questions.length;

    for (let i = 0; i < quizData.questions.length; i++) {
        const clone = questionTemplate.content.cloneNode(true);
        const questionElement = clone.querySelector(".questionTitle");
        questionElement.textContent = quizData.questions[i].question;

        const answerList = clone.querySelectorAll("label");
        const options = quizData.questions[i].options;

        for (let j = 0; j < answerList.length; j++) {
            answerList[j].setAttribute("for", `q${i}a${j}`);
            const inputElement = answerList[j].querySelector("input");
            inputElement.setAttribute("id", `q${i}a${j}`);
            inputElement.setAttribute("name", `q${i}`);

            answerList[j].innerHTML += options[j];
        }
        if (!questionsContainer) questionsContainer = document.getElementById("questionsContainer");
        questionsContainer.appendChild(clone);
    }

    var radioButtons = document.querySelectorAll('input[type="radio"]');

    radioButtons.forEach(function (radioButton) {
        radioButton.addEventListener('keydown', function (event) {
            event.preventDefault();
        });
        radioButton.addEventListener('change', handleButtonPressed);
    });

    questionElements = document.querySelectorAll(".question");

    questionIndicator.nr_remainingQuestions = quizData.questions.length;
}




window.addEventListener("load", main);
let questionsContainer;
let scrollContainer;
function main() {
    questionsContainer = document.getElementById("questionsContainer");

    questionIndicator.initialize();
    requestAnimationFrame(questionIndicator.flash);

    document.getElementById("backButton").href = `index.html#quiz_${quizzType}`;

    scrollContainer = questionsContainer.parentElement;
    document.body.onkeyup = handleKeyEvent;
}

var currentQuestionIndex = 0; // NOT ACCURATE, doesnt account for user scroll
let questionElements;
function handleKeyEvent(event) {
    switch (event.key) {
        case "ArrowRight":
            currentQuestionIndex = (currentQuestionIndex + 1) % quizData.questions.length;
            scrollToQuestion(currentQuestionIndex);
            break;
        case "ArrowLeft":
            currentQuestionIndex = (quizData.questions.length + currentQuestionIndex - 1) % quizData.questions.length;
            scrollToQuestion(currentQuestionIndex);
            break;
        case "p":
            questionIndicator.flashWrong();
            break;
        case "o":
            questionIndicator.flashCorrect();
            break;
    }
}




// Check if it was correct, update the indicators and check if all questions have been answered
function handleButtonPressed(event) {
    var info = event.target.id;
    var i_question = Number(info.substring(1, info.indexOf("a")));
    var i_answer = Number(info.substring(info.indexOf("a") + 1));

    var answerList = event.target.parentElement.parentElement;

    var buttons = answerList.querySelectorAll(`input[name="${event.target.name}"]`);

    const correctAnswer = quizData.questions[i_question].answer;
    var timeUntilNextQuestion = 1000;
    if (i_answer == correctAnswer) {
        answerList.querySelector(`.rb${i_answer}`).classList.add("correct");
        questionIndicator.answeredCorrect();
    } else {
        timeUntilNextQuestion = 2500; // Give the user more time to see what they got wrong

        answerList.querySelector(`.rb${i_answer}`).classList.add("wrong");
        answerList.querySelector(`.rb${correctAnswer}`).classList.add("correct");
        questionIndicator.answeredWrong();
    }

    buttons.forEach((x) => {
        x.disabled = true;
        x.parentElement.setAttribute("disabled", "");

        let i = Number(x.id.substring(x.id.indexOf("a") + 1));

        if(i != correctAnswer && i != i_answer){
            x.parentElement.querySelector(".radioButton").classList.add("inactive");
        }
    });

    // Move to next unanswered question
    currentQuestionIndex = (i_question + 1) % quizData.questions.length;
    var ok = false;
    for(let j = 0; j < quizData.questions.length; j++){
        if(questionElements[j].querySelector("*:disabled") === null){
            ok = true;
        }
    }
    
    if(!ok){ //Answered all questions
        setTimeout(finishQuiz, timeUntilNextQuestion);
        return;
    }

    setTimeout(scrollToQuestion, timeUntilNextQuestion, currentQuestionIndex);
}
function scrollToQuestion(index) {
    questionElements[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
}




function finishQuiz() {
    var score = questionIndicator.nr_correctAnswers / quizData.questions.length * 100;
    score = Math.round(score);
    const scoreElem = document.getElementById("score");
    scoreElem.textContent = `${score}%`;

    var result = "high";
    var message = "Congratulations! You got all of them right!";
    if (score < 100) {
        message = "Congratulations! You did great!";
    }
    if (score < 80) {
        result = "medium";
        message = "Good job! You got most of them right!";
    }
    if (score < 50){
        result = "low";
        message = "You might not have scored high, but now you know more than you did before!";
    }
    scoreElem.setAttribute("result", result);
    document.getElementById("finishMessage").textContent = message;
    document.getElementById("quizFinishedPanel").setAttribute("show", "");

    const storageKey = `quizPercentage_${quizzType}`;
    if(localStorage.getItem(storageKey) != null) {
        var value = localStorage.getItem(storageKey);
        if(score > value){
            localStorage.setItem(storageKey, score);
        }
    }else{
        localStorage.setItem(storageKey, score);
    }
}




// Manages the indicators at the top for correct, wrong and remaining questions
var questionIndicator = {
    el_correctAnswers: undefined,
    el_remainingQuestions: undefined,
    el_wrongAnswers: undefined,
    nr_correctAnswers: 0,
    nr_remainingQuestions: 0,
    nr_wrongAnswers: 0,

    correctCol: undefined,
    wrongCol: undefined,
    panelCol: undefined,

    initialize: function () {
        this.el_correctAnswers = document.getElementById("correctQuestions");
        this.el_remainingQuestions = document.getElementById("remainingQuestions");
        this.el_wrongAnswers = document.getElementById("wrongQuestions");

        var style = window.getComputedStyle(document.body);
        this.correctCol = style.getPropertyValue('--correctCol');
        this.wrongCol = style.getPropertyValue('--wrongCol');
        this.panelCol = setRGBColorAlpha(style.getPropertyValue('--panelCol'), 0.045);

        this.updateIndicators();
    },

    t_correctFlash: 0.0,
    t_wrongFlash: 0.0,
    flashing: false,
    prevFlashTimestamp: undefined,
    answeredCorrect: function() {
        this.nr_correctAnswers++;
        this.nr_remainingQuestions--;
        this.updateIndicators();
        this.flashCorrect();
    },
    answeredWrong: function() {
        this.nr_wrongAnswers++;
        this.nr_remainingQuestions--;
        this.updateIndicators();
        this.flashWrong();
    },
    updateIndicators: function () {
        this.el_correctAnswers.textContent = this.nr_correctAnswers;
        this.el_remainingQuestions.textContent = this.nr_remainingQuestions;
        this.el_wrongAnswers.textContent = this.nr_wrongAnswers;
    },
    flashCorrect: function () {
        this.t_correctFlash = 500.0;
        if (this.flashing) return;
        this.flash();
    },
    flashWrong: function () {
        this.t_wrongFlash = 500.0;
        if (this.flashing) return;
        this.flash();
    },
    flash: function (timestamp) {
        if (questionIndicator.t_correctFlash + questionIndicator.t_wrongFlash < 0.01) {
            questionIndicator.t_correctFlash = 0.0;
            questionIndicator.t_wrongFlash = 0.0;
            questionIndicator.prevFlashTimestamp = undefined;
            questionIndicator.flashing = false;
            return;
        }

        questionIndicator.flashing = true;
        var deltaTime = 0.0;
        if (questionIndicator.prevFlashTimestamp !== undefined) {
            deltaTime = timestamp - questionIndicator.prevFlashTimestamp;
        }

        questionIndicator.t_correctFlash -= deltaTime;
        questionIndicator.t_wrongFlash -= deltaTime;

        if (questionIndicator.t_correctFlash < 0.01) questionIndicator.t_correctFlash = 0.0;
        if (questionIndicator.t_wrongFlash < 0.01) questionIndicator.t_wrongFlash = 0.0;

        questionIndicator.updateFlash();

        questionIndicator.prevFlashTimestamp = timestamp;
        requestAnimationFrame(questionIndicator.flash);
    },
    updateFlash: function () {
        var tc = this.t_correctFlash / 500;
        var tw = this.t_wrongFlash / 500;

        var correctAlpha = lerp(0.28, 1.0, tc);
        var wrongAlpha = lerp(0.28, 1.0, tw);

        var col1 = setRGBColorAlpha(this.correctCol, correctAlpha);
        var col2 = setRGBColorAlpha(this.wrongCol, wrongAlpha);

        var pos1 = lerp(-30, -10, tc);
        var pos2 = lerp(130, 110, tw);

        this.el_remainingQuestions.style.background = `radial-gradient(circle at ${pos1}%, ${col1}, ${this.panelCol} 50%), radial-gradient(circle at ${pos2}%, ${col2}, ${this.panelCol} 50%)`;
        
        correctAlpha = lerp(0.2, 1.0, tc);
        var alphaOuter = lerp(0.35, 0.7, tc);
        
        col1 = setRGBColorAlpha(this.correctCol, correctAlpha.toFixed(2));
        col2 = setRGBColorAlpha(this.correctCol, alphaOuter.toFixed(2));

        this.el_correctAnswers.style.background = `radial-gradient(circle, ${col1}, ${col2})`;

        wrongAlpha = lerp(0.2, 1.0, tw);
        var alphaOuter = lerp(0.35, 0.7, tw);
        
        col1 = setRGBColorAlpha(this.wrongCol, wrongAlpha.toFixed(2));
        col2 = setRGBColorAlpha(this.wrongCol, alphaOuter.toFixed(2));

        this.el_wrongAnswers.style.background = `radial-gradient(circle, ${col1}, ${col2})`;
    }
};




// Utility functions
function lerp(a, b, t) {
    return a + t * (b - a);
}
function setRGBColorAlpha(rgbCol, alpha) {
    rgbCol = rgbCol.substring(rgbCol.indexOf("(") + 1, rgbCol.length - 1);
    var channels = rgbCol.split(",");

    return `rgba(${channels[0]},${channels[1]},${channels[2]},${alpha})`;
}
function shuffle(array) {
    let currentIndex = array.length;
  
    while (currentIndex != 0) {
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  }