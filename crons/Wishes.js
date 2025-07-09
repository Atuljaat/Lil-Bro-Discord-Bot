const cron = require("node-cron");
const db = require("../database/database");

const getChannels = async () => {
    return new Promise((resolve, reject) => {
        db.all(`SELECT channel_id FROM wishes_channels`, [], (err, rows) => {
            if (err) {
                console.log(`Error in getting channels for cron jobs : `, err);
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

const wishes = (client) => {
    cron.schedule("0 0,6,12,18,22 * * *", async () => {
        const hour = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata", hour: "2-digit", hour12: false });
        let message = "";
        if (hour === 0) {
            message =
                '😴🌌 **Good Night!** So jao, bohot raat ho gayi... 🌙💤';
        } else if (hour === 6) {
            message =
                '🌞⏰ **Good Morning!** Wakey wakey, uth jao! 🛌🚿';
        } else if (hour === 12) {
            message =
                "🍛🌞 **Good Afternoon!** Kya kha rahe ho doston? 😋🥗";
        } else if (hour === 18) {
            message =
                "🌆✨ **Good Evening!** Aaj ka din kaisa gaya? 😌";
        } else if (hour === 22) {
            message =
                '🕵️‍♂️🌙 **Aur sab kaise ho?** Raat ka time hai, baat cheet chalu karo! 💬🔥';
        }

        try {
            const rows = await getChannels();
            for (let item of rows) {
                try {
                    const channel = await client.channels.fetch(item.channel_id);
                    if (channel) {
                        await  channel.send(message);
                    }
                } catch (err) {
                    console.log(
                        `Error in sending cron message in channel : ${item.channel_id}`
                    );
                }
            }
        } catch (err) {
            console.log("Error in sending the cron message");
        }
    } , 
        {
            timezone: "Asia/Kolkata"
        }
);
};

module.exports = wishes;

