const form = document.querySelector("form");
const cantloginerror = document.querySelector(".cantloginerror");

form.addEventListener("submit", async (e) => {
	e.preventDefault();
	const email = form.email.value;
	const password = form.password.value;
	console.log(email, password);
	try {
		const res = await fetch("/users/login", {
			method: "POST",
			body: JSON.stringify({ email, password }),
			headers: { "Content-type": "application/json" },
		});
		const data = await res.json();
		console.log(data);
		if (data.errors) {
			console.log(data.errors);
			cantloginerror.textContent = "Wrong id or password";
			form.email.value = "";
			form.password.value = "";
		} else {
			window.location.replace("/");
		}
	} catch (e) {
		console.log(e);
	}
});

form.addEventListener("click", errormsz);

function errormsz(e) {
	if (e.target.classList.contains("dsc")) cantloginerror.textContent = "";
}
