const { SlashCommandBuilder } = require('discord.js');

const diceRoll = () => {
    let min = 1 ;
    let max = 6;
    let randomNo = Math.floor(Math.random() * (max - min + 1) + min);
    return randomNo
}

module.exports = {
    data : new SlashCommandBuilder()
    .setName('roll')
    .setDescription('roll a dice '),
    async execute(interaction) {
        let random = diceRoll()
        await interaction.reply(String(random))
    },
}
