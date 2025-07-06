const { GoogleGenAI } = require('@google/genai');
const { SlashCommandBuilder } = require('discord.js');

const Apis = require('../../Api');

const ai = new GoogleGenAI({
  apiKey : Apis.GeminiKey
});

async function main(message) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: ` Reply the message a sweet tone no extra stuff just reply this =>  : ${message} `,
  });
  return response.text
}

module.exports = {
    data : new SlashCommandBuilder()
    .setName('chat')
    .setDescription('chat with the bot')
    .addStringOption( option => 
        option.setName('message')
        .setDescription('wanna talk  ')
        .setRequired(true)
     )
    ,
    async execute(interaction) {
        const userMsg = interaction.options.getString('message');
        try {
            await interaction.deferReply();
            const response = await main(userMsg);
            await interaction.editReply(String(response));
        } catch (error) {
            console.log(error)
            await interaction.followUp('Right now , I dont want to talk anyone sorry ')
        }
    },
}
