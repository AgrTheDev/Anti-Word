var db = require("quick.db");
const { prefix } = require("../config.json");
const Discord = require("discord.js");
const { dbCheck } = require("./dbCheck");
function checkMessage(msg) {
  dbCheck(msg);
  let words = db.get(`guilds_${msg.guild.id}.words`);
  let wlChannels = db.get(`guilds_${msg.guild.id}.whitelist.channelIDs`);
  let wlRoles = db.get(`guilds_${msg.guild.id}.whitelist.roleIDs`);
  let wlUsers = db.get(`guilds_${msg.guild.id}.whitelist.userIDs`);
  if (msg.author.bot) return;
  let wordFound = Boolean(words.filter((word) => msg.content.toLowerCase().includes(word.name))[0]);
  if (!wordFound) return;
  if (msg.content.startsWith(prefix)) return;
  if (wlChannels.includes(msg.channel.id)) return;
  let hasWlRole = false;
  for (let i = 0; i < wlRoles.length; i++) {
    if (msg.member.roles.cache.find((r) => r.id === wlRoles[i])) {
      hasWlRole = true;
    } else continue;
  }
  if (hasWlRole) return;
  if (wlUsers.includes(msg.author.id)) return;
  // prettier-ignore
  let deleteEmbed = new Discord.MessageEmbed()
  .setColor("RED")
  .setDescription(`I've deleted <@${msg.author.id}>'s message because it contained a blacklisted word!`)
  .setTimestamp()
  msg.channel.send(deleteEmbed).then((a) => {
    msg.delete();
    setTimeout(() => {
      a.delete();
    }, 6000);
  });
}

module.exports = { checkMessage };
