const { prefix } = require("../../config.json");
module.exports = {
  name: "help",
  description: "Shows a list of this bot's commands!",
  type: "Information",
  aliases: ["cmds"],
  usage: `{}help`,
  async execute(bot, msg, args, Discord, db) {
    let hasCommand = Boolean(bot.commands.get((args[0] || "o").toLowerCase()) || bot.commands.find((cmd) => cmd.aliases && cmd.aliases.includes((args[0] || "o").toLowerCase())));
    if (args.length == 0 || !hasCommand) {
      let commandsArray = [];
      let commandOptions = Array.from(bot.commands);
      for (let i = 0; i < commandOptions.length; i++) {
        commandsArray.push(commandOptions[i][0]);
      }
      // prettier-ignore
      let helpEmbed = new Discord.MessageEmbed()
      .setTitle(bot.user.username)
      .setThumbnail(bot.user.displayAvatarURL())
      .setColor("RED")
      .setDescription(`➤ ${bot.user.username} is a discord bot for filtering out certain words in a discord server!\n➤ Prefix: ${prefix}\n➤ ${prefix}help <command> for more info on commands!`)
      .addField("Commands:", "```" + commandsArray.join(", ") + "```")
      .setFooter(`Author: ${msg.author.username}#${msg.author.discriminator}`, msg.author.displayAvatarURL())
      .setTimestamp()
      msg.channel.send(helpEmbed);
    } else {
      let cmd = bot.commands.get(args[0].toLowerCase()) || bot.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(args[0].toLowerCase()));
      let aliasesLength = cmd.aliases.length;
      let aliasesText;
      aliasesLength == 0 ? (aliasesText = "None") : (aliasesText = "`" + cmd.aliases.join(", ") + "`");
      // prettier-ignore
      let commandEmbed = new Discord.MessageEmbed()
      .setTitle(cmd.name)
      .setThumbnail(bot.user.displayAvatarURL())
      .setColor("RED")
      .setDescription(cmd.description)
      .addField("Type:", cmd.type)
      .addField("Usage:", "`" + cmd.usage.replace("{}", prefix) + "`")
      .addField("Aliases:", aliasesText)
      msg.channel.send(commandEmbed);
    }
  },
};
