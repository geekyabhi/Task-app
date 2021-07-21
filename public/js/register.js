const form = document.querySelector("form");
const emailError = document.querySelector(".emailerror");
const passwordError = document.querySelector(".passworderror");
emailError.textContent = "";
passwordError.textContent = "";
form.addEventListener("submit", async (e) => {
	e.preventDefault();
	const name = form.name.value;
	const age = form.age.value;
	const email = form.email.value;
	const password = form.password.value;
	console.log(name, age, email, password);
	try {
		const res = await fetch("/users", {
			method: "POST",
			body: JSON.stringify({ name, age, email, password }),
			headers: { "Content-type": "application/json" },
		});
		const data = await res.json();
		console.log(data);
		{
			{
				!window.location.replace("/");
			}
		}
		if (data.error) {
			if (data.error.email === "this email is already registered") {
				emailError.textContent = "Already Registered";
			}
		} else {
			window.location.replace("/");
		}
	} catch (e) {
		console.log(e);
	}
});
form.addEventListener("click", errormsz);
function errormsz(e) {
	if (e.target.classList.contains("dsc")) {
		if (emailError.textContent === "Already Registered")
			emailError.textContent = "";
	}
}
