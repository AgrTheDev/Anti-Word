let db = require("quick.db");

function dbCheck(msg) {
  let guild = db.get(`guilds_${msg.guild.id}`);
  if (!guild) {
    let guildObj = {
      ID: msg.guild.id,
      whitelist: {
        channelIDs: [],
        roleIDs: [],
        userIDs: [],
      },
      words: [],
    };
    db.set(`guilds_${msg.guild.id}`, guildObj);
  }
}

module.exports = { dbCheck };
