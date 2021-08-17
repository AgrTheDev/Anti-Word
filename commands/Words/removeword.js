const { errorEmbed } = require("../../modules/errorEmbed");
const { successEmbed } = require("../../modules/successEmbed");

module.exports = {
  name: "removeword",
  description: "Remove a blacklisted word that the bot won't delete when said by a non-whitelisted user!",
  type: "Configuration",
  aliases: [],
  usage: `{}removeword <word>`,
  async execute(bot, msg, args, Discord, db) {
    let guild = db.get(`guilds_${msg.guild.id}`);
    if (!msg.member.hasPermission("MANAGE_SERVER")) return errorEmbed(msg, "You don't have the required permissions to use this command!\nRequired permission: `MANAGE_SERVER`");
    if (!args[0]) return errorEmbed(msg, "You didn't provide a word to add!");
    if (guild.words.filter((word) => word.name == args[0].toLowerCase()).length == 0) return errorEmbed(msg, "The word `" + args[0] + "` isn't added to blacklisted words!");
    let words = db.get(`guilds_${msg.guild.id}.words`);
    words.splice(words.findIndex((word) => word.name == args[0].toLowerCase()));
    db.set(`guilds_${msg.guild.id}.words`, words);
    successEmbed(msg, "Successfully removed the word `" + args[0].toLowerCase() + "` from the blacklisted words!");
  },
};
