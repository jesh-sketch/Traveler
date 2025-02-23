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
  let genieLostInterest = false;
  let currentStopIndex = 0;
  let isOnBus = false;
  let genieRefusals = 0;
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
          appendMessage("Genie", "You've reached your destination!");
          return;
      }

      let stop = stops[currentStopIndex];
      appendMessage("Genie", `You have arrived at ${stop}. The time is now ${time}:00.`);
      bus = generateBus();
      
      if (currentStopIndex === 0) {
          appendMessage("Genie", "There's a free bus here. Do you get on? (Yes/No)");
      } else {
          appendMessage("Genie", `There's a bus available: <br>${bus.name} | Duration: ${bus.duration} hours | Price: $${bus.price}`);
          appendMessage("Genie", "You can 'Yes' to board, 'No' to wait, or 'eat' to eat.");
      }
  }

  function generateBus() {
      return {
          name: "Bus A",
          duration: Math.floor(Math.random() * 4) + 1,
          price: currentStopIndex === 0 ? 0 : Math.floor(Math.random() * 20) + 5
      };
  }

  sendButton.addEventListener("click", (event) => {
      event.preventDefault();
      let userInput = inputField.value.trim().toLowerCase();
      if (!userInput) return;
      appendMessage("You", userInput, true);
      
      if (currentStopIndex === 0) {
          if (userInput === "no") {
              genieRefusals++;
              if (genieRefusals >= 3) {
                  appendMessage("Genie", "Hmph. Fine. Have it your way.");
                  setTimeout(() => {
                      appendMessage("Genie", "You board the bus and reach your destination without any more trouble.");
                      setTimeout(() => appendMessage("Genie", "You win!"), 2000);
                  }, 2000);
              } else {
                  appendMessage("Genie", "Are you sure? You might regret it. choose again yes or no!");
              }
          } else if (userInput === "yes") {
              appendMessage("Genie", "Alright, here we go.");
              time += bus.duration;
              isOnBus = true;
              setTimeout(() => {
                  currentStopIndex++;
                  isOnBus = false;
                  checkStop();
              }, 2000);
          } else {
              appendMessage("Genie", "That’s not an option.");
          }
      } else if (!isOnBus) {
          if (userInput === "eat") {
              hunger = 5;
              time += 2;
              hasEaten = true;
              
              if (currentStopIndex === 1) {
                  appendMessage("Genie", "Oh no, you ate and your bus left. How unfortunate.");
                  setTimeout(() => {
                      appendMessage("Genie", "The next bus? It breaks down halfway. Now you’re stranded.");
                      appendMessage("Genie", "With no way forward, you have to turn back home. Game over.");
                  }, 3000);
              } else {
                  appendMessage("Genie", "You eat and wait for another bus.");
                  setTimeout(checkStop, 3000);
              }
          } else if (userInput === "yes") {
              time += bus.duration;
              money -= bus.price;
              if (money < 0) {
                  appendMessage("Genie", "Oh dear, you can’t afford that.");
                  return;
              }
              appendMessage("Genie", "On the bus we go.");
              setTimeout(() => {
                  currentStopIndex++;
                  isOnBus = false;
                  
                  if (currentStopIndex === 2 && !hasEaten) {
                      appendMessage("Genie", "Oh no, your wallet was stolen!");
                      setTimeout(() => {
                          appendMessage("Genie", "By the time someone helps you, it's too late. You decide to go home. Game over.");
                      }, 3000);
                  } else {
                      checkStop();
                  }
              }, 2000);
          } else if (userInput === "no") {
              appendMessage("Genie", "No waiting here. Make a real choice.");
          } else {
              appendMessage("Genie", "Pick a valid option.");
          }
      }
      inputField.value = "";
  });

  appendMessage("Genie", "Welcome to the traveller's game!");
  checkStop();
});
// Function to check stats
function checkStats() {
  appendMessage("Genie", `Current Stats: 
  Money: $${money} 
  Time: ${time}:00
  Hunger: ${hunger} 
  Has eaten: ${hasEaten ? "Yes" : "No"}
  Wait Count: ${waitCount} 
  Genie refusals: ${genieRefusals}`);
}

// Function to reset the game
function resetGame() {
  money = 50;
  time = 6;
  hunger = 5;
  hasEaten = false;
  waitCount = 0;
  genieRefusals = 0;
  currentStopIndex = 0;
  isOnBus = false;
  
  // Clear chat history
  chatBox.innerHTML = '';
  
  // Start a new game
  appendMessage("Genie", "Welcome to the traveler's game!");
  checkStop();
}

// Add event listeners for the buttons
document.getElementById('reset-btn').addEventListener('click', resetGame);
document.getElementById('check-stats-btn').addEventListener('click', checkStats);

