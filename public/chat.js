async function sendMessage() {
  const input = document.getElementById("userInput");
  const chatBox = document.getElementById("chatBox");
  const message = input.value.trim();

  if (!message) return;

  // tampilkan pesan user
  chatBox.innerHTML += `<div class="user">${message}</div>`;
  input.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;

  // kirim ke server
  const response = await fetch("/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message })
  });

  const data = await response.json();

  // tampilkan balasan bot
  chatBox.innerHTML += `<div class="bot">${data.reply}</div>`;
  chatBox.scrollTop = chatBox.scrollHeight;
}
