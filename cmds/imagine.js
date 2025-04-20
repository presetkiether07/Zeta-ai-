const axios = require('axios');

module.exports = {
  meta: {
    name: "imagine",
    version: "1.0",
    author: "april manalo",
    description: "Create an image from your text with 5 model options.",
    category: "imagine",
    cooldown: 10,
    permissions: 0,
    guide: {
      en: `Use: imagine [prompt] | [model number]
Models:
1 | DreamshaperXL10
2 | DynavisionXL
3 | JuggernautXL
4 | RealismEngineSDXL
5 | Sdxl 1.0`
    }
  },

  style: {
    prefix: "ai",
    emoji: "🧠",
    color: "#a865ff"
  },

  entry: async function ({ api, event, args, message }) {
    const input = args.join(' ');
    const [prompt, model] = input.split('|').map(x => x.trim());

    if (!prompt) return message.reply("⚠️ | Please provide a prompt.");

    message.reply("🧠 | Generating image...⏳", async (err, info) => {
      const loadingMsgID = info.messageID;

      try {
        let apiUrl = `https://turtle-apis.onrender.com/api/v2/sdxl?prompt=${encodeURIComponent(prompt)}`;
        if (model) apiUrl += `&model=${model}`;

        const res = await axios.get(apiUrl);
        const combined = res.data.combinedImage;
        const imgUrls = res.data.imageUrls;

        message.unsend(loadingMsgID);
        message.reply({
          body: "🖼️ | Reply with image number (1, 2, 3, 4) to get high-resolution version.",
          attachment: await global.utils.getStreamFromURL(combined)
        }, (err, info) => {
          if (!err) {
            global.GoatBot.onReply.set(info.messageID, {
              commandName: module.exports.meta.name,
              messageID: info.messageID,
              author: event.senderID,
              imageUrls: imgUrls
            });
          }
        });
      } catch (e) {
        console.error(e);
        message.reply(`❌ | Error: ${e.message}`);
      }
    });
  },

  onReply: async function ({ event, args, message, Reply }) {
    const selection = parseInt(args[0]);
    const { author, messageID, imageUrls } = Reply;

    if (event.senderID !== author) return;

    try {
      if (selection >= 1 && selection <= 4) {
        const chosenImage = imageUrls[`image${selection}`];
        message.reply({
          attachment: await global.utils.getStreamFromURL(chosenImage)
        });
      } else {
        message.reply("❌ | Invalid selection. Choose from 1 to 4.");
      }
    } catch (err) {
      console.error(err);
      message.reply(`❌ | Failed to fetch image: ${err.message}`);
    }

    await message.unsend(messageID);
  }
};
