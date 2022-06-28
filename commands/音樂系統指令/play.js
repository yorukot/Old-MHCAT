const {
    Client,
    Message,
    MessageEmbed,
    MessageButton,
    MessageActionRow
} = require('discord.js');
const YouTube = require("youtube-sr").default;
module.exports = {
    name: '播放',
    aliases: ['p', 'P', 'play'],
    description: '播放音樂',
    // video: '',
    usage: '[輸入音樂!(支持 YT收尋|YT網址|YT清單)]',
    emoji: `<:chat:980101030232608828>`,

    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async (client, message, args, Discord) => {
        const lodding = new MessageEmbed().setTitle("<a:load:986319593444352071> | 我正在玩命幫你尋找音樂及播放!").setColor("GREEN")
        const lodding_msg = await message.reply({embeds: [lodding]})
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
        if(!message.member.voice.channel)return errors("你必須先進一個語音頻道!")
        const channel11 = message.guild.channels.cache.get(message.member.voice.channel.id);
        const hasPermissionInChannel0 = channel11
        .permissionsFor(message.guild.me)
        .has('SPEAK', false)
        const hasPermissionInChannel01 = channel11
        .permissionsFor(message.guild.me)
        .has('VIEW_CHANNEL', false)
        const hasPermissionInChannel02 = channel11
        .permissionsFor(message.guild.me)
        .has('CONNECT', false)
        if(!hasPermissionInChannel0 || !hasPermissionInChannel01 || !hasPermissionInChannel02){
            let ower = message.author
            const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | 我無法加入你的語音頻道或是說話!請通知管理員`).setDescription("我需要`說話`,`檢視頻道`,`連結`").setColor("RED");
            return message.channel.send({embeds:[embed]});
        }
        if (message.member.voice.channel && message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id){
            return errors('有其他人也在播音樂，請等他們播放完，或是你去叫他換你聽音樂!')
        }
        const get_member = args.slice(0).join(' ')
        if(!get_member)return errors("你必輸輸入你想聽得音樂(支持 YT收尋|YT網址|YT清單)")
        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");lodding_msg.edit({embeds: [embed]})}
        let guildQueue = client.player.getQueue(message.guild.id);
        if(guildQueue && guildQueue.songs.length > 2000){
            lodding_msg.delete()
            return errors("你的音樂太多啦!我沒辦法承受這麼多QWQ")
        }
        let queue = client.player.createQueue(message.guild.id, {
            data: {
                pause: false,
                channel: message.channel.id,
                random: false,
            }
        });
        if(get_member.includes("list")){
        await queue.join(message.member.voice.channel);
        let song = await queue.playlist(get_member).catch(_ => {
            console.error(_)
            setTimeout(() => {
                if(!guildQueue){    
                    queue.stop();
                    return errors("找不到這個音樂欸QWQ")

                }
            }, 1000);
        });
        }else{
        await queue.join(message.member.voice.channel);
        let song = await queue.play(get_member).catch(_ => {
            console.error(_)
            setTimeout(() => {
            if(!guildQueue){
                queue.stop();
                return errors("找不到這個音樂欸QWQ")
            }
        }, 1000);
        });
        }
        if(guildQueue){
            message.delete()
            return lodding_msg.delete()
        }
        let Q = client.player.getQueue(message.guild.id);
        const obj = Object.fromEntries(Q.player.queues);
        const id = Object.keys(obj)[0]
        const pause = "stopmusic"
        const emoji = "<:pause:986060615510544424>"
        const pausemsg = "暫停"
        const loop = "loopsongmusic"
        const loopemoji = "🔂"
        if(!Q.songs[0])return
        YouTube.getVideo(`${Q.songs[0].url}`, { limit: 1 })
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
<:loop1:981588918187229236> 目前重複播放狀態:${obj[id].repeatMode === 0 ? "無" : obj[id].repeatMode === 1 ? "單曲重播" : "清單重播"}   
<:shuffle1:981935542461685760> 隨機排序:無
            `)
        .setColor("RANDOM")
        .setTimestamp()
        .setFooter(
        `${message.author.tag}的音樂`,
        message.author.displayAvatarURL({
        dynamic: true
        }));
        lodding_msg.edit({embeds:[embed], components: [bt1, bt2,bt3]})
        })
        .catch(console.error);
        return
    }
}