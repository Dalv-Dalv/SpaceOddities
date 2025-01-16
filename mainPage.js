window.addEventListener("load", main);
function main() {
    initializeQuizzes();

    let canvases = document.querySelectorAll(".glslCanvas");
    for (let i = 0; i < canvases.length; i++) {
        let canvas = canvases[i];
        canvas.width = window.innerWidth * 1.5;
        canvas.height = window.innerHeight * 1.5;
    }
}

function updatequizPercentageStyle(element, value) {
    value = Math.round(value);
    element.style.setProperty("--percentage", value + "%");
    element.innerHTML = value + "%";
}

function initializeQuizzes() {
    const quizzes = ["universe", "universe", "galaxy", "stars", "planets", "exploration"];

    quizzes.forEach(quiz => {
        const key = "quizPercentage_" + quiz;
        var percentage = document.getElementById(key);

        if (percentage == null) {
            return;
        }

        let value;

        if (localStorage.getItem(key) != null) {
            value = localStorage.getItem(key);
            value = Math.round(value);
        } else {
            localStorage.setItem(key, 0);
            value = 0;
        }
        updatequizPercentageStyle(percentage, value);
    });
}