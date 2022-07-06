const {
    Collection,
    Client,
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    WebhookClient
} = require('discord.js');
const { Player } = require("discord-music-player");
const client = new Client({
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    intents: [
        "GUILDS",
        "GUILD_MEMBERS",
        "GUILD_BANS",
        "GUILD_INTEGRATIONS",
        "GUILD_WEBHOOKS",
        "GUILD_INVITES",
        "GUILD_VOICE_STATES",
        "GUILD_PRESENCES",
        "GUILD_MESSAGES",
        "GUILD_MESSAGE_REACTIONS",
        "GUILD_MESSAGE_TYPING",
        "DIRECT_MESSAGES",
        "DIRECT_MESSAGE_REACTIONS",
        "DIRECT_MESSAGE_TYPING",
    ],
});


const player = new Player(client, {
    leaveOnEmpty: true,
});
client.player = player;


module.exports = client;
const logs = require('discord-logs');
logs(client, {
    debug: true
});


const {
    mongooseConnectionString,
    errorWebhook
} = require("./config.json");
const mongoose = require("mongoose");
mongoose.connect(mongooseConnectionString, {
    useFindAndModify: true,
    useUnifiedTopology: true,
    autoIndex: false
}).then(console.log('|成功連線至資料庫!|'))

client.commands = new Collection()
client.config = require('./config.json')
client.prefix = client.config.prefix
client.aliases = new Collection()
client.slash_commands = new Collection();

require('./handler/slash_commands');
require('./handler')(client);
require('./handler/channel_status');
require('./handler/gift');
require('./handler/cron');



const chalk = require('chalk');
const warning = chalk.hex('#CE0000');
const end_start = chalk.hex('#4DFFFF');
const errorwebhook = new WebhookClient({ url: errorWebhook })

process.on("unhandledRejection", (reason, p) => {
console.log(end_start("\n[🚩 崩潰通知] 未處理的拒絕:"));
console.log(warning(reason.stack? String(reason.stack) : String(reason)))
console.log(end_start("=== 未處理的拒絕 ==="));
let embed = new MessageEmbed()
.setTitle("出現錯誤啦!!!")
.setDescription(`\`\`\`js\n${reason.stack? String(reason.stack) : String(reason)}\`\`\``)
.setColor("RED")
errorwebhook.send({
    embeds: [embed]
})
});
process.on("uncaughtException", (err, origin) => {
console.log(end_start("\n[🚩 崩潰通知] 未捕獲的異常"));
console.log(warning(err))
console.log(end_start("=== 未捕獲的異常 ===\n"));
let embed = new MessageEmbed()
.setTitle("出現錯誤啦!!!")
.setDescription(`\`\`\`js\n${err.stack? String(err.stack) : String(err)}\`\`\``)
.setColor("RED")
errorwebhook.send({
    embeds: [embed]
})
});
process.on("uncaughtExceptionMonitor", (err, origin) => {
console.log(end_start("\n[🚩 崩潰通知] 未捕獲的異常監視器"));
console.log(warning(err))
console.log(end_start("=== 未捕獲的異常監視器 ===\n"));
let embed = new MessageEmbed()
.setTitle("出現錯誤啦!!!")
.setDescription(`\`\`\`js\n${err.stack? String(err.stack) : String(err)}\`\`\``)
.setColor("RED")
errorwebhook.send({
    embeds: [embed]
})
});
process.on("beforeExit", (code) => {
console.log(end_start("\n[🚩 崩潰通知] 退出前"));
console.log(warning(code))
console.log(end_start("=== 退出前 ===\n"));
let embed = new MessageEmbed()
.setTitle("出現錯誤啦!!!")
.setDescription(`\`\`\`js\n${code}\`\`\``)
.setColor("RED")
errorwebhook.send({
    embeds: [embed]
})
});
process.on("exit", (code) => {
console.log(end_start("\n[🚩 崩潰通知] 退出"));
console.log(warning(code))
console.log(end_start("=== 褪出 ===\n"));
let embed = new MessageEmbed()
.setTitle("出現錯誤啦!!!")
.setDescription("\`\`\`js\n" + code + "\`\`\`")
.setColor("RED")
errorwebhook.send({
    embeds: [embed]
})
});
process.on("multipleResolves", (type, promise, reason) => {
console.log(end_start("\n[🚩 崩潰通知] 多個解決方案"));
console.log(warning(type))
console.log(warning(promise))
console.log(warning(reason))
console.log(end_start("=== 多個解決方案 ===\n"));
let embed = new MessageEmbed()
.setTitle("出現錯誤啦!!!")
.setDescription(`\`\`\`js\n${type}\n${promise}\n${reason}\`\`\``)
.setColor("RED")
errorwebhook.send({
    embeds: [embed]
})
});

client.login(client.config.token)