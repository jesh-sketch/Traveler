document.addEventListener("DOMContentLoaded", () => {
  const chatBox = document.querySelector(".msger-chat");
  const inputField = document.querySelector(".msger-input");
  const sendButton = document.querySelector(".msger-send-btn");
  const msgerForm = document.querySelector(".msger-inputarea");

  let money = 50;
  let time = 6;
  let hunger = 5;
  let hasEaten = false;
  let waitCount = 0;
  let gmLostInterest = false; // Tracks if the GM leaves
  let currentStopIndex = 0;
  let isOnBus = false;
  const stops = ["Aberdeen", "Hilton", "Ellon", "Edinburgh", "Glasgow"];
  let bus = {};

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
          appendMessage("Game Master", "You've reached your destination!");
          return;
      }

      let stop = stops[currentStopIndex];
      appendMessage(gmLostInterest ? "Bus" : "Game Master", `You have arrived at ${stop}. The time is now ${time}:00.`);

      bus = generateBus();

      if (currentStopIndex === 0) {
          appendMessage("Game Master", "There's a free bus here. Do you get on? (Yes/No)");
      } else if (!gmLostInterest) {
          appendMessage("Game Master", `There's a bus available: <br>${bus.name} | Duration: ${bus.duration} hours | Price: $${bus.price}`);
          appendMessage("Game Master", "You can 'Yes' to board, 'No' to wait, or 'eat' to eat.");
      } else {
          appendMessage("Bus", "The bus is here. Type 'Yes' to board.");
      }
  }

  function generateBus() {
      return {
          name: "Bus A",
          duration: Math.floor(Math.random() * 4) + 1,
          price: currentStopIndex === 0 ? 0 : Math.floor(Math.random() * 20) + 5
      };
  }

  function handleWait() {
      if (currentStopIndex !== 0) {
          appendMessage("Game Master", "You can't wait here. Pick a real option.");
          return;
      }

      waitCount++;
      if (waitCount === 1) {
          appendMessage("Game Master", "Standing around, huh? Bold move.");
      } else if (waitCount === 2) {
          appendMessage("Game Master", "Still here? Maybe you're hoping for... I don’t know, divine intervention?");
      } else if (waitCount === 3) {
          gmLostInterest = true;
          appendMessage("Game Master", "You know what? I'm done. Enjoy your trip, or whatever.");
          setTimeout(() => {
              appendMessage("Bus", "The bus arrives. Type 'Yes' to board.");
          }, 2000);
      }
  }

  function showStats() {
      appendMessage("Game Master", `Stats: Time - ${time}:00 | Money - $${money} | Hunger - ${hunger} | Eaten - ${hasEaten ? "Yes" : "No"}`);
  }

  sendButton.addEventListener("click", (event) => {
      event.preventDefault();
      let userInput = inputField.value.trim().toLowerCase();
      if (!userInput) return;
      appendMessage("You", userInput, true);

      if (gmLostInterest && currentStopIndex === 0) {
          if (userInput === "yes") {
              appendMessage("Bus", "You board the bus and reach your destination without any more trouble.");
              setTimeout(() => appendMessage("Game Master", "You win!"), 2000);
          } else {
              appendMessage("Bus", "The bus is waiting. Type 'Yes' to board.");
          }
      } else if (currentStopIndex === 0 && !isOnBus) {
          if (userInput === "yes") {
              time += bus.duration;
              isOnBus = true;
              appendMessage("Game Master", "Alright, here we go.");
              setTimeout(() => {
                  currentStopIndex++;
                  isOnBus = false;
                  checkStop();
              }, 2000);
          } else if (userInput === "no") {
              handleWait();
          } else {
              appendMessage("Game Master", "That’s not an option.");
          }
      } else if (!isOnBus) {
          if (userInput === "eat") {
              if (hunger > 1) {
                  hunger--;
                  time += 2;
                  hasEaten = true;
                  appendMessage("Game Master", "You eat, but the bus leaves. You'll wait for another.");
                  setTimeout(checkStop, 3000);
              } else {
                  hunger = 5;
                  time += 4;
                  hasEaten = true;
                  appendMessage("Game Master", "You're starving! You eat and waste 4 hours.");
                  setTimeout(checkStop, 3000);
              }
          } else if (userInput === "yes") {
              time += bus.duration;
              money -= bus.price;
              if (money < 0) {
                  appendMessage("Game Master", "You can't afford that. Pick something else.");
                  return;
              }
              appendMessage("Game Master", "On the bus we go.");
              setTimeout(() => {
                  currentStopIndex++;
                  isOnBus = false;
                  checkStop();
              }, 2000);
          } else if (userInput === "no") {
              appendMessage("Game Master", "No waiting here. Make a real choice.");
          } else if (userInput === "stats") {
              showStats();
          } else {
              appendMessage("Game Master", "Pick a valid option.");
          }
      }

      inputField.value = "";
  });

  appendMessage("Game Master", "Welcome to the traveler's game!");
  checkStop();
});
