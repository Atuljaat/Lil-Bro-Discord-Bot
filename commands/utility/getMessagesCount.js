const { SlashCommandBuilder } = require('discord.js');
const db = require('../../database/database')

const getUserServerMessages = (userId, guildId) => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT message_count FROM server_message_stats WHERE user_id = ? AND server_id = ?`,
      [userId, guildId],
      (err, row) => {
        if (err) {
          console.log(`Error in getting messages:`, err);
          reject(err);
        } else {
          resolve(row?.message_count || 0);
        }
      }
    );
  });
};


module.exports = {
    data : new SlashCommandBuilder()
    .setName('get_message_count')
    .setDescription('get total number of messages send in the server'),
    async execute(interaction) {
        const guildId = interaction.guildId
        const userId = interaction.user.id
        try {
            await interaction.deferReply()
            const count = await getUserServerMessages(userId,guildId)
            await interaction.editReply(`You sent ${String(count)} messages`)
        } catch (error) {
            console.log(`error in main getting messages ` , error)
            await interaction.followUp('Right now i m busy ')
        }
    },
}