const X_CLASS = 'x';
const CIRCLE_CLASS = 'circle';
const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const cellElements = document.querySelectorAll('[data-cell]');
const board = document.querySelector('.board');
const winningMessageElement = document.getElementById('winningMessage');
const winningMessageTextElement = document.getElementById('winningMessageText');
const restartButton = document.getElementById('restartButton');
const applauseSound = new Audio('applause.mp3');  // Ajoutez le fichier son ici
let circleTurn;

startGame();

restartButton.addEventListener('click', startGame);

function startGame() {
    circleTurn = false;
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(CIRCLE_CLASS);
        cell.classList.remove('winning');  // Retirer l'animation des cellules gagnantes
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
    setBoardHoverClass();
    winningMessageElement.classList.remove('show');
    clearEffects();  // Effacez les effets visuels précédents
}

function handleClick(e) {
    const cell = e.target;
    const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
    placeMark(cell, currentClass);
    if (checkWin(currentClass)) {
        endGame(false);
        playWinningAnimation();  // Lancer l'animation
        applauseSound.play();  // Jouer le son d'applaudissement
        showBalloonEffect();  // Affiche les ballons
        showBoomEffect();  // Affiche l'effet "boom"
        showConfettiEffect();  // Affiche les confettis
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        setBoardHoverClass();
    }
}

function endGame(draw) {
    if (draw) {
        winningMessageTextElement.innerText = 'Égalité!';
    } else {
        winningMessageTextElement.innerText = `${circleTurn ? "O" : "X"} Gagne!`;
    }
    winningMessageElement.classList.add('show');
}

function isDraw() {
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS);
    });
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
}

function swapTurns() {
    circleTurn = !circleTurn;
}

function setBoardHoverClass() {
    board.classList.remove(X_CLASS);
    board.classList.remove(CIRCLE_CLASS);
    if (circleTurn) {
        board.classList.add(CIRCLE_CLASS);
    } else {
        board.classList.add(X_CLASS);
    }
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass);
        });
    });
}

function playWinningAnimation() {
    const winningCombination = WINNING_COMBINATIONS.find(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(circleTurn ? CIRCLE_CLASS : X_CLASS);
        });
    });

    if (winningCombination) {
        winningCombination.forEach(index => {
            cellElements[index].classList.add('winning');
        });
    }
}

/* Nouvelle fonction pour afficher les ballons */
function showBalloonEffect() {
    for (let i = 0; i < 10; i++) {
        const balloon = document.createElement('div');
        balloon.classList.add('balloon');
        balloon.style.left = `${Math.random() * 100}vw`;
        balloon.style.transform = `scale(${Math.random() + 0.5})`;
        document.body.append(balloon);
        setTimeout(() => balloon.remove(), 5000);  // Retirer les ballons après 5s
    }
}

/* Nouvelle fonction pour afficher l'effet boom */
function showBoomEffect() {
    const boom = document.createElement('div');
    boom.classList.add('boom');
    boom.style.left = `${Math.random() * 100}vw`;
    boom.style.top = `${Math.random() * 100}vh`;
    document.body.append(boom);
    setTimeout(() => boom.remove(), 1000);  // Retirer l'effet "boom" après 1s
}

/* Nouvelle fonction pour afficher les confettis */
function showConfettiEffect() {
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.animationDelay = `${Math.random() * 2}s`;
        confetti.style.backgroundColor = getRandomColor();
        document.body.append(confetti);
        setTimeout(() => confetti.remove(), 3000);  // Retirer les confettis après 3s
    }
}

/* Efface les effets visuels précédents */
function clearEffects() {
    document.querySelectorAll('.balloon').forEach(balloon => balloon.remove());
    document.querySelectorAll('.boom').forEach(boom => boom.remove());
    document.querySelectorAll('.confetti').forEach(confetti => confetti.remove());
}

/* Fonction pour obtenir une couleur aléatoire */
function getRandomColor() {
    const colors = ['#ffeb3b', '#ff1744', '#2979ff', '#00e676', '#fdd835', '#3f51b5'];
    return colors[Math.floor(Math.random() * colors.length)];
}
