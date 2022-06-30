const text_xp = require("../models/text_xp.js")
const voice_xp = require("../models/voice_xp.js")

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
const {
    MessageEmbed
} = require('discord.js');
const client = require('../index');

client.on("interactionCreate", async (interaction) => {
    function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");interaction.reply({embeds: [embed],ephemeral: true})}
    if (interaction.isButton()) {
        if(interaction.customId.includes('chat_xp_scratch')){
            text_xp.find({
                guild: interaction.guild.id,
            }, async (err, data1) => {
                const array = []
                for (x = data1.length - 1; x > -1; x--) {
                    let b = 0
                    for (y = data1[x].leavel - 1; y > -1; y--) {
                        b = b + parseInt(Number(y) * (y / 3) * 100 + 100)
                        }
                    array.push({xp_totle: b + Number(data1[x].xp),
                                member: data1[x].member,
                                leavel: data1[x].leavel,
                                xp: data1[x].xp
                            });
                }
                        var byDate = array.slice(0);
                        byDate.sort(function(a,b) {
                            return b.xp_totle - a.xp_totle;
                        });
                        function nFormatter(num) {
                            if (num >= 1000000000) {
                               return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
                            }
                            if (num >= 1000000) {
                               return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
                            }
                            if (num >= 1000) {
                               return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
                            }
                            return num;
                       }
                       function bar(a, b){
                        let progress = Math.round((20 * a / b));
                        let emptyProgress = 20 - progress;
                        if(emptyProgress < 0){
                            return "出現了錯誤"
                        }else{
                            let block = "━"
                        let progressString = block.repeat(progress) + "➤" + '━'.repeat(emptyProgress);
                        return `\`[${progressString}]\``
                        }
                       }
                        const e = byDate.map(
                            (w, i) => `: <@${interaction.guild.members.cache.get(w.member) ? interaction.guild.members.cache.get(w.member).user.id : '該使用者已退出該伺服器'}>\n<:xp:990254386792005663>**總經驗:** \`${nFormatter(w.xp_totle)}\`\n<:levelup:990254382845157406>**等級:** \`${w.leavel}\`\n<:calendar:990254384812290048>**等級進度:**${bar(w.xp, parseInt(Number(w.leavel) * Number(w.leavel) /3 * 100  + 100))}\n`
                        )
                        const number = Number(interaction.customId.replace("chat_xp_scratch", ""))
                        const list1 = e[number*5 + 0] ? `❰第**${number*5 + 1 === 1 ? "<:medal:990203823970721863>" : number*5 + 1}**名❱ ${e[number*5 + 0]}` : ""
                        const list2 = e[number*5 + 1] ? `\n❰第**${number*5 + 2 === 2 ? "<:medal1:990203821085057075>" : number*5 + 2}**名❱ ${e[number*5 + 1]}` : ""
                        const list3 = e[number*5 + 2] ? `\n❰第**${number*5 + 3 === 3 ? "<:medal2:990203819096961104>" : number*5 + 3}**名❱ ${e[number*5 + 2]}` : ""
                        const list4 = e[number*5 + 3] ? `\n❰第**${number*5 + 4}**名❱ ${e[number*5 + 3]}` : ""
                        const list5 = e[number*5 + 4] ? `\n❰第**${number*5 + 5}**名❱ ${e[number*5 + 4]}` : ""
                        const embed = new MessageEmbed()
                        .setTitle(`<:podium:990199982760005663> | 以下是${interaction.guild.name}的聊天排行榜`)
                        .setDescription(`${list1}${list2}${list3}${list4}${list5}   
                總共:\`${e.length}\`筆資料
                第 \`${number + 1} / ${Math.ceil(e.length / 5)}\` 頁(按按鈕會自動更新喔!)
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
                            .setCustomId(`${number - 1}chat_xp_scratch`)
                            .setEmoji("<:previous:986067803910066256>")
                            .setLabel('上一頁')
                            .setStyle('SUCCESS')
                            .setDisabled(number - 1 === -1 ? true : false),
                        new MessageButton()
                            .setCustomId(`${number + 1}chat_xp_scratch`)
                            .setEmoji("<:next:986067802056167495>")
                            .setLabel('下一頁')
                            .setStyle('SUCCESS')
                            .setDisabled(number + 1 >= Math.ceil(e.length / 5) ? true : false),
                        );
                        if(number === 0){
                            interaction.update({embeds: [embed], components: [bt100]})
                        }else{
                            interaction.update({embeds: [embed], components: [bt100]})
                        }
                        return
                        
            })
    }        if(interaction.customId.includes('voice_xp_scratch')){
        voice_xp.find({
            guild: interaction.guild.id,
        }, async (err, data1) => {
            const array = []
            for (x = data1.length - 1; x > -1; x--) {
                let b = 0
                for (y = data1[x].leavel - 1; y > -1; y--) {
                    b = b + parseInt(Number(y) * (y / 2) * 100 + 100)
                    }
                array.push({xp_totle: b + Number(data1[x].xp),
                            member: data1[x].member,
                            leavel: data1[x].leavel,
                            xp: data1[x].xp
                        });
            }
                    var byDate = array.slice(0);
                    byDate.sort(function(a,b) {
                        return b.xp_totle - a.xp_totle;
                    });
                    function nFormatter(num) {
                        if (num >= 1000000000) {
                           return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
                        }
                        if (num >= 1000000) {
                           return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
                        }
                        if (num >= 1000) {
                           return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
                        }
                        return num;
                   }
                   function bar(a, b){
                    let progress = Math.round((20 * a / b));
                    let emptyProgress = 20 - progress;
                    if(emptyProgress < 0){
                        return "出現了錯誤"
                    }else{
                        let block = "━"
                    let progressString = block.repeat(progress) + "➤" + '━'.repeat(emptyProgress);
                    return `\`[${progressString}]\``
                    }
                   }
                    const e = byDate.map(
                        (w, i) => `: <@${interaction.guild.members.cache.get(w.member) ? interaction.guild.members.cache.get(w.member).user.id : '該使用者已退出該伺服器'}>\n<:xp:990254386792005663>**總經驗:** \`${nFormatter(w.xp_totle)}\`\n<:levelup:990254382845157406>**等級:** \`${w.leavel}\`\n<:calendar:990254384812290048>**等級進度:**${bar(w.xp, parseInt(Number(w.leavel) * Number(w.leavel) /2 * 100  + 100))}\n`
                    )
                    const number = Number(interaction.customId.replace("voice_xp_scratch", ""))
                    const list1 = e[number*5 + 0] ? `❰第**${number*5 + 1 === 1 ? "<:medal:990203823970721863>" : number*5 + 1}**名❱ ${e[number*5 + 0]}` : ""
                    const list2 = e[number*5 + 1] ? `\n❰第**${number*5 + 2 === 2 ? "<:medal1:990203821085057075>" : number*5 + 2}**名❱ ${e[number*5 + 1]}` : ""
                    const list3 = e[number*5 + 2] ? `\n❰第**${number*5 + 3 === 3 ? "<:medal2:990203819096961104>" : number*5 + 3}**名❱ ${e[number*5 + 2]}` : ""
                    const list4 = e[number*5 + 3] ? `\n❰第**${number*5 + 4}**名❱ ${e[number*5 + 3]}` : ""
                    const list5 = e[number*5 + 4] ? `\n❰第**${number*5 + 5}**名❱ ${e[number*5 + 4]}` : ""
                    const embed = new MessageEmbed()
                    .setTitle(`<:podium:990199982760005663> | 以下是${interaction.guild.name}的語音排行榜`)
                    .setDescription(`${list1}${list2}${list3}${list4}${list5}   
            總共:\`${e.length}\`筆資料
            第 \`${number + 1} / ${Math.ceil(e.length / 5)}\` 頁(按按鈕會自動更新喔!)
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
                        .setCustomId(`${number - 1}voice_xp_scratch`)
                        .setEmoji("<:previous:986067803910066256>")
                        .setLabel('上一頁')
                        .setStyle('SUCCESS')
                        .setDisabled(number - 1 === -1 ? true : false),
                    new MessageButton()
                        .setCustomId(`${number + 1}voice_xp_scratch`)
                        .setEmoji("<:next:986067802056167495>")
                        .setLabel('下一頁')
                        .setStyle('SUCCESS')
                        .setDisabled(number + 1 >= Math.ceil(e.length / 5) ? true : false),
                    );
                    if(number === 0){
                        interaction.update({embeds: [embed], components: [bt100]})
                    }else{
                        interaction.update({embeds: [embed], components: [bt100]})
                    }
                    return
                    
        })
}   
    }
})