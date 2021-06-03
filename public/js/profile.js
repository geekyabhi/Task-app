var delAcc = document.querySelector(".delete-account");
fetch("/users/me", {
	headers: { "Content-Type": "application/json", Accept: "application/json" },
}).then((response) => {
	response.json().then((data) => {
		var profile = document.querySelector(".details");
		var name = document.createElement("h2");
		name.textContent = "Name : " + data.name;
		var age = document.createElement("h4");
		age.textContent = "Age : " + data.age;
		var email = document.createElement("h4");
		email.textContent = "Email : " + data.email;
		var createdAt = document.createElement("h4");
		createdAt.textContent = "Created At : " + data.createdAt;
		// profile.appendChild(name);
		profile.appendChild(age);
		profile.appendChild(email);
		profile.appendChild(createdAt);
	});
});
