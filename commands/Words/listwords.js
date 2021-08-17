const { errorEmbed } = require("../../modules/errorEmbed");
const { successEmbed } = require("../../modules/successEmbed");
var dateFormat = require("dateformat");

module.exports = {
  name: "listwords",
  description: "List all the words that you've added to blacklist!",
  type: "Configuration",
  aliases: ["words"],
  usage: `{}listwords`,
  async execute(bot, msg, args, Discord, db) {
    let guild = db.get(`guilds_${msg.guild.id}`);
    if (!msg.member.hasPermission("MANAGE_SERVER")) return errorEmbed(msg, "You don't have the required permissions to use this command!\nRequired permission: `MANAGE_SERVER`");
    let wordsArr = [];
    for (let i = 0; i < guild.words.length; i++) {
      wordsArr.push(`Word: ${guild.words[i].name}\nAdded by: ${bot.users.cache.get(guild.words[i].userIDAdded).username || "Not found"}\nDate added: ${dateFormat(guild.words[i].dateAdded, "yyyy-mm-dd, h:MM:ss TT")}`);
    }
    // prettier-ignore
    let wordsEmbed = new Discord.MessageEmbed()
    .setTitle(`${msg.guild.name}'s blacklisted words`)
    .setColor("RED")
    .setThumbnail(bot.user.displayAvatarURL())
    .setTimestamp()
    .setDescription("All timestamps are in EST.\n```" + wordsArr.join("\n___\n") + "```")
    .setFooter(`Author: ${msg.author.username}#${msg.author.discriminator}`, msg.author.displayAvatarURL())
    msg.channel.send(wordsEmbed);
  },
};
