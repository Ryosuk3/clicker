document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("startButton");
    const timerDisplay = document.getElementById("timer");
    const scoreDisplay = document.getElementById("score");
    const gameArea = document.getElementById("gameArea");
    const highScoresList = document.getElementById("highScores");
    const resultMessage = document.getElementById("resultMessage"); 

    let score = 0;
    let timeLeft = 30;
    let gameInterval;
    let spawnInterval;
    let targets = []; 

    const imagesRound = [
        'images/1.jpg',
        'images/2.jpg',
        'images/3.jpg',
        'images/4.jpg',
        'images/5.jpg',
        'images/6.jpg'
    ];

    let gameOver = false;

    function startGame() {
        gameOver = false; 
        score = 0;
        timeLeft = 30;
        scoreDisplay.textContent = score;
        timerDisplay.textContent = timeLeft;
        startButton.disabled = true;

        targets.forEach(target => target.remove());
        targets = [];

        gameInterval = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = timeLeft;

            if (timeLeft <= 0) {
                endGame();
            }
        }, 1000);

        spawnInterval = setInterval(spawnTarget, 750);
    }

    function spawnTarget() {
        const targetElement = document.createElement("img");
        targetElement.classList.add("target");

        const randomImage = imagesRound[Math.floor(Math.random() * imagesRound.length)];
        targetElement.src = randomImage;

        let maxX = gameArea.clientWidth - 30;
        let maxY = gameArea.clientHeight - 30;

        let x = Math.random() * maxX;
        let y = Math.random() * maxY;

        targetElement.style.left = `${x}px`;
        targetElement.style.top = `${y}px`;

        targetElement.addEventListener("click", () => {
            score++;
            scoreDisplay.textContent = score;
            targetElement.remove();  
        });

        gameArea.appendChild(targetElement);
        targets.push(targetElement);

        animateTarget(targetElement);
    }

    function animateTarget(target) {
        let yPos = parseFloat(target.style.top); 

        function moveTarget() {
            yPos += 0.2;

            if (yPos > gameArea.clientHeight - 30) {
                yPos = 0;
            }

            target.style.top = `${yPos}px`;

            requestAnimationFrame(moveTarget);
        }

        moveTarget();
    }

    function endGame() {
        clearInterval(gameInterval);
        clearInterval(spawnInterval); 
        startButton.disabled = false;
        saveScore(score);
        updateHighScores();

        targets.forEach(target => target.remove());
        targets = [];

        gameOver = true; 
    }

    function saveScore(newScore) {
        let highScores = JSON.parse(localStorage.getItem("highScores")) || [];
        highScores.push(newScore);
        highScores.sort((a, b) => b - a);
        highScores = highScores.slice(0, 5);
        localStorage.setItem("highScores", JSON.stringify(highScores));
    }

    function updateHighScores() {
        let highScores = JSON.parse(localStorage.getItem("highScores")) || [];
        highScoresList.innerHTML = "";
        highScores.forEach(score => {
            let li = document.createElement("li");
            li.textContent = score;
            highScoresList.appendChild(li);
        });

        if (gameOver) {
            if (highScores[0] === score) {
                displayResultImage('record.jpg');
            } else if (score < 10) {
                displayResultImage('lose.jpg');
            } else if (highScores.indexOf(score) < 5) {
                displayResultImage('top.jpg');
            }
        }
    }

    function displayResultImage(imageName) {
        const resultImage = document.createElement("img");
        resultImage.src = `images/${imageName}`;
        resultImage.classList.add("result-image");

        resultMessage.appendChild(resultImage);

        setTimeout(() => {
            resultImage.remove();
        }, 5000);
    }

    startButton.addEventListener("click", startGame);
});
