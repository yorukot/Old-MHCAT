/*const {
    MessageActionRow,
    MessageButton,
    Interaction,
    Permissions,
    DiscordAPIError,
    discord,
    Discord,
    Modal,
} = require('discord.js');
const {
    MessageEmbed
} = require('discord.js');
const client = require('../index');
const YouTube = require("youtube-sr").default;
const { RepeatMode } = require('discord-music-player');
client.on("interactionCreate", async (interaction) => {
    function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");interaction.reply({embeds: [embed],ephemeral: true})}
    function greate(content){const embed = new MessageEmbed().setTitle(`<a:greentick:980496858445135893> | ${content}`).setColor("GREEN");interaction.reply({embeds: [embed], ephemeral: true})}
    if (interaction.isButton()) {
        if(interaction.customId.includes('music')){
        if (interaction.member.voice.channel && interaction.guild.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.me.voice.channel.id){
            return errors('你不再這個播放清單的頻道裡，因此無法更改喔!')
        }
        let guildQueue = client.player.getQueue(interaction.guild.id);
        if(!guildQueue) return errors("播放已經結束囉!使用`/播放 音樂:`來進行播放音樂")
        function list(){
        let guildQueue = client.player.getQueue(interaction.guild.id);
        const obj = Object.fromEntries(guildQueue.player.queues);
        const id = Object.keys(obj)[0]
        const pause = guildQueue.data.pause === false ? "stopmusic" : "playmusic"
        const emoji = guildQueue.data.pause === false ? "<:pause:981972653688631328>" : "<:playbutton:981972653818667028>"
        const pausemsg = guildQueue.data.pause === false ? "暫停" : "播放"
        const loop = obj[id].repeatMode === 0 ? "loopsongmusic" : obj[id].repeatMode === 1 ? "looplistmusic" : "loopmusic"
        const loopemoji = obj[id].repeatMode === 0 ? "🔂" : obj[id].repeatMode === 1 ? "🔁" : "<a:error:980086028113182730>"
        const ProgressBar = guildQueue.createProgressBar(); 
        YouTube.search(`${guildQueue.nowPlaying}`, { limit: 1 })
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
                .setCustomId("getmusic")
                .setEmoji("<:musicalbum:982146620336508958>")
                .setLabel('取得播放清單')
                .setStyle('PRIMARY'),
            );
        const embed = new MessageEmbed()
        .setAuthor(`${x[0].channel.name}`,x[0].channel.icon.url,`${x[0].channel.url}`)
        .setThumbnail(x[0].thumbnail.url)
        .setTitle(x[0].title)
        .setURL(`https://www.youtube.com/watch?v=${x[0].id}`)
        .setDescription(`📀 影片長度:${x[0].durationFormatted}
🔁 重複播放狀態:${obj[id].repeatMode === 0 ? "無" : obj[id].repeatMode === 1 ? "單曲重播" : "清單重播"}
🔀 隨機排序:${guildQueue.data.random === true ? "有" : "無"}
\`\`\`js
${ProgressBar}
\`\`\`
        `)
        .setColor("RANDOM")
        .setTimestamp()
        .setFooter(
        `${interaction.user.tag}的音樂`,
        interaction.user.displayAvatarURL({
        dynamic: true
        }));
        interaction.message.edit({embeds:[embed], components: [bt1, bt2, bt3]})
        })
        .catch(console.error);}
            if(interaction.customId.includes('stopmusic')){
                guildQueue.setPaused(true);
                guildQueue.setData({
                        pause: true,
                });
                list()
                return greate("播放成功暫停!")
            }if(interaction.customId.includes('playmusic')){
                guildQueue.setPaused(false);
                guildQueue.setData({
                    pause: false,
            });
                list()
                return greate("播放成功播放!")
            }if(interaction.customId.includes('loopmusic')){
                guildQueue.setRepeatMode(RepeatMode.DISABLED)
                    list() 
                return greate("已清除所有重播效果!")
            }if(interaction.customId.includes('loopsongmusic')){
                guildQueue.setRepeatMode(RepeatMode.SONG);
                    list() 
                return greate("正在重複播放這首歌!")
            }if(interaction.customId.includes('looplistmusic')){
                guildQueue.setRepeatMode(RepeatMode.QUEUE)
                    list() 
                return greate("正在重複播放這個音樂!")
            }if(interaction.customId.includes('updatamusic')){
                    list()
                return greate("成功更新!")
            }if(interaction.customId.includes('randommusic')){
                guildQueue.shuffle();
                guildQueue.setData({
                    random: true,
            });
                    list() 
                return greate("清單成功隨機排序!")
            }if(interaction.customId.includes('leavemusic')){
                guildQueue.stop();
                    list() 
                return greate("已退出!")
            }if(interaction.customId.includes('skipmusic')){
                guildQueue.skip();
                    list()
                return greate("成功跳過一首歌!")
            }if(interaction.customId.includes('getmusic')){
                const number = Number(interaction.customId.replace("getmusic", ""))
        const list1 = guildQueue.songs[number*10 + 0] ? `❰ **${number*10 + 1}** ❱ ${guildQueue.songs[number*10 + 0].author} ━ [${guildQueue.songs[number*10 + 0].name}](${guildQueue.songs[number*10 + 0].url})` : ""
        const list2 = guildQueue.songs[number*10 + 1] ? `\n❰ **${number*10 + 2}** ❱ ${guildQueue.songs[number*10 + 1].author} ━ [${guildQueue.songs[number*10 + 1].name}](${guildQueue.songs[number*10 + 1].url})` : ""
        const list3 = guildQueue.songs[number*10 + 2] ? `\n❰ **${number*10 + 3}** ❱ ${guildQueue.songs[number*10 + 2].author} ━ [${guildQueue.songs[number*10 + 2].name}](${guildQueue.songs[number*10 + 2].url})` : ""
        const list4 = guildQueue.songs[number*10 + 3] ? `\n❰ **${number*10 + 4}** ❱ ${guildQueue.songs[number*10 + 3].author} ━ [${guildQueue.songs[number*10 + 3].name}](${guildQueue.songs[number*10 + 3].url})` : ""
        const list5 = guildQueue.songs[number*10 + 4] ? `\n❰ **${number*10 + 5}** ❱ ${guildQueue.songs[number*10 + 4].author} ━ [${guildQueue.songs[number*10 + 4].name}](${guildQueue.songs[number*10 + 4].url})` : ""
        const list6 = guildQueue.songs[number*10 + 5] ? `\n❰ **${number*10 + 6}** ❱ ${guildQueue.songs[number*10 + 5].author} ━ [${guildQueue.songs[number*10 + 5].name}](${guildQueue.songs[number*10 + 5].url})` : ""
        const list7 = guildQueue.songs[number*10 + 6] ? `\n❰ **${number*10 + 7}** ❱ ${guildQueue.songs[number*10 + 6].author} ━ [${guildQueue.songs[number*10 + 6].name}](${guildQueue.songs[number*10 + 6].url})` : ""
        const list8 = guildQueue.songs[number*10 + 7] ? `\n❰ **${number*10 + 8}** ❱ ${guildQueue.songs[number*10 + 7].author} ━ [${guildQueue.songs[number*10 + 7].name}](${guildQueue.songs[number*10 + 7].url})` : ""
        const list9 = guildQueue.songs[number*10 + 8] ? `\n❰ **${number*10 + 9}** ❱ ${guildQueue.songs[number*10 + 8].author} ━ [${guildQueue.songs[number*10 + 8].name}](${guildQueue.songs[number*10 + 8].url})` : ""
        const list10 = guildQueue.songs[number*10 + 9] ? `\n❰ **${number*10 + 10}** ❱ ${guildQueue.songs[number*10 + 9].author} ━ [${guildQueue.songs[number*10 + 9].name}](${guildQueue.songs[number*10 + 9].url})` : ""
        const embed = new MessageEmbed()
        .setTitle(`<a:loader:982197182906134558> | 播放清單`)
        .setDescription(`${list1}${list2}${list3}${list4}${list5}${list6}${list7}${list8}${list9}${list10}

總共:\`${guildQueue.songs.length}\`首歌
第 ${number + 1} \\ ${Math.ceil(guildQueue.songs.length / 10)} 頁(按按鈕會自動更新喔!)
        `)
        .setColor("RANDOM")
        .setTimestamp()
        .setFooter(
        `${interaction.user.tag}的查詢`,
        interaction.user.displayAvatarURL({
        dynamic: true
        }));
        const bt100 = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId(`${number - 1}getmusic`)
            .setEmoji("<:previous:982169459680768020>")
            .setLabel('上一頁')
            .setStyle('SUCCESS')
            .setDisabled(number - 1 === -1 ? true : false),
        new MessageButton()
            .setCustomId(`${number + 1}getmusic`)
            .setEmoji("<:next:982169460213436416>")
            .setLabel('下一頁')
            .setStyle('SUCCESS')
            .setDisabled(number + 1 >= Math.ceil(guildQueue.songs.length / 10) ? true : false),
        new MessageButton()
            .setCustomId(`deletemusic`)
            .setEmoji("<:delete:980100786560315402>")
            .setLabel('刪除這次查詢')
            .setStyle('DANGER')
        );
        if(number === 0){
            list()
            interaction.reply({embeds: [embed], components: [bt100]})
        }else{
            interaction.channel.send({embeds: [embed], components: [bt100]})
            interaction.message.delete()
        }
        return 
        }if(interaction.customId.includes('deletemusic')){
            return interaction.message.delete()
        }if(interaction.customId.includes('newmsgmusic')){
        let guildQueue = client.player.getQueue(interaction.guild.id);
        const obj = Object.fromEntries(guildQueue.player.queues);
        const id = Object.keys(obj)[0]
        const pause = guildQueue.data.pause === false ? "stopmusic" : "playmusic"
        const emoji = guildQueue.data.pause === false ? "<:pause:981972653688631328>" : "<:playbutton:981972653818667028>"
        const pausemsg = guildQueue.data.pause === false ? "暫停" : "播放"
        const loop = obj[id].repeatMode === 0 ? "loopsongmusic" : obj[id].repeatMode === 1 ? "looplistmusic" : "loopmusic"
        const loopemoji = obj[id].repeatMode === 0 ? "🔂" : obj[id].repeatMode === 1 ? "🔁" : "<a:error:980086028113182730>"
        const ProgressBar = guildQueue.createProgressBar();
        YouTube.search(`${guildQueue.nowPlaying}`, { limit: 1 })
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
                .setCustomId("getmusic")
                .setEmoji("<:musicalbum:982146620336508958>")
                .setLabel('取得播放清單')
                .setStyle('PRIMARY'),
            );
        const embed = new MessageEmbed()
        .setAuthor(`${x[0].channel.name}`,x[0].channel.icon.url,`${x[0].channel.url}`)
        .setThumbnail(x[0].thumbnail.url)
        .setTitle(x[0].title)
        .setURL(`https://www.youtube.com/watch?v=${x[0].id}`)
        .setDescription(`📀 影片長度:${x[0].durationFormatted}
🔁 目前重複播放狀態:${obj[id].repeatMode === 0 ? "無" : obj[id].repeatMode === 1 ? "單曲重播" : "清單重播"}
🔀 隨機排序:${guildQueue.data.random === true ? "有" : "無"}
\`\`\`js
${ProgressBar}
\`\`\`
        `)
        .setColor("RANDOM")
        .setTimestamp()
        .setFooter(
        `${interaction.user.tag}的音樂`,
        interaction.user.displayAvatarURL({
        dynamic: true
        }));
        interaction.message.channel.send({embeds:[embed], components: [bt1, bt2, bt3]})
        })
        .catch(console.error);
        interaction.message.delete()
            }
        }
    }
})*/