const { SlashCommandBuilder } = require('discord.js');

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
    data : new SlashCommandBuilder()
    .setName('toss')
    .setDescription('toss a coin if bot have one'),
    async execute(interaction) {
        try {
            await interaction.deferReply()
            await interaction.editReply('🔍 Bot is searching coin')

            await wait(1000)
            await interaction.editReply('💸 Bot is tossing the coin')

            await wait(1000)
            let randomNo = Math.floor(Math.random() * 10) + 1
            let tossResult = (randomNo >= 5) ? 'Heads'  : 'Tails'
            await interaction.editReply(`🎉 Result is ${tossResult}`)
        } catch (err) {
            console.log('Error in tossing coin : ' , err)
            await interaction.editReply(`😢 Bot couldn't find coin`)
        }
    },
}