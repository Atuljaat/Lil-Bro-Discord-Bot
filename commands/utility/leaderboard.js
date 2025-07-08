const { SlashCommandBuilder } = require('discord.js');
const db = require('../../database/database')
const client = require('../../index')

const getLeaderboard = (guildId) => {
    return new Promise((resolve,reject) => {
        db.all(`SELECT * FROM server_message_stats WHERE server_id = ? ORDER BY message_count DESC LIMIT 5` , 
            [guildId] ,
            (err , rows ) => {
                if (err) {
                    console.log('Error in getting leaderboard ' , err)
                    reject(err)
                } else {
                    resolve(rows)
                }
            }
        )
    })
}

const createLeaderboard = async (guildId) => {
    const data = await getLeaderboard(guildId)
    console.log(data)
    let leaderboard = []

    const emojis = ['🥇','🥈','🥉','👽','🍦']

    for ( let i = 0 ; i < data.length ; i++  ){
        const user = await client.users.fetch(data[i].user_id).catch(() => null)
        const username = user ? user.username : 'Unkown User'

        const text = `${i+1}. ${emojis[i]}  ${username} : ${data[i].message_count} messages`
        leaderboard.push(text)
    }
    const ranking = leaderboard.join('\n')
    return ranking
}

module.exports = {
    data : new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('check the text rank'),
    async execute(interaction) {
        const guildId = interaction.guildId
        await interaction.deferReply()
        const leaderboard = await createLeaderboard(guildId)
        await interaction.editReply(leaderboard)
    },
}
