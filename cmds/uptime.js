const axios = require("axios");
const fs = require("fs");
const path = require("path");

const startTime = Date.now(); // Save this at the top level for global uptime

module.exports = {
    name: "uptime",
    usePrefix: false,
    usage: "uptime",
    description: "Get the bot uptime image",
    version: "1.3",
    admin: false,
    cooldown: 5,

    async execute({ api, event }) {
        try {
            const uptimeMs = Date.now() - startTime;
            const hours = Math.floor(uptimeMs / (1000 * 60 * 60));
            const minutes = Math.floor((uptimeMs / (1000 * 60)) % 60);
            const seconds = Math.floor((uptimeMs / 1000) % 60);

            // Start measuring ping
            const pingStart = Date.now();

            // Dummy request to measure ping
            await axios.get("https://api.github.com"); 

            const ping = Date.now() - pingStart;

            const imgUrl = `https://kaiz-apis.gleeze.com/api/uptime?instag=brtbrtbrt15&ghub=Jhon-mark23&fb=Mark Martinez&hours=${hours}&minutes=${minutes}&seconds=${seconds}&botname=Fbot-V1.8&theme=nature&ping=${ping}`;
            const filePath = path.join(__dirname, "cache", `uptime_${event.senderID}.png`);

            const res = await axios.get(imgUrl, { responseType: "arraybuffer" });
            fs.writeFileSync(filePath, res.data);

            api.sendMessage({
                body: `🌿 **Fbot-V1.8 Uptime**\n\n⏱️ Uptime: ${hours}h ${minutes}m ${seconds}s\n📡 Ping: ${ping}ms`,
                attachment: fs.createReadStream(filePath)
            }, event.threadID, () => fs.unlinkSync(filePath));
        } catch (error) {
            console.error("Uptime error:", error);
            api.sendMessage("⚠️ Failed to fetch uptime image.", event.threadID, event.messageID);
        }
    }
};
