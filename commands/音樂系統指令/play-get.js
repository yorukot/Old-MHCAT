const {
    Client,
    Message,
    MessageEmbed,
    MessageButton,
    MessageActionRow
} = require('discord.js');
const YouTube = require("youtube-sr").default;
module.exports = {
    name: '播放資訊',
    aliases: ['pi', 'playinfo', 'playui','PLAYINFO'],
    description: '創建私人頻道的訊息',
    // video: '',
    emoji: `<:chat:980101030232608828>`,

    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async (client, message, args, Discord) => {
        const channel111 = message.guild.channels.cache.get(message.channel.id);
        const hasPermissionInChannel = channel111
        .permissionsFor(message.guild.me)
        .has('SEND_MESSAGES', false)
        const hasPermissionInChannel1 = channel111
        .permissionsFor(message.guild.me)
        .has('VIEW_CHANNEL', false)
        const hasPermissionInChannel2 = channel111
        .permissionsFor(message.guild.me)
        .has('EMBED_LINKS', false)
        const hasPermissionInChannel3 = channel111
        .permissionsFor(message.guild.me)
        .has('READ_MESSAGE_HISTORY', false)
        if(!hasPermissionInChannel || !hasPermissionInChannel1 || !hasPermissionInChannel2 || !hasPermissionInChannel3){
            let ower = message.author
            const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | 我無法在這個頻道發送一般消息，請通知管理員`).setDescription("我需要`傳送訊息`,`檢視頻道`,`嵌入連結`,`讀取訊息歷史`").setColor("RED");
            return ower.send({embeds:[embed]});
        }
        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");message.reply({embeds: [embed]})}
        let guildQueue = client.player.getQueue(message.guild.id);
        if(!guildQueue) {return errors("播放已經結束囉!使用`/播放 音樂:`來進行播放音樂")}
        if (message.member.voice.channel && message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id){
            return errors('你不再這個播放清單的頻道裡，因此無法查看喔!')
        }
        const pause = guildQueue.data.pause === false ? "stopmusic" : "playmusic"
        const emoji = guildQueue.data.pause === false ? "<:pause:986060615510544424>" : "<:playbutton:986060391907999755>"
        const pausemsg = guildQueue.data.pause === false ? "暫停" : "播放"
        const loop = guildQueue.repeatMode === 0 ? "loopsongmusic" : guildQueue.repeatMode === 1 ? "looplistmusic" : "loopmusic"
        const loopemoji = guildQueue.repeatMode === 0 ? "🔂" : guildQueue.repeatMode === 1 ? "🔁" : "<a:error:980086028113182730>"
        const ProgressBar = guildQueue.createProgressBar({block:"━",arrow: "➤"}); 
        YouTube.getVideo(`${guildQueue.songs[0].url}`, { limit: 1 })
        YouTube.getVideo(`${guildQueue.songs[0].url}`, { limit: 1 })
        .then(x => {
            const bt1 = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setCustomId(pause)
                .setEmoji(emoji)
                .setLabel(pausemsg)
                .setStyle('PRIMARY'),
                new MessageButton()
                .setCustomId('randommusic')
                .setLabel('隨機排序')
                .setEmoji("<:shuffle1:981935542461685760>")
                .setStyle('SUCCESS'),
                new MessageButton()
                .setCustomId(loop)
                .setLabel("切換重複播放")
                .setEmoji(loopemoji)
                .setStyle('PRIMARY'),
            );
            const bt2 = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setCustomId("updatamusic")
                .setEmoji("<:reload:982146410134786071>")
                .setLabel('刷新')
                .setStyle('SUCCESS'),
                new MessageButton()
                .setCustomId('skipmusic')
                .setLabel('下一首')
                .setEmoji("<:nextbutton:981971559814135839>")
                .setStyle('PRIMARY'),
                new MessageButton()
                .setCustomId('leavemusic')
                .setLabel('中斷連線')
                .setEmoji("<:plug:981573581278433311>")
                .setStyle('DANGER'),
            );
            const bt3 = new MessageActionRow()
            .addComponents(
                new MessageButton()
                            .setCustomId("newmsgmusic")
                            .setEmoji("<:uparrow:981974801591713832>")
                            .setLabel('置頂訊息')
                            .setStyle('SECONDARY'),
                            new MessageButton()
                            .setCustomId("0getmusic")
                            .setEmoji("<:musicalbum:982146620336508958>")
                            .setLabel('取得播放清單')
                            .setStyle('PRIMARY'),
                            new MessageButton()
                            .setCustomId("lyricsmusic")
                            .setEmoji("<:filesandfolders:986636182349828166>")
                            .setLabel('取得歌詞')
                            .setStyle('PRIMARY'),
            );
            const embed = new MessageEmbed()
            .setAuthor(`${x.channel.name}`,x.channel.icon.url,`${x.channel.url}`)
            .setThumbnail(x.thumbnail.url)
            .setTitle(x.title)
            .setURL(`https://www.youtube.com/watch?v=${x.id}`)
            .setDescription(`<:videomarketing:982356519922331698> 影片長度:${x.durationFormatted} ┃ <:views:982267320502206524> 觀看數:${x.views}
<:loop1:981588918187229236> 目前重複播放狀態:${guildQueue.repeatMode === 0 ? "無" : guildQueue.repeatMode === 1 ? "單曲重播" : "清單重播"}   
<:shuffle1:981935542461685760> 隨機排序:${guildQueue.data.random === true ? "有" : "無"}
\`\`\`js
${ProgressBar}
\`\`\`
            `)
        .setColor("RANDOM")
        .setTimestamp()
        .setFooter(
        `${message.author.tag}的音樂`,
        message.author.displayAvatarURL({
        dynamic: true
        }));
        message.reply({embeds:[embed], components: [bt1, bt2,bt3]})
        })
        .catch(console.error);
        return
    }
}