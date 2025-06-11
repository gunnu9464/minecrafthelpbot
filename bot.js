require('dotenv').config();
const mineflayer = require('mineflayer');
const { OpenAI } = require('openai');

const BOT_USERNAME = 'AI';
const SERVER_HOST = 'Nerddddsmp.aternos.me';
const SERVER_PORT = 57453;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

let bot;
let movementInterval;

function createBot() {
  bot = mineflayer.createBot({
    host: SERVER_HOST,
    port: SERVER_PORT,
    username: BOT_USERNAME,
    version: false,
  });

  bot.on('login', () => {
    console.log('AI has joined the server!');
    bot.chat("Hello! I'm AI, your friendly server bot. Mention my name for help or a chat!");
    startRandomMovement();
  });

  bot.on('chat', async (username, message) => {
    if (username === bot.username) return;
    const msg = message.toLowerCase();

    // Only respond if "AI" is mentioned
    if (msg.includes('ai')) {
      bot.chat('Thinking...');
      try {
        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: "You are a helpful, fun Minecraft server bot named AI. Keep responses under 2 sentences." },
            { role: 'user', content: message }
          ],
          max_tokens: 60,
        });
        const reply = completion.choices[0].message.content.trim();
        bot.chat(reply);
      } catch (err) {
        bot.chat("Sorry, I can't think right now.");
        console.error(err);
      }
      return;
    }

    // Still allow !joke and !entertain as before
    if (msg === "!joke") {
      bot.chat("Why did the chicken join the Minecraft server? To get to the other biome!");
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
      const directions = ['forward', 'back', 'left', 'right'];
      const dir = directions[Math.floor(Math.random() * directions.length)];
      bot.setControlState(dir, true);
      if (Math.random() < 0.3) {
        bot.setControlState('jump', true);
        setTimeout(() => bot.setControlState('jump', false), 400 + Math.random() * 400);
      }
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
  setTimeout(() => {
    console.log('Reconnecting...');
    createBot();
  }, 6000);
}

createBot();
