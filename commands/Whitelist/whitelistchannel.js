let { errorEmbed } = require("../../modules/errorEmbed");
let { successEmbed } = require("../../modules/successEmbed");
let { prefix } = require("../../config.json");
module.exports = {
  name: "whitelistchannel",
  description: "Whitelist a channel that bypasses all blacklisted word restrictions!",
  type: "Configuration",
  aliases: [],
  usage: `{}whitelistchannel <remove/add> <#channel>`,
  async execute(bot, msg, args, Discord, db) {
    let guild = db.get(`guilds_${msg.guild.id}`);
    if (!msg.member.hasPermission("MANAGE_SERVER")) return errorEmbed(msg, "You don't have the required permissions to use this command!\nRequired permission: `MANAGE_SERVER`");
    if (args.length != 2) return errorEmbed(msg, "Wrong format!\nPlease make sure your command is valid!\nUsage: `" + this.usage.replace("{}", prefix) + "`.");
    if (!args[0] == "add" || !args[0] == "remove") return errorEmbed(msg, "Wrong format!\nPlease make sure your command look like `" + this.usage.replace("{}", prefix) + "`.");
    if (!args[1].startsWith("<#") || !args[1].endsWith(">")) return errorEmbed(msg, "Wrong format!\nPlease make sure your command look like `" + this.usage.replace("{}", prefix) + "`.");
    if (args[0] == "add") {
      if (guild.whitelist.channelIDs.length >= 2) return errorEmbed(msg, "You can only whitelist a total of 2 channels!\n`(Remove a channel to whitelist another)`");
      let wlChannels = db.get(`guilds_${msg.guild.id}.whitelist.channelIDs`);
      if (!msg.guild.channels.cache.get(args[1].replace("<#", "").replace(">", ""))) return errorEmbed(msg, "That channel is not in this server!");
      let channel = msg.guild.channels.cache.get(args[1].replace("<#", "").replace(">", ""));
      if (wlChannels.includes(channel.id)) return errorEmbed(msg, "That channel is already whitelisted!");
      db.push(`guilds_${msg.guild.id}.whitelist.channelIDs`, channel.id);
      return successEmbed(msg, "Successfully added channel `#" + channel.name + "` to the whitelist!");
    }
    if (args[0] == "remove") {
      if (!msg.guild.channels.cache.get(args[1].replace("<#", "").replace(">", ""))) return errorEmbed(msg, "That channel is not in this server!");
      let channel = msg.guild.channels.cache.get(args[1].replace("<#", "").replace(">", ""));
      let wlChannels = db.get(`guilds_${msg.guild.id}.whitelist.channelIDs`);
      if (!wlChannels.includes(channel.id)) return errorEmbed(msg, "That channel is not whitelisted!");
      wlChannels.splice(wlChannels.indexOf(channel.id), 1);
      db.set(`guilds_${msg.guild.id}.whitelist.channelIDs`, wlChannels);
      return successEmbed(msg, "Successfully removed channel `#" + channel.name + "` from the whitelist!");
    }
  },
};
