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