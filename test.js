require('dotenv').config();
const { REST } = require('discord.js');

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

(async () => {
  try {
    const appData = await rest.get('/users/@me');
    console.log('Token works! Bot name:', appData.username);
  } catch (err) {
    console.error('❌ Invalid token:', err);
  }
})();
