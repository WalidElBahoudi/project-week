/*const letters = [
	['A', 'B', 'C', 'D'],
	['E', 'F', 'G', 'H'],
	['I', 'J', 'K', 'L'],
	['M', 'N', 'O', 'P']
];*/

//const board = generateBoard(4);

const startButton = document.querySelector('#start-button');
const resetButton = document.querySelector('#reset-button');
const submitButton = document.querySelector('#submit-button');

const rulesBtn = document.querySelector("#rules-btn");
const closeRulesBtn = document.querySelector("#close-rules-btn");
const rulesPopup = document.querySelector("#rules-popup");

const closeLeaderBtn = document.querySelector("#close-leader-btn");
const leaderPopup = document.querySelector("#leaderboard-popup");
const ulLeaderboard = document.querySelector("#ulLeaderboard");					// ul for top players list

const wordList = document.querySelector('#word-list');
const wordInput = document.querySelector('#word-input');

let selectedLetters = [];
let wordsFound = [];
let totalScore = 0; // initialize the total score variable
let gridEnabled = false; // disable grid initially
let board = document.querySelector("#board");


function generateBoard() {
	let size = 4; // set the size of the board
	let vowels = "AEIOU"; // possible vowels
	let consonants = "BCDFGHJKLMNPQRSTVWXYZ"; // possible consonants
	let boardHTML = "";
	let numVowels = Math.ceil(size * size * 0.5); // set the number of vowels to 50% of the total number of letters

	for (let i = 0; i < size; i++) {
		boardHTML += "<tr>";
		for (let j = 0; j < size; j++) {
			let randomLetter;
			if (numVowels > 0) {
				randomLetter = vowels.charAt(Math.floor(Math.random() * vowels.length));
				numVowels--;
			} else {
				randomLetter = consonants.charAt(Math.floor(Math.random() * consonants.length));
			}
			let cellId = `cell-${i}-${j}`; // generate unique identifier for cell
			boardHTML += `<td id="${cellId}">${randomLetter}</td>`; // set id attribute of cell
		}
		boardHTML += "</tr>";
	}

	board.innerHTML = boardHTML; // add the generated board to the HTML

	// add event listeners to tiles
	let tiles = board.getElementsByTagName("td");
	for (let i = 0; i < tiles.length; i++) {
		if (gridEnabled) {
			tiles[i].addEventListener("click", selectLetter);
		}
	}
}

function selectLetter(event) {
	if (!gridEnabled) {
		return;
	}
	const cell = event.target;
	const letter = cell.innerHTML;

	// If letter is not already selected
	if (selectedLetters.includes(cell)) {
		// Letter already selected, display message
		message.innerHTML = `Letter ${letter} already selected!`;
		console.log(`Letter ${letter} already selected!`);
	} else {
		// Get the last selected cell and its position
		if (selectedLetters.length > 0) {
			const lastSelectedCell = selectedLetters[selectedLetters.length - 1];
			const lastSelectedRow = parseInt(lastSelectedCell.id.split("-")[1]);
			const lastSelectedCol = parseInt(lastSelectedCell.id.split("-")[2]);

			// Get the position of the current cell
			const currentRow = parseInt(cell.id.split("-")[1]);
			const currentCol = parseInt(cell.id.split("-")[2]);

			// check if selected cell is adjacent to last selected cell
			const rowDiff = Math.abs(currentRow - lastSelectedRow);
			const colDiff = Math.abs(currentCol - lastSelectedCol);
			if (rowDiff <= 1 && colDiff <= 1 && (rowDiff + colDiff != 0)) {
				// add selected cell to selectedLetters array
				cell.classList.add('selected');
				selectedLetters.push(cell);
				wordInput.value += letter;
			} else {
				// display error message
				message.innerHTML = `Selected cell must be adjacent to last selected cell!`;
			}
		} else {
			// add selected cell to selectedLetters array
			cell.classList.add('selected');
			selectedLetters.push(cell);
			wordInput.value += letter;
		}
	}
}

function ScoreCalc(word) {
	let score = 0;
	if (word.length == 4 || word.length == 3) {
		score++;
	}
	if (word.length == 5) {
		score += 2;
	}
	if (word.length == 6) {
		score += 3;
	}
	if (word.length == 7) {
		score += 5;
	}
	if (word.length == 8) {
		score += 11;
	}
	if (word.length > 8) {
		score += word.length * 2;
	}
	if (word.length < 3) {
		alert("word needs to have a minimum of 3 characters.");
	}
	return score
}

