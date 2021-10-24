const addToCardLinks = document.querySelectorAll('.add-to-cart-link');
addToCardLinks.forEach((addToCardLink) => {
	addToCardLink.addEventListener('click', async (e) => {
		if (document.querySelector('.msg').getAttribute('data-msg').length > 0) {
			alert(document.querySelector('.msg').getAttribute('data-msg'));
			return;
		}
		e.preventDefault();
		try {
			const res = await fetch('/cartUpdate', {
				method: 'POST',
				body: JSON.stringify({
					id: e.target.id,
					uid: e.target.getAttribute('data-uid')
				}),
				headers: {
					'Content-Type': 'application/json'
				}
			});
			const data = await res.json();
			window.location.reload();
		} catch (e) {
			console.log({ e });
		}
	});
});
