const Discord = require("discord.js");
const fs = require("fs");
const { prefix, token } = require("./config.json");

var db = require("quick.db");

const { checkMessage } = require("./modules/checkMessage");

const bot = new Discord.Client();
bot.commands = new Discord.Collection();

loadCommands(bot.commands, "./commands");

function loadCommands(collection, directory) {
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const path = `${directory}/${file}`;

    if (file.endsWith(".js")) {
      const command = require(path);
      collection.set(command.name, command);
    } else if (fs.lstatSync(path).isDirectory()) {
      loadCommands(collection, path);
    }
  }
}

bot.on("message", async (msg) => {
  checkMessage(msg);
  if (msg.author.bot || !msg.content.startsWith(prefix)) return;
  const args = msg.content.slice(prefix.length).trim().split(" ");
  const cmdName = args.shift().toLowerCase();
  const cmd = bot.commands.get(cmdName) || bot.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(cmdName));
  if (!cmd) return;
  try {
    cmd.execute(bot, msg, args, Discord, db);
  } catch (err) {
    msg.reply(`There was an error when trying to run that command!`);
    console.log(err);
  }
});

bot.on("guildCreate", async (guild) => {
  let hasData = Boolean(db.servers.filter((e) => e.ID == guild.id).length);
  if (hasData) return;
  let guildObj = {
    ID: guild.id,
    whitelist: {
      channelIDs: [],
      roleIDs: [],
      userIDs: [],
    },
    words: [],
  };
  db.set(`guilds_${guild.id}`, guildObj);
});

bot.on("ready", () => {
  console.log(`Ready!`);
  bot.user.setActivity(`${prefix}help`);
});

bot.login(token);
