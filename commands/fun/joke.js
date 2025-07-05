const { SlashCommandBuilder } = require('discord.js');

const getJoke = async () => {
    try {
        const response = await fetch('https://official-joke-api.appspot.com/random_joke')
        if (response.ok){
            return await response.json()
        } 
    } catch (error) {
        console.log('Cant get response error : ' , error)
    }
}

module.exports = {
    data : new SlashCommandBuilder()
    .setName('telljoke')
    .setDescription('just telling you a simple joke'),  
    async execute(interaction){
        try {
            const joke = await getJoke()
            if (joke) {
                await interaction.reply(joke.setup)
                setTimeout( async () => {
                    try {
                        await interaction.followUp(joke.punchline)
                    } catch (e) {
                        console.log('Error ' , e)
                    }
                } , 8000)
            } 
        } catch (error) {
            await interaction.reply('Cant think about a joke right now')
        }
    }
}

