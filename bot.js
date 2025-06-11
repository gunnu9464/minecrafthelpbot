const mineflayer = require('mineflayer');

const BOT_USERNAME = 'AI';
const SERVER_HOST = 'Nerddddsmp.aternos.me';
const SERVER_PORT = 57453;

let bot;
let movementInterval;

function createBot() {
  bot = mineflayer.createBot({
    host: SERVER_HOST,
    port: SERVER_PORT,
    username: BOT_USERNAME,
    version: false
  });

  // Jokes array
  const jokes = [
    "Why did the chicken join the Minecraft server? To get to the other biome!",
    "Why don’t skeletons fight each other? They don’t have the guts.",
    "Why was the creeper invited to the party? Because he was a blast!",
    "What's a Minecraft player's favorite snack? Creeper chips!",
    "Why did the zombie go to school? He wanted to improve his 'dead'ucation.",
    "Why don't Endermen like jokes? Because they can't take things lightly!"
  ];

  bot.on('login', () => {
    console.log('AI has joined the server!');
    bot.chat("Hello! I'm AI, your friendly server bot. Mention my name for help!");
    startRandomMovement();
  });

  bot.on('chat', (username, message) => {
    if (username === bot.username) return; // Ignore own messages

    const msg = message.toLowerCase();

    // Respond when name is mentioned
    if (msg.includes('ai')) {
      if (msg.includes('help')) {
        bot.chat(`Hi ${username}! Ask me anything about the server or Minecraft!`);
        return;
      }
      if (msg.includes('ip') || msg.includes('how to join') || msg.includes('server address')) {
        bot.chat("Our server IP is: Nerddddsmp.aternos.me, port 57453");
        return;
      }
      if (msg.includes('joke')) {
        bot.chat(jokes[Math.floor(Math.random() * jokes.length)]);
        return;
      }
      if (msg.includes('how are you')) {
        bot.chat("I'm just a bot, but I'm always happy to help!");
        return;
      }
      if (msg.includes('who made you')) {
        bot.chat("I was created by gunnu9464 to make the server more fun!");
        return;
      }
      if (msg.includes('entertain')) {
        bot.chat("Type 'AI joke' for a laugh, or ask me anything you like!");
        return;
      }
      bot.chat("I'm AI, your friendly server assistant! Ask me anything, or say 'AI joke' or 'AI entertain'!");
      return;
    }

    // Fun commands
    if (msg === "!joke") {
      bot.chat(jokes[Math.floor(Math.random() * jokes.length)]);
      return;
    }
    if (msg === "!entertain") {
      bot.chat("Want a joke? Type !joke. Need the server IP? Ask me 'AI server IP'. Let's build something awesome together!");
      return;
    }
  });

  bot.on('kicked', (reason) => {
    console.log('Kicked from server:', reason);
    stopRandomMovement();
    reconnect();
  });

  bot.on('end', () => {
    console.log('Disconnected from server');
    stopRandomMovement();
    reconnect();
  });

  bot.on('error', (err) => {
    console.log('Error:', err);
    stopRandomMovement();
  });

  function startRandomMovement() {
    if (movementInterval) clearInterval(movementInterval);

    movementInterval = setInterval(() => {
      if (!bot.entity || !bot.entity.position) return;

      // Randomly pick a direction to walk for a short time
      const directions = ['forward', 'back', 'left', 'right'];
      const dir = directions[Math.floor(Math.random() * directions.length)];

      // Start walking
      bot.setControlState(dir, true);

      // Sometimes jump
      if (Math.random() < 0.3) {
        bot.setControlState('jump', true);
        setTimeout(() => bot.setControlState('jump', false), 400 + Math.random() * 400);
      }

      // Walk for a random time, then stop
      setTimeout(() => {
        bot.setControlState(dir, false);
      }, 1000 + Math.random() * 1500);

    }, 3500);
  }

  function stopRandomMovement() {
    if (movementInterval) clearInterval(movementInterval);
    bot.clearControlStates && bot.clearControlStates();
  }
}

function reconnect() {
  // Wait 6 seconds before reconnecting
  setTimeout(() => {
    console.log('Reconnecting...');
    createBot();
  }, 6000);
}

// Start bot
createBot();
