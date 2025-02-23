document.addEventListener("DOMContentLoaded", () => {
  const chatBox = document.querySelector(".msger-chat");
  const inputField = document.querySelector(".msger-input");
  const sendButton = document.querySelector(".msger-send-btn");
  const msgerForm = document.querySelector(".msger-inputarea");

  let gameMasterAnger = 0; // Game Master's anger level
  let money = 50; // Player's starting money
  let time = 6; // Start time in hours
  let hunger = 0; // Hunger level (0 to 5)
  const stops = ["Aberdeen", "Hilton", "Ellon"];
  let currentStopIndex = 0;

  function appendMessage(name, text, isUser = false) {
      const msgHTML = `
          <div class="msg ${isUser ? "right-msg" : "left-msg"}">
              <div class="msg-bubble">
                  <div class="msg-info">
                      <div class="msg-info-name">${name}</div>
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
          appendMessage("Game Master", "You've reached the end of your journey!");
          return;
      }

      let stop = stops[currentStopIndex];
      appendMessage("Game Master", `You have arrived at ${stop} by ${time}:00.`);

      if (hunger >= 5) {
          appendMessage("Game Master", `You were too hungry to continue and lost 4 hours.`);
          time += 4; // Waste 4 hours due to max hunger
      }

      let busOptions = generateRandomBuses(time);
      if (busOptions.length === 0) {
          appendMessage("Game Master", "No buses are available at this hour.");
      } else {
          let optionsText = busOptions.map((bus, index) => {
              let priceText = bus.price === 0 ? "Free!" : `Price: $${bus.price}`;
              return `${index + 1}. ${bus.toString()} (${priceText})`;
          }).join("<br>");
          appendMessage("Game Master", `Available buses:<br>${optionsText}<br>Type a number to choose.`);
      }

      currentStopIndex++;
  }

  function generateRandomBuses(time) {
      let numBuses = time < 10 ? 3 : time < 14 ? 2 : time < 18 ? 1 : 0;
      let buses = [];
      let freeBusAdded = currentStopIndex === 0; // Only at first stop

      for (let i = 0; i < numBuses; i++) {
          let name = `Bus ${String.fromCharCode(97 + i)}`;
          let duration = Math.floor(Math.random() * 4) + 1;
          let price = freeBusAdded ? 0 : getPriceBasedOnTimeAndDuration(time, duration);
          freeBusAdded = true; // Ensure only one free bus

          buses.push(new Bus(name, duration, price));
      }

      return buses;
  }

  function getPriceBasedOnTimeAndDuration(currentTime, duration) {
      let maxPrice = Math.round(50 * 0.25);
      let priceIncreaseFactor = currentTime < 10 ? 1 : currentTime < 14 ? 1.5 : currentTime < 18 ? 2 : 2.5;
      let price = Math.round((5 / duration) * 20 * priceIncreaseFactor);
      return Math.min(Math.max(5, price), maxPrice);
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
          let busOptions = generateRandomBuses(time);
          let chosenBus = busOptions[busChoice - 1];

          if (money >= chosenBus.price) {
              money -= chosenBus.price;
              time += chosenBus.duration;
              appendMessage("Game Master", `You chose ${chosenBus.name}. Your new time is ${time}:00. Money: $${money}`);
          } else {
              appendMessage("Game Master", "You don't have enough money for that bus.");
              gameMasterAnger++;
          }

          handleGameMasterAnger();
          setTimeout(checkStop, 1500);
      } else if (userInput.toLowerCase() === "eat") {
          quellHunger();
      } else {
          appendMessage("Game Master", "Please enter a valid bus number or type 'eat' to quell your hunger.");
      }

      inputField.value = "";
  });

  function handleGameMasterAnger() {
      if (gameMasterAnger >= 3) {
          appendMessage("Game Master", "The Game Master is angry! You’ve been sent back in time!");
          gameMasterAnger = 0;
          document.body.style.transition = "background-color 2s";
          document.body.style.backgroundColor = "black";
          time -= 3; // Go back in time
          appendMessage("Game Master", `Your time has been set back to ${time}:00 due to the Game Master's anger!`);
          setTimeout(() => {
              document.body.style.backgroundColor = "#f5f7fa";
          }, 2000);
      }
  }

  function updateHunger() {
      hunger = Math.min(hunger + 1.5, 5); // Increase hunger every 2 hours, max at 5
      if (hunger >= 5) {
          appendMessage("Game Master", "You are too hungry to continue and have lost 4 hours.");
          time += 4;
      }
  }

  function quellHunger() {
      let cost = Math.round((hunger / 5) * 20); // Cost scales from $0 to $20
      if (money >= cost) {
          money -= cost;
          hunger = 0;
          appendMessage("Game Master", `You ate and quelled your hunger. Cost: $${cost}. Money left: $${money}`);
      } else {
          appendMessage("Game Master", "You don't have enough money to quell your hunger.");
      }
  }

  setInterval(updateHunger, 7200000); // Increase hunger every 2 real-time hours
  appendMessage("Game Master", "Welcome to the traveler's game! Let's begin.");
  checkStop();
});
function updateStatusBar() {
  document.getElementById("time-display").textContent = `${time}:00`;

  let hungerPercent = (hunger / 5) * 100;
  let hungerLevel = document.getElementById("hunger-level");
  hungerLevel.style.width = `${hungerPercent}%`;

  if (hunger < 2) {
      hungerLevel.style.background = "green";
  } else if (hunger < 4) {
      hungerLevel.style.background = "yellow";
  } else {
      hungerLevel.style.background = "red";
  }
}

function updateHunger() {
  hunger = Math.min(hunger + 1.5, 5);
  updateStatusBar();

  if (hunger >= 5) {
      appendMessage("Game Master", "You are too hungry to continue and have lost 4 hours.");
      time += 4;
      updateStatusBar();
  }
}

function quellHunger() {
  let cost = Math.round((hunger / 5) * 20);
  if (money >= cost) {
      money -= cost;
      hunger = 0;
      appendMessage("Game Master", `You ate and quelled your hunger. Cost: $${cost}. Money left: $${money}`);
  } else {
      appendMessage("Game Master", "You don't have enough money to quell your hunger.");
  }
  updateStatusBar();
}

setInterval(updateHunger, 7200000); // Increase hunger every 2 real-time hours
updateStatusBar();
