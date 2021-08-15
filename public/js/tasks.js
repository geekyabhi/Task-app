const taskList = document.querySelector(".task-list");
const noTaskMessage = document.querySelector(".no-task-message");
noTaskMessage.style.display = "none";
fetch("/task", {
	headers: { "Content-Type": "application/json", Accept: "application/json" },
})
	.then((response) => {
		response.json().then((data) => {
			{
				console.log(data);
			}
			if (data.length === 0) {
				noTaskMessage.style.display = "block";
			} else {
				noTaskMessage.style.display = "none";
				console.log(data);
				taskList.innerHTML = "";
				var i = 1;
				data.forEach((task) => {
					var newListItem = document.createElement("li");
					newListItem.className = "list-item";
					var newDiv = document.createElement("div");
					newDiv.className = "task-card";
					var taskNo = document.createElement("h3");
					taskNo.textContent = "Task : " + i;
					var description = document.createElement("p");
					description.textContent =
						"Description : " + task.description;
					console.log(task.completed);
					var completed = document.createElement("p");
					completed.textContent = "Completed : " + task.completed;
					var timeOfCreation = document.createElement("p");
					timeOfCreation.textContent =
						"Creation Time: " + task.timeOfCreation;
					var dateOfCreation = document.createElement("p");
					dateOfCreation.textContent =
						"Creation Date: " + task.dateOfCreation;
					var deleteButton = document.createElement("div");
					deleteButton.id = task._id;
					deleteButton.classList.add("del-Btn");
					deleteButton.textContent = "X";
					newDiv.appendChild(taskNo);
					newDiv.appendChild(description);
					newDiv.appendChild(completed);
					newDiv.appendChild(timeOfCreation);
					newDiv.appendChild(dateOfCreation);
					newDiv.appendChild(deleteButton);
					newListItem.appendChild(newDiv);
					taskList.appendChild(newListItem);
					i++;
				});
			}
		});
	})
	.then((response) => {
		taskList.addEventListener("click", remove);
	});

function remove(e) {
	if (e.target.classList.contains("del-Btn")) {
		var id = e.target.id;
		var route = "/deletetask/" + id;
		console.log(route);
		fetch(route, { method: "DELETE" })
			.then((res) => {
				res.text();
			})
			.then((res) => {
				window.location.replace("/tasks");
			});
	}
}
