document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const scoreDisplay = document.getElementById('score');
    const startButton = document.getElementById('start-button');
    const shareButton = document.getElementById('share-button');
    const leaderboardDisplay = document.getElementById('leaderboard');

    const cardsArray = [
        { name: 'heart', icon: '💵' },
        { name: 'gift', icon: '😈' },
        { name: 'rose', icon: '🎲' },
        { name: 'kiss', icon: '🀄' },
        { name: 'balloon', icon: '🧬' },
        { name: 'teddy', icon: '☎️' },
        { name: 'ring', icon: '☢️' },
        { name: 'chocolate', icon: '💭' }
    ];

    let cardsChosen = [];
    let cardsChosenId = [];
    let cardsWon = [];
    let score = 0;

    function createBoard() {
        gameBoard.innerHTML = '';
        const cardIcons = [...cardsArray, ...cardsArray];
        
        // Shuffle the cards array to randomize the positions
        shuffleArray(cardIcons);
        
        cardIcons.forEach((card, index) => {
            let cardElement = document.createElement('div');
            cardElement.setAttribute('data-id', index);
            cardElement.classList.add('card');
            cardElement.addEventListener('click', flipCard);
            gameBoard.appendChild(cardElement);
        });
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function flipCard() {
        let cardId = this.getAttribute('data-id');
        if (!cardsChosenId.includes(cardId)) {
            cardsChosen.push(cardsArray[cardId % cardsArray.length].name);
            cardsChosenId.push(cardId);
            this.textContent = cardsArray[cardId % cardsArray.length].icon;
            this.classList.add('flipped');

            if (cardsChosen.length === 2) {
                setTimeout(checkForMatch, 500);
            }
        }
    }

    function checkForMatch() {
        let cards = document.querySelectorAll('.card');
        const [optionOneId, optionTwoId] = cardsChosenId;

        if (cardsChosen[0] === cardsChosen[1] && optionOneId !== optionTwoId) {
            cardsWon.push(cardsChosen);
            score += 10;
            cards[optionOneId].removeEventListener('click', flipCard);
            cards[optionTwoId].removeEventListener('click', flipCard);
        } else {
            cards[optionOneId].textContent = '';
            cards[optionTwoId].textContent = '';
            cards[optionOneId].classList.remove('flipped');
            cards[optionTwoId].classList.remove('flipped');
        }

        cardsChosen = [];
        cardsChosenId = [];
        scoreDisplay.textContent = `Score: ${score}`;

        if (cardsWon.length === cardsArray.length) {
            alert('Congratulations! You found them all!');
            updateLeaderboard(score);
            displayLeaderboard();
        }
    }

    function startGame() {
        score = 0;
        cardsWon = [];
        scoreDisplay.textContent = `Score: ${score}`;
        createBoard();
        displayLeaderboard();
    }

    function shareScore() {
        const shareData = {
            title: 'Match the Hearts',
            text: `I scored ${score} points in Match the Hearts! Can you beat my score?`,
            url: window.location.href
        };

        navigator.share(shareData).then(() => {
            console.log('Score shared successfully');
        }).catch(console.error);
    }

    function updateLeaderboard(score) {
        // Store only the latest score in localStorage
        localStorage.setItem('latestScore', JSON.stringify(score));
    }

    function displayLeaderboard() {
        let latestScore = JSON.parse(localStorage.getItem('latestScore')) || 'No score yet';
        leaderboardDisplay.innerHTML = '<h2>Latest Score</h2>';
        leaderboardDisplay.innerHTML += `<p>${latestScore}</p>`;
    }

    startButton.addEventListener('click', startGame);
    shareButton.addEventListener('click', shareScore);
});
