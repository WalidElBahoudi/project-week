const letters = [
	['A', 'B', 'C', 'D'],
	['E', 'F', 'G', 'H'],
	['I', 'J', 'K', 'L'],
	['M', 'N', 'O', 'P']
];

let selectedLetters = [];
let wordsFound = [];
const wordInput = document.querySelector('#word-input');
const wordList = document.querySelector('#word-list');

function generateBoard() {
	const gameGrid = document.querySelector('#game-grid');
  
	for (let i = 0; i < letters.length; i++) {
	  for (let j = 0; j < letters[i].length; j++) {
		const cellButton = document.createElement('button');
		cellButton.className = 'grid-cell';
		cellButton.id = `cell-${i * letters.length + j + 1}`;
		cellButton.textContent = letters[i][j];
		cellButton.addEventListener('click', selectLetter);
		gameGrid.appendChild(cellButton);
	  }
	}
  }
  

function selectLetter(event) {
	const cell = event.target;
	wordInput.value += cell.textContent;
}

function submitWord() {
	const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${wordInput.value}`;
	message.textContent = '';
	if (wordInput.value.length < 3){
		message.textContent = 'Word must have at least 3 characters!';
		return;
	}
	fetch(apiUrl)
		.then(response => response.json())
		.then(data => {
			// do something with the definition data
			console.log(data);
			if (data.title == "No Definitions Found") {
				const message = document.querySelector('#message');
				message.textContent = 'Word not found!';
			} else {

				if (wordsFound.includes(wordInput.value)) {
					message.textContent = 'Word already found!';
				} else {
					wordsFound.push(wordInput.value);
					wordList.textContent = `Words Found: ${wordsFound.join(', ')}`;
					wordInput.value = '';
				}
			}
		})
		.catch(error => console.log(error));
}

function checkWord(word) {
	if (word.includes(word)) {
		return true;
	} else {
		return false;
	}
}

generateBoard();

const startButton = document.querySelector('#start-button');
startButton.addEventListener('click', () => {
	const vowels = ['A', 'E', 'I', 'O', 'U'];
	const consonants = ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'];
	const gameBoard = document.querySelectorAll('#game-board td');

	// Reset board
	gameBoard.forEach((cell) => {
		const isVowel = Math.random() < 0.5;
		const randomLetter = isVowel ? vowels[Math.floor(Math.random() * vowels.length)] : consonants[Math.floor(Math.random() * consonants.length)];
		cell.textContent = randomLetter;
	});

	// Start countdown
	let timeLeft = 180;
	const countdown = setInterval(() => {
		timeLeft--;
		timer.textContent = `Time Remaining: ${timeLeft} s`;

		if (timeLeft <= 0) {
			clearInterval(countdown);
			timer.textContent = 'Time is up!';
			startButton.disabled = false;
			submitButton.disabled = true;
			leaderboardpopup.style.display = "block";
		}
	}
		, 1000);

	// Disable start button
	startButton.disabled = true;
});

const resetButton = document.getElementById('reset-button');
resetButton.addEventListener('click', resetGame);

function resetGame() {
	location.reload();
}

const submitButton = document.querySelector('#submit-button');
submitButton.addEventListener('click', submitWord);

// POPUP REGELS

const rulesBtn = document.getElementById("rules-btn");
const closeRulesBtn = document.getElementById("close-rules-btn");
const rulesPopup = document.getElementById("rules-popup");

const leaderBtn = document.getElementById("leader-btn");
const closeLeaderBtn = document.getElementById("close-leader-btn");
const leaderPopup = document.getElementById("leaderboard-popup");

rulesBtn.addEventListener("click", function () {
	rulesPopup.style.display = "block";
});

closeRulesBtn.addEventListener("click", function () {
	rulesPopup.style.display = "none";
});

// POPUP RANKING

const rankingBtn = document.getElementById("ranking-btn");
const closeleaderBtn = document.getElementById("close-leader-btn");
const leaderboardpopup = document.getElementById("leaderboard-popup");



closeleaderBtn.addEventListener("click", function () {
	leaderboardpopup.style.display = "none";
});

// ENTER

wordInput.addEventListener('keydown', (event) => {
	if (event.key == 'Enter') {
		event.preventDefault();
		submitButton.click();
	}
});