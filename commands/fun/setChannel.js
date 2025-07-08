const { SlashCommandBuilder } = require('discord.js');
const db = require('../../database/database')

const setChannel = (userId,guildId,channelId) => {
    db.run(
        `INSERT OR REPLACE INTO  wishes_channels (user_id,server_id,channel_id) VALUES (?,?,?) `,
        [userId,guildId,channelId],
        (err) => {
            if (err) {
                console.log(`Error in setting wishing channel ` , err)
            } else {
                console.log('Successfully setup the channel')
            }
        }
    )
}

module.exports = {
    data : new SlashCommandBuilder()
    .setName('set_channel')
    .setDescription('set the channel for daily wishes'),
    async execute(interaction) {
        try {
            const userId = interaction.user.id
            const guildId = interaction.guildId
            const channelId = interaction.channelId
            await interaction.deferReply()
            setChannel(userId,guildId,channelId)
            await interaction.editReply('Successfully setup this channel for wishes')
        } catch (err) {
            await interaction.editReply('Error in cron job')
        }
    },
}