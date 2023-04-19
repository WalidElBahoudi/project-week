const loginForm = document.querySelector('#login-form');
const usernameInput = document.querySelector('#username');

loginForm.addEventListener('submit', (event) => {
	event.preventDefault();

	const username = usernameInput.value.trim();

	if (username) {
		// Store username in local storage
		localStorage.setItem('username', username);

		// Redirect to game page
		window.location.href = 'index.html';
	}
});

function createStars() {
	for (let i = 0; i < 100; i++) {
	  const star = document.createElement('div');
	  star.classList.add('star');
	  star.style.top = Math.random() * 100 + 'vh';
	  star.style.left = Math.random() * 100 + 'vw';
	  star.style.animationDelay = Math.random() * 1.5 + 's';
	  document.body.appendChild(star);
	}
  }
  
  createStars();
  