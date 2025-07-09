const { SlashCommandBuilder, EmbedBuilder  } = require('discord.js');

async function getCards(number) {
    try {
        const response = await fetch(`https://tarotapi.dev/api/v1/cards/random?n=${number}`);
        if (!response.ok) {
            return [true, null];
        }
        const json = await response.json();
        return json
    } catch (err) {
        console.error("Error fetching tarot cards:", err);
        return null ;
    }
}

// const data = async () => {
//     const data = await getCards(3)
//     consoe
// }

// data()

function formatCards ( card , time  ) {
    const randomNo =  Math.floor(Math.random() * 10) + 1 ;
    let isReversed = randomNo > 5 ? true : false;
    const orientation = isReversed ? '(Reversed)' : ''
    const meaning = isReversed ? card.meaning_rev : card.meaning_up
    return {
        name : `${time} - ${card.name}  ${orientation}`,
        value : String(meaning)
    }
} 


module.exports = {
    data : new SlashCommandBuilder()
    .setName('tarots')
    .setDescription('ask anything from tarot spirits')
    .addStringOption( option => 
        option.setName('question')
        .setDescription('ask questions')
        .setRequired(true)
    )
    ,
    async execute(interaction) {
        const userMsg = interaction.options.getString('question');
        try {
            await interaction.deferReply()
            const tarots = (await getCards(3))
            console.log(tarots)
            const message = new EmbedBuilder()
            .setTitle(`Tarot Card Reading for your question : ${userMsg} `)
            .setDescription(`Focus on your question here's what the card reveals :`)
            .addFields(
                formatCards(tarots.cards[0],"Past"),
                formatCards(tarots.cards[1],"Present"),
                formatCards(tarots.cards[2],"Future")
            )   
            .setFooter({text:'Interpret the message with an open heart. 🌌'})
            .setColor(0x9b59b6);
            await interaction.editReply({embeds : [message]})

        } catch (err) {
            console.log(`Error in tarot cards : ` , err)
            interaction.editReply('Tarot spirits are sleeping now')
        }
    },
}