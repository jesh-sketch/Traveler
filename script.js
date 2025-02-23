document.addEventListener("DOMContentLoaded", () => {
  const chatBox = document.querySelector(".msger-chat");
  const inputField = document.querySelector(".msger-input");
  const sendButton = document.querySelector(".msger-send-btn");
  const msgerForm = document.querySelector(".msger-inputarea");

  let gameMasterAnger = false; // Game Master's anger state (true = angry, false = not angry)
  let money = 50; // Player's starting money
  let time = 6; // Start time in hours
  let hunger = 5; // Hunger level (starts at 5, max is 5)
  let isStarving = false; // True if the player is starving (hunger <= 1)
  let hasEaten = false; // Track whether the player has eaten or not
  let waitCount = 0; // Count the number of times the player waits at the first stop
  const stops = ["Aberdeen", "Hilton", "Ellon", "Edinburgh", "Glasgow", "Manchester", "London", "Bristol", "Cardiff", "Dublin"];
  let currentStopIndex = 0;
  let isOnBus = false; // Track whether the player has boarded the bus
  let bus = {}; // Bus details for the current stop

  // Function to display a message in the chatbox
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

  // Function to handle stop arrival and game progress
  function checkStop() {
      if (currentStopIndex >= stops.length) {
          appendMessage("Game Master", "You've reached the end of your journey! Wow, that took longer than expected.");
          return;
      }

      let stop = stops[currentStopIndex];
      appendMessage("Game Master", `You have arrived at ${stop} by ${time}:00.`);

      if (isStarving) {
          appendMessage("Game Master", "You're starving... You wasted 4 hours at this stop.");
          time += 4; // Waste time due to starvation
      }

      bus = generateBus(); // Generate the bus for the current stop

      if (currentStopIndex === 0) {
          // At first stop, one free bus is available
          appendMessage("Game Master", `There is 1 free bus available. Wanna hop on or just stand there? (Yes/No)`);
      } else {
          // After the first stop, present the bus option
          appendMessage("Game Master", `There is a bus available: <br>${bus.name} | Duration: ${bus.duration} hours | Price: $${bus.price}`);
          appendMessage("Game Master", "You can choose to board the bus (Yes/No) or type 'eat' to eat.");
      }

      // Remind the player what actions are available
      appendMessage("Game Master", "You can input one of the following commands: <br> 'Yes' to board the bus, <br> 'No' to wait, <br> 'eat' to eat, <br> 'stats' to check your stats.");
  }

  // Function to generate a random bus for the current stop
  function generateBus() {
      let bus = {};
      let busDuration = Math.floor(Math.random() * 4) + 1; // Random duration between 1 and 4 hours
      let busPrice = currentStopIndex === 0 ? 0 : Math.floor(Math.random() * 20) + 5; // Free bus at first index, others have random prices

      bus = {
          name: "Bus A",
          duration: busDuration,
          price: busPrice
      };

      return bus;
  }

  // Function to trigger wallet theft
  function triggerWalletTheft() {
      appendMessage("Game Master", "Oh no! The trip is going too well... A thief steals your wallet!");
      money = 0; // Wallet is stolen, so set money to 0
      appendMessage("Game Master", "You're now penniless. Better hope you find some way to get to your next stop.");
  }

  // Function to show the player's stats
  function showStats() {
      appendMessage("Game Master", `Your current stats: <br> Time: ${time}:00 <br> Money: $${money} <br> Hunger: ${hunger} <br> Has eaten: ${hasEaten ? "Yes" : "No"}`);
  }

  // Function to check if the Game Master is angry
  function checkGMAnger() {
      if (!hasEaten && gameMasterAnger === false) {
          gameMasterAnger = true;
          appendMessage("Game Master", "You haven't eaten for a while... and I'm getting angry.");
      }
  }

  // Function to handle the waiting logic
  function handleWait() {
      if (waitCount < 3) {
          waitCount++;
          appendMessage("Game Master", `You decided to wait... That’s ${waitCount} time(s) now. Are you sure about this?`);
          if (waitCount === 3) {
              appendMessage("Game Master", "I've had enough! You win, I've lost interest. The bus is all yours now.");
              setTimeout(() => {
                  currentStopIndex++; // Skip to the next stop
                  appendMessage("Game Master", "I'm done here. No more interference from me.");
                  // After 3 waits, remove the Game Master and let the player board the bus
                  setTimeout(() => {
                      appendMessage("Bus", "You board Bus A. Your journey continues smoothly.");
                      time += bus.duration; // Add bus duration to time
                      isOnBus = true; // Player is on a bus now
                      setTimeout(() => {
                          appendMessage("Bus", "You arrived at your final destination without any further stops!");
                          appendMessage("Game Master", "Looks like you made it! Congratulations!"); // Announce the win
                      }, 2000);
                  }, 2000);
              }, 2000);
          } else {
              setTimeout(checkStop, 3000); // Continue checking the next stop after waiting
          }
      }
  }

  sendButton.addEventListener("click", (event) => {
      event.preventDefault();
      let userInput = inputField.value.trim().toLowerCase();

      if (!userInput) return; // If empty input, ignore

      appendMessage("You", userInput, true);

      // Handle the first stop (Aberdeen) and the bus choice
      if (currentStopIndex === 0 && !isOnBus) {
          if (userInput === "yes") {
              let busDuration = bus.duration; // Free bus duration
              appendMessage("Game Master", `You hopped on the free bus! It's going to be a smooth ride, well, unless you fall asleep.`);
              time += busDuration; // Add bus duration to time
              isOnBus = true; // Player is on a bus now
              setTimeout(() => {
                  currentStopIndex++; // Move to the next stop
                  isOnBus = false; // Reset the bus flag for the next stop
                  checkStop(); // Proceed to next stop
              }, 2000);
          } else if (userInput === "no") {
              handleWait();
          } else {
              appendMessage("Game Master", "Hmm, that's not an option... Are you planning to stand there forever?");
          }
      } else if (currentStopIndex === 2 && userInput === "yes" && !hasEaten) {
          // Wallet theft happens on the third stop if the player hasn't eaten
          triggerWalletTheft();
          setTimeout(() => {
              currentStopIndex++;
              checkStop(); // Proceed to next stop after theft
          }, 2000);
      } else if (currentStopIndex > 0 && !isOnBus) {
          // Handle bus choice or eating from the available options
          if (userInput === "eat") {
              // Handle eating at a stop
              if (hunger > 1) {
                  appendMessage("Game Master", "You chose to eat. Time wasted for eating. You'll have to wait for the next bus.");
                  hunger -= 1; // Reduce hunger after eating
                  time += 2; // Add time for eating and waiting
                  hasEaten = true; // Player has eaten now
                  isStarving = false; // Player is not starving anymore
                  setTimeout(checkStop, 3000); // Proceed to next stop after waiting
              } else {
                  appendMessage("Game Master", "You're starving! You wasted 4 hours while eating. Oops, guess that's your punishment.");
                  hunger = 5; // Reset hunger
                  isStarving = false; // Player is not starving anymore
                  time += 4; // Add wasted time
                  hasEaten = true; // Player has eaten now
                  setTimeout(checkStop, 3000);
              }
          } else if (userInput === "yes") {
              appendMessage("Game Master", `You hopped on ${bus.name}. Let the journey continue!`);
              time += bus.duration; // Add bus duration to time
              money -= bus.price; // Deduct price from money
              if (money < 0) {
                  appendMessage("Game Master", "Oh dear, you don't have enough money to board that bus. Try again.");
                  return;
              }
              setTimeout(() => {
                  currentStopIndex++; // Move to the next stop
                  isOnBus = false; // Reset the bus flag for the next stop
                  checkStop(); // Proceed to next stop
              }, 2000);
          } else if (userInput === "no") {
              handleWait();
          } else if (userInput === "stats") {
              // Show stats if the user inputs 'stats'
              showStats();
          } else {
              appendMessage("Game Master", "Please choose a valid option. It's not that hard, really.");
          }
      }

      // Check if the Game Master's anger should be triggered
      checkGMAnger();

      inputField.value = ""; // Clear the input field
  });

  appendMessage("Game Master", "Welcome to the traveler's game! Let's begin.");
  checkStop(); // Start the game at the first stop
});
