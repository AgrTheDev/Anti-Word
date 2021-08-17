const Discord = require("discord.js");

function successEmbed(msg, desc) {
  // prettier-ignore
  let successEmbed = new Discord.MessageEmbed()
  .setTitle("Success")
  .setDescription(desc)
  .setColor("GREEN")
  .setFooter(`Author: ${msg.author.username}#${msg.author.discriminator}`, msg.author.displayAvatarURL())
  .setTimestamp()
  msg.channel.send(successEmbed);
}

module.exports = { successEmbed };
