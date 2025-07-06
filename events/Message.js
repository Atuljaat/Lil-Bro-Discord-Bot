const { GoogleGenAI } = require('@google/genai');
const { Events } = require('discord.js');

const Apis = require('../Api');
const { execute } = require('../commands/utility/chat');

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
    name : Events.MessageCreate , 
    async execute (message) {
        if (message.author.bot) return ;

        const content = message.content.toLowerCase();
        if (!content.startsWith('lil bro')) return;

        const question = content.replace('lil bro', '').trim();
    
        try {
            const reply = await main(question)
            await message.reply(String(reply))
        } catch (error) {
            console.log('Gemini error : ' , error)
            await message.reply('I dont want to talk right now 🙂')
        }
    }
}