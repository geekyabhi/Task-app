const form = document.querySelector("form");
form.addEventListener("submit", async (e) => {
	e.preventDefault();
	const description = form.description.value;
	const completed = form.completed.value;
	try {
		const res = await fetch("/addtask", {
			method: "POST",
			body: JSON.stringify({ description, completed }),
			headers: { "Content-type": "application/json" },
		});
		const data = await res.json();
		console.log(data);
		window.location.replace("/tasks");
	} catch (e) {
		console.log(e);
	}
});
