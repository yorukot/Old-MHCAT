const {
    Collection,
    Client,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    WebhookClient,
    GatewayIntentBits,
    Partials 
} = require('discord.js');
const Cluster = require('discord-hybrid-sharding');
const { Player } = require("discord-music-player");
const client = new Client({
    partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.GuildScheduledEvent,
        Partials.Message,
        Partials.Reaction,
        Partials.ThreadMember,
        Partials.User,
    ],
    intents: [
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
    ],
    shards: Cluster.data.SHARD_LIST,
    shardCount: Cluster.data.TOTAL_SHARDS,
});

const player = new Player(client, {
    leaveOnEmpty: true,
});
client.player = player;


module.exports = client;

const {
    mongooseConnectionString,
    errorWebhook,
    color,
    emoji
} = require("./config.json");
const mongoose = require("mongoose");
mongoose.connect(mongooseConnectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: false
}).then(test => {
    const chalk = require('chalk')
    console.log(chalk.hex('#28FF28').bold('┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓'))
    console.log(chalk.hex('#28FF28').bold('┃          成功連線至資料庫            ┃'))
    console.log(chalk.hex('#28FF28').bold('┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛'))
}).catch(err => console.error(err))

client.commands = new Collection()
client.config = require('./config.json')
client.prefix = client.config.prefix
client.aliases = new Collection()
client.slash_commands = new Collection();
client.color = color
client.emoji = emoji
require('./handler/slash_commands');
require('./handler')(client);
require('./handler/channel_status');
require('./handler/gift');
require('./handler/cron');
require('./handler/system');

const chalk = require('chalk');
const { all } = require('bluebird');
const warning = chalk.hex('#CE0000');
const end_start = chalk.hex('#4DFFFF');
const errorwebhook = new WebhookClient({ url: errorWebhook })

process.on("unhandledRejection", (reason, p) => {
console.log(end_start("\n[🚩 崩潰通知] 未處理的拒絕:"));
console.log((reason.stack? reason.stack : reason))
console.log(end_start("=== 未處理的拒絕 ==="));
});
process.on("uncaughtException", (err, origin) => {
console.log(end_start("\n[🚩 崩潰通知] 未捕獲的異常"));
console.log(err)
console.log(origin)
console.log(end_start("=== 未捕獲的異常 ===\n"));
});
process.on("uncaughtExceptionMonitor", (err, origin) => {
console.log(end_start("\n[🚩 崩潰通知] 未捕獲的異常監視器"));
console.log(err)
console.log(origin)
console.log(end_start("=== 未捕獲的異常監視器 ===\n"));
});
process.on("beforeExit", (code) => {
console.log(end_start("\n[🚩 崩潰通知] 退出前"));
console.log(code)
console.log(end_start("=== 退出前 ===\n"));
});
process.on("exit", (code) => {
console.log(end_start("\n[🚩 崩潰通知] 退出"));
console.log(code)
console.log(end_start("=== 褪出 ===\n"));
});
process.on("multipleResolves", (type, promise, reason) => {
/*console.log(end_start("\n[🚩 崩潰通知] 多個解決方案"));
console.log(type)
console.log(promise)
console.log(reason)
console.log(end_start("=== 多個解決方案 ===\n"));*/
});

client.receiveBotInfo = async() => {
    function format(seconds){
        function pad(s){
          return (s < 10 ? '0' : '') + s;
        }
        var hours = Math.floor(seconds / (60*60));
        var minutes = Math.floor(seconds % (60*60) / 60);
        var seconds = Math.floor(seconds % 60);
        return pad(hours) + 'h' + pad(minutes) + 'm' + pad(seconds) + "s";
      }
    const cluster = client.cluster.id;
    const shards = client.cluster.ids.map(d => `${d.id}`).join(", ");
    const guild = client.guilds.cache.size;
    const members = client.guilds.cache.reduce((acc,guild)=> acc + guild.memberCount, 0)
    const ram = (process.memoryUsage().heapTotal/1024/1024).toFixed(0);
    const rssRam = (process.memoryUsage().rss/1024/1024).toFixed(0);
    const ping = client.ws.ping;
    const uptime = format(process.uptime())
    return { cluster, shards, guild, members, ram, rssRam, ping, uptime}

}
client.cluster = new Cluster.Client(client);

client.login(client.config.token)