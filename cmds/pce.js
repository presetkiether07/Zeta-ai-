module.exports = {
    name: "pce",
    description: "Send group rules and regulations temporarily.",
    usage: "pce",
    version: "1.1",
    cooldown: 5,
    admin: false,

    execute: async ({ api, event }) => {
        const rules = `
RULES AND REGULATIONS👇

❎ NOT ALLOWED ❎

📌 Bawal makipag away sa member  
📌 Bawal magnakaw ng edit  
📌 Bawal mag spam sa gc  
📌 Bawal mag mura  
📌 Bawal mag add ng hindi editor  
📌 Bawal mag send ng malaswang larawan/video  
📌 Bawal mag chat ng mga malalaswang salita  

✅ ALLOWED ✅

📌 Mag tulungan  
📌 Mag tanong tungkol sa pag-eedit  
📌 Mag add ng mga editor *with admin permission*  
📌 Mag ingay sa gc  

📍 *Other rules will be added as soon as I can* 📍
        `;

        // React to the trigger message
        api.setMessageReaction("✅", event.messageID, (err) => {
            if (err) console.error("❌ Failed to react:", err);
        }, true);

        // Send the rules and unsend after 60 seconds
        api.sendMessage(rules, event.threadID, (err, messageInfo) => {
            if (err) return console.error("❌ Failed to send rules:", err);

            // Set timeout to unsend
            setTimeout(() => {
                api.unsendMessage(messageInfo.messageID, (unsendErr) => {
                    if (unsendErr) console.error("❌ Failed to unsend rules:", unsendErr);
                });
            }, 60000); // 60,000 ms = 60 seconds
        });
    }
};