function submitWord() {
	const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${wordInput.value}`;
	message.innerHTML = '';

	if (wordInput.value.length < 3) {
		message.innerHTML = 'Word must have at least 3 characters!';
		selectedLetters.forEach(cell => cell.classList.remove('selected'));
		selectedLetters = [];
		wordInput.value = "";
		return;
	}

	// Check if word contains letters not in the grid
	for (let i = 0; i < wordInput.value.length; i++) {
		const letter = wordInput.value.charAt(i).toUpperCase();
		let isInGrid = false;
		for (let j = 0; j < selectedLetters.length; j++) {
			const cellLetter = selectedLetters[j].innerHTML.toUpperCase();
			if (letter === cellLetter) {
				isInGrid = true;
				break;
			}
		}
		if (!isInGrid) {
			message.innerHTML = `Word contains letter ${letter} not in the grid!`;
			selectedLetters.forEach(cell => cell.classList.remove('selected'));
			selectedLetters = [];
			wordInput.value = "";
			return;
		}
	}

	fetch(apiUrl)
		.then(response => response.json())
		.then(data => {
			if (data.title == "No Definitions Found") {
				const message = document.querySelector('#message');
				message.innerHTML = 'Word not found!';
				selectedLetters.forEach(cell => cell.classList.remove('selected'));
				selectedLetters = [];
				wordInput.value = "";
			} else {
				// Scoring system based on word length
				const word = wordInput.value.toUpperCase();
				const score = ScoreCalc(word);
				if (wordsFound.includes(word)) {
					message.innerHTML = 'Word already found!';
				} else {
					wordsFound.push(word);
					wordList.innerHTML = `Words Found: ${wordsFound.join(', ')}`;
					wordInput.value = '';

					// add the score for the current word to the total score
					totalScore += score;
					console.log(`Score for ${word}: ${score}`);
					console.log(`Total Score: ${totalScore}`);

					// update leaderboard
					const liLeaderboard = document.createElement('li');
					liLeaderboard.innerText = `Total Score: ${totalScore}`;
					ulLeaderboard.appendChild(liLeaderboard);

					// Clear selected letters and input value
					selectedLetters.forEach(cell => cell.classList.remove('selected'));
					selectedLetters = [];
					wordInput.value = "";
				}
			}
		})
		.catch(error => console.log(error));

}

/*function checkWord(word) {
	if (word.includes(word)) {
		return true;
	} else {
		return false;
	}
}*/

generateBoard();

startButton.addEventListener('click', () => {
	gridEnabled = true;
	generateBoard();
	/*
	const vowels = ['A', 'E', 'I', 'O', 'U'];
	const consonants = ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'];
	const gameBoard = document.querySelectorAll('#game-board td');

	// Reset board
	gameBoard.forEach((cell) => {
		const isVowel = Math.random() < 0.5;
		const randomLetter = isVowel ? vowels[Math.floor(Math.random() * vowels.length)] : consonants[Math.floor(Math.random() * consonants.length)];
		cell.innerHTML = randomLetter;
	});*/

	// Start countdown
	let timeLeft = 30;
	const countdown = setInterval(() => {
		timeLeft--;
		timer.innerHTML = `Time Remaining: ${timeLeft} s`;

		if (timeLeft <= 0) {
			clearInterval(countdown);
			timer.innerHTML = 'Time is up!';
			startButton.disabled = false;
			submitButton.disabled = true;

			// popup leaderboard
			leaderPopup.style.display = "block";
		}
	}
		, 1000);

	// Disable start button
	startButton.disabled = true;
});

resetButton.addEventListener('click', resetGame);

function resetGame() {
	location.reload();
	gridEnabled = false;
}

submitButton.addEventListener('click', submitWord);

// POPUP REGELS


rulesBtn.addEventListener("click", function () {
	rulesPopup.style.display = "block";
});

closeRulesBtn.addEventListener("click", function () {
	rulesPopup.style.display = "none";
});

// POPUP LEADERBOARD

closeLeaderBtn.addEventListener("click", function () {
	leaderPopup.style.display = "none";
});

// ENTER

document.addEventListener('keydown', function (e) {
	if (e.key === 'Enter' && e.target === document.body) {
		submitWord();
	}
});
