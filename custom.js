const cron = require('node-cron');

const scheduleTasks = (ownerID, api, config = { autoRestart: true }) => {
    console.log("✅ Auto-restart scheduler initialized.");

    // 📌 Auto-Restart at 6AM, 12PM, 6PM, 12AM
    if (config.autoRestart) {
        const restartTimes = ['0 6 * * *', '0 12 * * *', '0 18 * * *', '0 0 * * *'];

        restartTimes.forEach(time => {
            cron.schedule(time, () => {
                api.sendMessage("🔄 Bot is restarting automatically...", ownerID, () => {
                    console.log(`🔄 Scheduled restart at ${time}`);
                    process.exit(1);
                });
            }, { timezone: "Asia/Manila" }); // Change timezone as needed
        });

        console.log("✅ Auto-restart scheduler started.");
    } else {
        console.log("❌ Auto-restart is disabled.");
    }

    // Auto-greet removed
};

module.exports = scheduleTasks;
