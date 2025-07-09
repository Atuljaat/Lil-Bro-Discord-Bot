const { GoogleGenAI } = require("@google/genai");
const { Events } = require("discord.js");

const Apis = require("../Api");

const ai = new GoogleGenAI({
  apiKey: Apis.GeminiKey,
});

async function main(message) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `${message} `,
  });
  return response.text;
}

async function getContextPrompt(channel, userMessage) {
  const messages = await channel.messages.fetch({ limit: 30 });
  const sorted = [...messages.values()].reverse();

  // console.log(userMessage)
  // console.log(sorted)
  const emojiOnly = (msg) =>
    /^(\s*(<a?:\w+:\d+>|[\p{Emoji}\p{Punctuation}\p{Symbol}])+)+\s*$/u.test(
      msg.content
    );

  const chatLog = [...messages.values()]
    .reverse()
    .filter(
      (msg) =>
        msg.author &&
        !msg.author.bot &&
        msg.id !== userMessage.id &&
        msg.content.trim().length > 1 &&
        !emojiOnly(msg)
    )
    .slice(-15)
    .map((msg) => `${msg.author.username}: ${msg.content}`)
    .join("\n");
    // console.log(chatLog)
  const prompt = `You are a helpful Discord bot who reply like human named lil bro created by Atul that sees the following conversation :\n${chatLog}\n\nNow answer this message:\n${userMessage.author.username}: ${userMessage.content}`;
  return prompt;
}

const sendMsg = async (Msg) => {
  try {
    const response = await fetch("https://ai.hackclub.com/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: String(Msg),
          },
        ],
      }),
    });

    if (response.ok) {
      const json = await response.json();
      const msg = json.choices[0].message.content;
      console.log(msg);
      return msg;
    } else {
      console.log("API error : ", response.status);
      return null;
    }
  } catch (err) {
    console.log("Fetch Error : ", err);
    return null;
  }
};

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (message.author.bot) return;

    const content = message.content.toLowerCase();
    if (!content.startsWith("lil bro")) return;

    // const question = content.replace('lil bro', '').trim();
    const prompt = await getContextPrompt(message.channel, message);
    // console.log(prompt)
    try {
      const reply = await main(prompt);
      await message.reply(String(reply));
    } catch (error) {
      console.log("Gemini error : ", error);
      await message.reply("I dont want to talk right now 🙂");
    }
  },
};
