const { errorEmbed } = require("../../modules/errorEmbed");
const { successEmbed } = require("../../modules/successEmbed");

module.exports = {
  name: "addword",
  description: "Add a blacklisted word that the bot will delete when said by a non-whitelisted user!",
  type: "Configuration",
  aliases: [],
  usage: `{}addword <word>`,
  async execute(bot, msg, args, Discord, db) {
    let guild = db.get(`guilds_${msg.guild.id}`);
    if (!msg.member.hasPermission("MANAGE_SERVER")) return errorEmbed(msg, "You don't have the required permissions to use this command!\nRequired permission: `MANAGE_SERVER`");
    if (!args[0]) return errorEmbed(msg, "You didn't provide a word to add!");
    if (guild.words.length >= 5) return errorEmbed(msg, "You can only blacklist a total of 5 words!\n`(Remove a word to blacklist another)`");
    if (args[0].length > 15) return errorEmbed(msg, "You cannot blacklist a word more than 15 characters!");
    if (guild.words.filter((word) => word.name == args[0].toLowerCase()).length >= 1) return errorEmbed(msg, "The word `" + args[0] + "` is already added to blacklisted words!");
    let wordObj = {
      name: args[0].toLowerCase(),
      userIDAdded: msg.author.id,
      dateAdded: Date.now(),
    };
    db.push(`guilds_${msg.guild.id}.words`, wordObj);
    successEmbed(msg, "Successfully added the word `" + args[0].toLowerCase() + "` to the blacklisted words!");
  },
};
