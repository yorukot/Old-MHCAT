const {
    Collection,
    Client,
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require('discord.js');
const fs = require("fs")
const lotter = require('./models/lotter.js')
const { Player } = require("discord-music-player");
const moment = require('moment')
const client = new Client({
    partials: ["CHANNEL"],
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
const Number = require('./models/Number.js')
// Logging System client
const logs = require('discord-logs');
logs(client, {
    debug: true
}); // thats all jk
// Mongo Connection
const {
    mongooseConnectionString
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
function getRandomArbitrary(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }
setInterval(() => {
setTimeout(() => {
    lotter.find({
        date: moment().utcOffset("+08:00").format('YYYYMMDDHH'),
    }, async (err, data) => {
     for(x = data.length-1; x > -1; x--) { 
        if(data[x].end === false) {
            const winner_array = []
            for(y = data[x].howmanywinner -1 ; y > -1; y--){
              const winner = data[x].member[getRandomArbitrary(0, data[x].member.length)]
              console.log(winner)
                if(winner === undefined){
                    y--
                }else{
                    winner_array.push(winner.id)
                }
            }
            const guild = client.guilds.cache.get(data[x].guild);
            let channel = guild.channels.cache.get(data[x].message_channel);
            console.log(channel.guild.me.displayHexColor)
            const winner_embed = new MessageEmbed()
            .setTitle("🎊恭喜中獎者!")
            .setDescription(`
            **🎉🎉恭喜:
            <@${winner_array.join('>\n<@')}>
            抽中: ${data[x].gift}
            **`)
            .setColor(channel.guild.me.displayHexColor)
            channel.send({content: `||<@${winner_array.join('><@')}>||`, embeds: [winner_embed]})
            data[x].collection.update(({guild: data[x].guild, id: data[x].id}), {$set: {end: true}})
            data[x].save()
         }else{
             return
         }
     }
    })
}, 3000);
}, 600000);
setInterval(() => {
    const dsadsadsadsa = client.guilds.cache.get("976879837471973416");
    const channeldsadsadsdasas = dsadsadsadsa.channels.cache.get("988428320087625738")
    channeldsadsadsdasas.setName(`🌐│伺服器:${client.guilds.cache.size}`)
            .catch(console.error);
    Number.find({
    }, async (err, data) => {
     if(!data) return;
     for(x = data.length - 1; x > -1; x--){
        const guild = client.guilds.cache.get(data[x].guild);
        if(guild){
        const members = guild.members.cache.filter(member => !member.user.bot);
        const bots = guild.members.cache.filter(member => member.user.bot);
        const all_channel = guild.channels.cache.filter((c) => c.type !== "GUILD_CATEGORY").size;
        const text_channel_number = guild.channels.cache.filter((c) => c.type === "GUILD_TEXT").size;
        const voice_channel_number = guild.channels.cache.filter((c) => c.type === "GUILD_VOICE").size;
        // memberNumber =================================================================================================================
        const get_memberNumber = guild.channels.cache.get(data[x].memberNumber)
        if(get_memberNumber){
        const channel_name = get_memberNumber.name
        if(channel_name.search(`${data[x].memberNumber_name}`) === -1){
            get_memberNumber.setName(`${guild.members.cache.size}`)
            .catch(console.error);
        }else{
            get_memberNumber.setName(channel_name.replace(`${data[x].memberNumber_name}`,`${guild.members.cache.size}`))
            .catch(console.error);
        }
        data[x].collection.update(({guild: guild.id,}), {$set: {memberNumber_name: `${guild.members.cache.size}`}})}
        // userNumber =================================================================================================================
        const get_userNumebr = guild.channels.cache.get(data[x].userNumber)
        if(get_userNumebr){
        const userNumber_channel = get_userNumebr.name
        if(userNumber_channel.search(`${data[x].userNumber_name}`) === -1){
            get_userNumebr.setName(`${members.size}`)
            .catch(console.error);
        }else{
            get_userNumebr.setName(userNumber_channel.replace(`${data[x].userNumber_name}`,`${members.size}`))
            .catch(console.error);
        }
        data[x].collection.update(({guild: guild.id,}), {$set: {userNumber_name: `${members.size}`}})}
        // botNumber =================================================================================================================
        const get_BotNumber = guild.channels.cache.get(data[x].BotNumber)
        if(get_BotNumber){
        const BotNumber_channel = get_BotNumber.name
        if(BotNumber_channel.search(`${data[x].BotNumber_name}`) === -1){
            get_BotNumber.setName(`${members.size}`)
            .catch(console.error);
        }else{
            get_BotNumber.setName(BotNumber_channel.replace(`${data[x].BotNumber_name}`,`${bots.size}`))
            .catch(console.error);
        }
        data[x].collection.update(({guild: guild.id,}), {$set: {BotNumber_name: `${bots.size}`}})}
        // channelNumber =================================================================================================================
        const get_channelNumber = guild.channels.cache.get(data[x].channelnumber)
        if(get_channelNumber){
        const channelnumber_channel = get_channelNumber.name
        if(channelnumber_channel.search(`${data[x].channelnumber_name}`) === -1){
            get_channelNumber.setName(`${members.size}`)
            .catch(console.error);
        }else{
            get_channelNumber.setName(channelnumber_channel.replace(`${data[x].channelnumber_name}`,`${all_channel}`))
            .catch(console.error);
        }
        data[x].collection.update(({guild: guild.id,}), {$set: {channelnumber_name: `${all_channel}`}})}
        // textnumber =================================================================================================================
        const get_textnumber = guild.channels.cache.get(data[x].textnumber)
        if(get_textnumber){
        const textnumber_channel = get_textnumber.name
        if(textnumber_channel.search(`${data[x].textnumber_name}`) === -1){
            get_textnumber.setName(`${members.size}`)
            .catch(console.error);
        }else{
            get_textnumber.setName(textnumber_channel.replace(`${data[x].textnumber_name}`,`${text_channel_number}`))
            .catch(console.error);
        }
        data[x].collection.update(({guild: guild.id,}), {$set: {textnumber_name: `${text_channel_number}`}})}
        // voicenumber =================================================================================================================
        const get_voicenumber = guild.channels.cache.get(data[x].voicenumber)
        if(get_voicenumber){
        const voicenumber_channel = get_voicenumber.name
        if(voicenumber_channel.search(`${data[x].voicenumber_name}`) === -1){
            get_voicenumber.setName(`${members.size}`)
            .catch(console.error);
        }else{
            get_voicenumber.setName(voicenumber_channel.replace(`${data[x].voicenumber_name}`,`${voice_channel_number}`))
            .catch(console.error);
        }
        data[x].collection.update(({guild: guild.id,}), {$set: {voicenumber_name: `${voice_channel_number}`}})}
     }}
    })
}, 600000);
client.login(client.config.token)