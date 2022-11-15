const eventSource = new EventSource("http://localhost:3001/sse");
const messagesDiv = document.getElementById("messages");

eventSource.addEventListener("connect", (e) => {
  data = JSON.parse(e.data);
  data.messages.map((item) => {
    let div = document.createElement("div");
    div.innerHTML = item.content;
    messagesDiv.appendChild(div);
  });
});

eventSource.addEventListener("new-message", (e) => {
  data = JSON.parse(e.data);
  let div = document.createElement("div");
  div.innerHTML = data.message.content;
  messagesDiv.appendChild(div);
});

const form = document.getElementById("messageForm");
const input = document.getElementById("messageInput");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("It's done");
  if (!input.value || input.value === "") {
    return;
  }
  fetch("http://localhost:3001/messages", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content: input.value }),
  }).then(function (response) {
    return response.blob();
  });
  input.value = "";
});
