/*const client = require('../index')
const {
    MessageActionRow,
    MessageButton,
    Interaction,
    Permissions,
    DiscordAPIError,
    discord,
    Discord,
    Modal,
} = require('discord.js');
client.player
    .on('channelEmpty',  (queue) =>{
        const guild = client.guilds.cache.get(queue.guild.id)
        if(!guild) return
        const channel = guild.channels.cache.get(queue.data.channel)
        if(!channel) return
        channel.send("<a:116e10243c5900b92aeed21c8950c56e:981721909731422278> | 音樂頻道沒人囉，那我留著播歌給誰聽<:thinking:976315615742660608>")
    }
    )
    .on('songAdd',  (queue, song) =>{
        const guild = client.guilds.cache.get(queue.guild.id)
        if(!guild) return
        const channel = guild.channels.cache.get(queue.data.channel)
        if(!channel) return
        channel.send(`<:add1:981722904251215872> | 音樂${song}成功增加到播放清單!`)
    })
    .on('playlistAdd',  (queue, playlist) =>{
        const guild = client.guilds.cache.get(queue.guild.id)
        if(!guild) return
        const channel = guild.channels.cache.get(queue.data.channel)
        if(!channel) return
        channel.send(`<:add1:981722904251215872> ${playlist}中的${playlist.songs.length}首歌成功增加到播放清單!`)
    })
    .on('queueEnd',  (queue) =>{
        const guild = client.guilds.cache.get(queue.guild.id)
        if(!guild) return
        const channel = guild.channels.cache.get(queue.data.channel)
        if(!channel) return
        channel.send(`<a:116e10243c5900b92aeed21c8950c56e:981721909731422278> | 看來播放完了，我的工作做完成了，掰掰!`)
    })
    .on('songFirst',  (queue, song) =>
        console.log(`${song}.`))
    .on('clientDisconnect', (queue) =>{
        const guild = client.guilds.cache.get(queue.guild.id)
        if(!guild) return
        const channel = guild.channels.cache.get(queue.data.channel)
        if(!channel) return
        channel.send(`<a:crying53:981723944858025984> | 我被從頻道退出了欸!誰這麼慘忍QQ`)
    })
    .on('error', (error, queue) => {
        const guild = client.guilds.cache.get(queue.guild.id)
        if(!guild) return
        const channel = guild.channels.cache.get(queue.data.channel)
        if(!channel) return
        channel.send(`很抱歉!出現錯誤! ${error}`);
        console.log(`Error: ${error} in ${queue.guild.name}`);
    });*/