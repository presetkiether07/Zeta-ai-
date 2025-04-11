module.exports = {
    name: "event",

    async execute({ api, event }) {
        if (event.logMessageType === "log:subscribe") {
            try {
                const threadInfo = await api.getThreadInfo(event.threadID);
                const totalMembers = threadInfo.participantIDs.length;
                const botID = api.getCurrentUserID();

                const newUsers = event.logMessageData.addedParticipants;
                for (const user of newUsers) {
                    const userID = user.userFbId;
                    const userName = user.fullName || "there";

                    const mentions = [
                        { tag: `@${userName}`, id: userID },
                        { tag: "@April Macasinag Manalo", id: "100075247455712" },
                        { tag: "@April Macasinag Manalo", id: "100075247455712" }
                    ];

                    const message = {
                        body: `👋 Welcome @${userName} to the group!
👥 Total members: ${totalMembers}


👨‍💻[ADMIN] @April Macasinag Manalo: Pm any message to the poging owner ng bot if you see problem 

Bot creator:  @April Macasinag Manalo`,
                        mentions
                    };

                    await api.sendMessage(message, event.threadID);

                    // Set bot nickname if it's the one added
                    if (userID === botID) {
                        const newNickname = "»Educational Bot«";
                        await api.changeNickname(newNickname, event.threadID, botID);
                    }
                }
            } catch (err) {
                console.error("❌ Error in group event:", err);
            }
        }
    }
};
