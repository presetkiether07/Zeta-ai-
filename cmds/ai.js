const axios = require("axios");

module.exports = {
    name: "ai",
    usePrefix: false,
    usage: "ai <your question> | <reply to an image>",
    version: "1.2",
    admin: false,
    cooldown: 2,

    execute: async ({ api, event, args }) => {
        try {
            const { threadID } = event;
            let prompt = args.join(" ");
            let imageUrl = null;
            let apiUrl = `https://autobot.mark-projects.site/api/gemini-2.5-pro-vison?ask=${encodeURIComponent(prompt)}`;

            if (event.messageReply && event.messageReply.attachments.length > 0) {
                const attachment = event.messageReply.attachments[0];
                if (attachment.type === "photo") {
                    imageUrl = attachment.url;
                    apiUrl += `&imagurl=${encodeURIComponent(imageUrl)}`;
                }
            }

            // Show typing indicator
            api.sendTypingIndicator(threadID, true);

            const response = await axios.get(apiUrl);
            const description = response?.data?.data?.description;

            // Stop typing indicator before sending the response
            api.sendTypingIndicator(threadID, false);

            if (description) {
                return api.sendMessage(`━━━━━━━━━━━━━━━━\n${description}\n━━━━━━━━━━━━━━━━`, threadID);
            }

            return api.sendMessage("⚠️ No description found in response.", threadID);
        } catch (error) {
            console.error("❌ AI Command Error:", error);
            return api.sendMessage("❌ Error while contacting AI API.", event.threadID);
        }
    }
};
