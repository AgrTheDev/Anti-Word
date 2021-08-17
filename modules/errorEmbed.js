const Discord = require("discord.js");

function errorEmbed(msg, desc) {
  // prettier-ignore
  let errorEmbed = new Discord.MessageEmbed()
  .setTitle("Error")
  .setDescription(desc)
  .setColor("RED")
  .setFooter(`Author: ${msg.author.username}#${msg.author.discriminator}`, msg.author.displayAvatarURL())
  .setTimestamp()
  msg.channel.send(errorEmbed);
}

module.exports = { errorEmbed };
