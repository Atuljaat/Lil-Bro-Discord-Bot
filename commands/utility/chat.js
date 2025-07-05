// import { GoogleGenAI } from "@google/genai";
// import { SlashCommandBuilder } from 'discord.js';
// const ai = new GoogleGenAI({});

// module.exports = {
//     data : new SlashCommandBuilder()
//     .setName('chat')
//     .setDescription('chat with the bot')
//     .addStringOption( option => 
//         option.setName('question')
//         .setDescription('What you want to ask ? ')
//         .setRequired(true)
//      )
//     ,
//     async execute(interaction) {
//         try {
//             const question = interaction.options.getString('question');
//             const response = await main(question)
//             interaction.reply(response)
//         } catch (error) {
//             interaction.reply('Right now , I dont want to talk anyone sorry ')
//         }
//     },
// }




// // The client gets the API key from the environment variable `GEMINI_API_KEY`.

// async function main(message) {
//   const response = await ai.models.generateContent({
//     model: "gemini-2.5-flash",
//     contents: ` Reply the message a sweet tone  : ${message} `,
//   });
//   return response.text
// }

// main();