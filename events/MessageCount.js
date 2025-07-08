const { Events } = require("discord.js");
const db = require("../database/database");

const updateDatabaseMessges = (guildId, userId) => {
            db.run(
                `INSERT OR IGNORE INTO global_message_stats (id, total_messages) VALUES ( ? , 0)`,
                [userId] ,
                (err) => {
                    if (err) {
                        console.log(`global insert error : ` , err)
                        return;
                    }
                    db.run(
                        `UPDATE global_message_stats SET total_messages = total_messages + 1 WHERE id = ? `,
                        [userId] , 
                        (err) => {
                            if (err) {
                                console.log(`global update error : ` , err)
                                return
                            }
                        }
                    )
                }
            )

            db.run(
                `INSERT OR IGNORE INTO server_message_stats (server_id,user_id,message_count) VALUES ( ? , ? , 0 )`,
                [guildId,userId] ,
                (err) => {
                    if (err) {
                        console.log(`Error in inserting in server message : ` , err)
                        return;
                    }

                    db.run(
                        `UPDATE server_message_stats SET message_count = message_count + 1 WHERE user_id = ? AND server_id = ?`,
                        [userId,guildId] , 
                        (err) => {
                            if (err) {
                                console.log(`Error in updating in server message : ` , err)
                                return;
                            }
                        }
                    )
                }
            )
};

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot) return;

        const guildId = String(message.guildId);
        const userId = String(message.author.id);

        if (guildId && userId) {
            updateDatabaseMessges(guildId,userId)
        }

        // console.log(message);
    },
};
