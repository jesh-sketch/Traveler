document.addEventListener("DOMContentLoaded", () => {
  const chatBox = document.querySelector(".msger-chat");
  const inputField = document.querySelector(".msger-input");
  const sendButton = document.querySelector(".msger-send-btn");
  const msgerForm = document.querySelector(".msger-inputarea");

  let time = 6; // Start time in hours
  const stops = ["Aberdeen", "Hilton", "Ellon"];
  let currentStopIndex = 0;

  function appendMessage(name, text, isUser = false) {
      const msgHTML = `
          <div class="msg ${isUser ? "right-msg" : "left-msg"}">
              <div class="msg-bubble">
                  <div class="msg-info">
                      <div class="msg-info-name">${name}</div>
                      <div class="msg-info-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                  <div class="msg-text">${text}</div>
              </div>
          </div>
      `;

      chatBox.insertAdjacentHTML("beforeend", msgHTML);
      chatBox.scrollTop = chatBox.scrollHeight;
  }

  function checkStop() {
      if (currentStopIndex >= stops.length) {
          appendMessage("Genie", "You've reached the end of your journey!");
          return;
      }

      let stop = stops[currentStopIndex];
      appendMessage("Genie", `You have arrived at ${stop} by ${time}:00.`);

      let busOptions = generateRandomBuses(time);
      if (busOptions.length === 0) {
          appendMessage("Genie", "No buses are available at this hour.");
      } else {
          let optionsText = busOptions.map((bus, index) => `${index + 1}. ${bus.toString()}`).join("<br>");
          appendMessage("Genie", `Available buses:<br>${optionsText}<br>Type a number to choose.`);
      }

      currentStopIndex++;
  }

  function generateRandomBuses(time) {
      let numBuses = time < 10 ? 3 : time < 14 ? 2 : time < 18 ? 1 : 0;
      let buses = [];

      for (let i = 0; i < numBuses; i++) {
          let name = `Bus ${String.fromCharCode(97 + i)}`;
          let duration = Math.floor(Math.random() * 4) + 1;
          let price = (Math.floor(Math.random() * 10) + 1) * 5;

          buses.push(new Bus(name, duration, price));
      }

      return buses;
  }

  class Bus {
      constructor(name, duration, price) {
          this.name = name;
          this.duration = duration;
          this.price = price;
      }

      toString() {
          return `${this.name} | Duration: ${this.duration} hours | Price: $${this.price}`;
      }
  }

  sendButton.addEventListener("click", (event) => {
      event.preventDefault();
      let userInput = inputField.value.trim();

      if (!userInput) return;

      appendMessage("You", userInput, true);

      let busChoice = parseInt(userInput);
      if (!isNaN(busChoice) && busChoice > 0 && busChoice <= 3) {
          let chosenBus = generateRandomBuses(time)[busChoice - 1];
          time += chosenBus.duration;
          appendMessage("Genie", `You chose ${chosenBus.name}. Your new time is ${time}:00.`);
          setTimeout(checkStop, 1500);
      } else {
          appendMessage("Genie", "Please enter a valid bus number.");
      }

      inputField.value = "";
  });

  // Start the game
  appendMessage("Genie", "Welcome to the traveler's game! Let's begin.");
  checkStop();
});
