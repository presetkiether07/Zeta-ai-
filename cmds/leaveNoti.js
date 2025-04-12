const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports = {
  name: "leaveNoti",
  usePrefix: false,
  usage: "leaveNoti",
  version: "1.0",
  cooldown: 5,
  admin: false,

  execute: async ({ api, event }) => {
    const { threadID, messageID, logMessageData, author } = event;

    if (logMessageData.leftParticipantFbId === api.getCurrentUserID()) return;

    try {
      const userID = logMessageData.leftParticipantFbId;
      const userInfo = await api.getUserInfo(userID);
      const name = userInfo[userID].name;

      const threadInfo = await api.getThreadInfo(threadID);
      const memberCount = threadInfo.participantIDs.length;

      const type = (author === userID) ? "left the group." : "was kicked by an admin.";

      const backgrounds = [
        "https://i.imgur.com/WL4XGO1.png",
        "https://i.imgur.com/6h8kc9s.png",
        "https://i.imgur.com/k15A102.png",
        "https://i.imgur.com/AaDPx0e.png"
      ];
      const bg = backgrounds[Math.floor(Math.random() * backgrounds.length)];

      const imgUrl = `https://free-api.ainz-sama101.repl.co/canvas/goodbye2?name=${encodeURIComponent(name)}&uid=${userID}&bg=${bg}&member=${memberCount}`;
      const image = (await axios.get(imgUrl, { responseType: "arraybuffer" })).data;

      const filePath = path.join(__dirname, "cache", "bye.png");
      fs.writeFileSync(filePath, Buffer.from(image, "utf-8"));

      const msg = {
        body: `${name} ${type}\nMembers left: ${memberCount}`,
        attachment: fs.createReadStream(filePath),
      };

      api.sendMessage(msg, threadID, () => {
        fs.unlink(filePath, () => {});
      });

    } catch (err) {
      console.error("Error in leaveNoti:", err);
      api.sendMessage("☠️ Error generating goodbye message.", threadID, messageID);
    }
  },
};
