let { errorEmbed } = require("../../modules/errorEmbed");
let { successEmbed } = require("../../modules/successEmbed");
let { prefix } = require("../../config.json");
module.exports = {
  name: "whitelistrole",
  description: "Whitelist a role that bypasses all blacklisted word restrictions!",
  type: "Configuration",
  aliases: [],
  usage: `{}whitelistrole <remove/add> <role mention>`,
  async execute(bot, msg, args, Discord, db) {
    let guild = db.get(`guilds_${msg.guild.id}`);
    if (!msg.member.hasPermission("MANAGE_SERVER")) return errorEmbed(msg, "You don't have the required permissions to use this command!\nRequired permission: `MANAGE_SERVER`");
    if (args.length != 2) return errorEmbed(msg, "Wrong format!\nPlease make sure your command is valid!\nUsage: `" + this.usage.replace("{}", prefix) + "`.");
    if (!args[0] == "add" || !args[0] == "remove") return errorEmbed(msg, "Wrong format!\nPlease make sure your command look like `" + this.usage.replace("{}", prefix) + "`.");
    if (!args[1].startsWith("<@&") || !args[1].endsWith(">")) return errorEmbed(msg, "Wrong format!\nPlease make sure your command look like `" + this.usage.replace("{}", prefix) + "`.");
    if (args[0] == "add") {
      if (guild.whitelist.roleIDs.length >= 2) return errorEmbed(msg, "You can only whitelist a total of 2 roles!\n`(Remove a role to whitelist another)`");
      let wlRoles = db.get(`guilds_${msg.guild.id}.whitelist.roleIDs`);
      if (!msg.guild.roles.cache.get(args[1].replace("<@&", "").replace(">", ""))) return errorEmbed(msg, "That role is not in this server!");
      let role = msg.guild.roles.cache.get(args[1].replace("<@&", "").replace(">", ""));
      if (wlRoles.includes(role.id)) return errorEmbed(msg, "That role is already whitelisted!");
      db.push(`guilds_${msg.guild.id}.whitelist.roleIDs`, role.id);
      return successEmbed(msg, "Successfully added role `" + role.name + "` to the whitelist!");
    }
    if (args[0] == "remove") {
      if (!msg.guild.roles.cache.get(args[1].replace("<@&", "").replace(">", ""))) return errorEmbed(msg, "That role is not in this server!");
      let role = msg.guild.roles.cache.get(args[1].replace("<@&", "").replace(">", ""));
      let wlRoles = db.get(`guilds_${msg.guild.id}.whitelist.roleIDs`);
      if (!wlRoles.includes(role.id)) return errorEmbed(msg, "That role is not whitelisted!");
      wlRoles.splice(wlRoles.indexOf(role.id), 1);
      db.set(`guilds_${msg.guild.id}.whitelist.roleIDs`, wlRoles);
      return successEmbed(msg, "Successfully removed role `" + role.name + "` from the whitelist!");
    }
  },
};
