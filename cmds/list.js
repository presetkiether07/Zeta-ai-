module.exports = {
    name: "list",
    author: "april",
    description: "showing member list.",
    usage: "list",
    version: "1.1",
    cooldown: 5,
    admin: false,
 category: "group",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ api, event }) {
    try {
      const threadInfo = await api.getThreadInfo(event.threadID);
      const members = threadInfo.userInfo;

      const nameList = members
        .filter(m => !m.isDeleted)
        .map((user, index) => `${index + 1}. ${user.name}`)
        .join("\n");

      const message = `Group Member List:\n\n${nameList}`;

      api.sendMessage(message, event.threadID, event.messageID);
    } catch (error) {
      api.sendMessage("An error occurred while fetching the member list.", event.threadID, event.messageID);
    }
  }
};
