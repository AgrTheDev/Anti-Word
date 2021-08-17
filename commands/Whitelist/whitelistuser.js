let { errorEmbed } = require("../../modules/errorEmbed");
let { successEmbed } = require("../../modules/successEmbed");
let { prefix } = require("../../config.json");
module.exports = {
  name: "whitelistuser",
  description: "Whitelist a user that bypasses all blacklisted word restrictions!",
  type: "Configuration",
  aliases: [],
  usage: `{}whitelistuser <remove/add> <@user mention>`,
  async execute(bot, msg, args, Discord, db) {
    let guild = db.get(`guilds_${msg.guild.id}`);
    if (!msg.member.hasPermission("MANAGE_SERVER")) return errorEmbed(msg, "You don't have the required permissions to use this command!\nRequired permission: `MANAGE_SERVER`");
    if (args.length != 2) return errorEmbed(msg, "Wrong format!\nPlease make sure your command is valid!\nUsage: `" + this.usage.replace("{}", prefix) + "`.");
    if (!args[0] == "add" || !args[0] == "remove") return errorEmbed(msg, "Wrong format!\nPlease make sure your command look like `" + this.usage.replace("{}", prefix) + "`.");
    if (!args[1].startsWith("<@!") || !args[1].endsWith(">")) return errorEmbed(msg, "Wrong format!\nPlease make sure your command look like `" + this.usage.replace("{}", prefix) + "`.");
    if (args[0] == "add") {
      if (guild.whitelist.userIDs.length >= 2) return errorEmbed(msg, "You can only whitelist a total of 2 users!\n`(Remove a user to whitelist another)`");
      let wlUsers = db.get(`guilds_${msg.guild.id}.whitelist.userIDs`);
      if (!msg.guild.members.cache.has(args[1].replace("<@!", "").replace(">", ""))) return errorEmbed(msg, "That user is not in this server!");
      let user = msg.guild.members.cache.get(args[1].replace("<@!", "").replace(">", ""));
      if (wlUsers.includes(user.user.id)) return errorEmbed(msg, "That user is already whitelisted!");
      db.push(`guilds_${msg.guild.id}.whitelist.userIDs`, user.user.id);
      return successEmbed(msg, "Successfully added user `@" + user.user.username + "` to the whitelist!");
    }
    if (args[0] == "remove") {
      if (!msg.guild.members.cache.has(args[1].replace("<@!", "").replace(">", ""))) return errorEmbed(msg, "That user is not in this server!");
      let user = msg.guild.members.cache.get(args[1].replace("<@!", "").replace(">", ""));
      let wlUsers = db.get(`guilds_${msg.guild.id}.whitelist.userIDs`);
      if (!wlUsers.includes(user.user.id)) return errorEmbed(msg, "That user is not whitelisted!");
      wlUsers.splice(wlUsers.indexOf(user.user.id), 1);
      db.set(`guilds_${msg.guild.id}.whitelist.userIDs`, wlUsers);
      return successEmbed(msg, "Successfully removed user `@" + user.user.username + "` from the whitelist!");
    }
  },
};
