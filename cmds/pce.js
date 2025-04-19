module.exports = {
    name: "pce",
    description: "Send group rules and regulations.",
    usage: "pce",
    version: "1.0",
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

        api.sendMessage(rules, event.threadID, (err, info) => {
            if (!err) {
                // React to the message after sending
                api.setMessageReaction("👍", info.messageID, (err) => {
                    if (err) console.error("❌ Failed to react to the message:", err);
                }, true);
            }
        }, event.messageID);
    }
};
