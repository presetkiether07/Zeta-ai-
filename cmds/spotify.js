const axios = require('axios');
const fs = require('fs');

module.exports = {
    config: {
        name: "spotify",
        description: "Download songs from Spotify",
        usage: "/spotify <song name>",
        cooldown: 5
    },

    run: async function({ api, message, args }) {
        const query = args.join(" ");
        if (!query) {
            return api.sendMessage("⚠️ Please provide a song name to search!", message.threadID, message.messageID);
        }

        let processingMessage;
        try {
            processingMessage = await api.sendMessage("🔎 Searching...", message.threadID);

            const search = await axios.get(`https://betadash-search-download.vercel.app/spt?search=${encodeURIComponent(query)}`);
            const song = search.data;

            if (!song || !song.download_url) {
                api.unsendMessage(processingMessage.messageID);
                return api.sendMessage("❌ Song not found or unavailable for download.", message.threadID, message.messageID);
            }

            await api.editMessage(`🎵 Found: ${song.title} by ${song.artists}\n⏳ Downloading...`, processingMessage.messageID);

            const mp3 = await axios({
                method: 'get',
                url: song.download_url,
                responseType: 'arraybuffer'
            });

            const path = __dirname + `/cache/${song.title}.mp3`;
            fs.writeFileSync(path, Buffer.from(mp3.data));

            await api.editMessage("Almost done...", processingMessage.messageID);

            await api.sendMessage(
                {
                    body: `🎵 ${song.title} - ${song.artists}\n⏱️ Duration: ${Math.floor(song.duration / 1000 / 60)}:${Math.floor(song.duration / 1000 % 60).toString().padStart(2, '0')}`,
                    attachment: fs.createReadStream(path)
                },
                message.threadID,
                async () => {
                    fs.unlinkSync(path);
                    api.unsendMessage(processingMessage.messageID);
                },
                message.messageID
            );

        } catch (error) {
            console.error('Spotify Error:', error);
            if (processingMessage) api.unsendMessage(processingMessage.messageID);
            api.sendMessage("❌ An error occurred while processing your request.", message.threadID, message.messageID);
        }
    }
};
