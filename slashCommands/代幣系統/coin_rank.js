const coin = require("../../models/coin.js");

function checkURL(image) {
    return (image.match(/\.(jpg|png)$/) != null);
}
const {
    ApplicationCommandType,
    ButtonStyle,
    ApplicationCommandOptionType,
    ActionRowBuilder,
    SelectMenuBuilder,
    ButtonBuilder,
    EmbedBuilder,
    Collector,
    Discord,
    AttachmentBuilder,
    ModalBuilder,
    TextInputBuilder,
    PermissionsBitField
} = require('discord.js');
module.exports = {
    name: '代幣排行榜',
    cooldown: 10,
    description: '查詢代幣的排行榜',
    //video: 'https://mhcat.xyz/commands/announcement.html',
    emoji: `<:levelup:990254382845157406>`,
    run: async (client, interaction, options, perms) => {
        try {
            function errors(content) {
                const embed = new EmbedBuilder().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("Red");
                interaction.reply({
                    embeds: [embed]
                })
            }
            coin.find({
                guild: interaction.guild.id,
            }, async (err, data1) => {
                const array = []
                for (x = data1.length - 1; x > -1; x--) {
                    array.push({
                        today: data1[x].today,
                        member: data1[x].member,
                        coin: data1[x].coin,
                    });
                }
                var byDate = array.slice(0);
                byDate.sort(function (a, b) {
                    return b.coin - a.coin;
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
                const e = byDate.map(
                    (w, i) => `: <@${interaction.guild.members.cache.get(w.member) ? interaction.guild.members.cache.get(w.member).user.id : '該使用者已退出該伺服器'}>\n<:coins:997374177944281190> **總代幣:** \`${nFormatter(w.coin)}\`\n<:sign:997374180632825896> **今日簽到:**\`${w.today ? "已簽到" : "尚未簽到"}\`\n`
                )
                const number = 0
                const list1 = e[number * 5 + 0] ? `❰第**${number*5 + 1 === 1 ? "<:medal:990203823970721863>" : number*5 + 1}**名❱ ${e[number*5 + 0]}` : ""
                const list2 = e[number * 5 + 1] ? `\n❰第**${number*5 + 2 === 2 ? "<:medal1:990203821085057075>" : number*5 + 2}**名❱ ${e[number*5 + 1]}` : ""
                const list3 = e[number * 5 + 2] ? `\n❰第**${number*5 + 3 === 3 ? "<:medal2:990203819096961104>" : number*5 + 3}**名❱ ${e[number*5 + 2]}` : ""
                const list4 = e[number * 5 + 3] ? `\n❰第**${number*5 + 4}**名❱ ${e[number*5 + 3]}` : ""
                const list5 = e[number * 5 + 4] ? `\n❰第**${number*5 + 5}**名❱ ${e[number*5 + 4]}` : ""
                const embed = new EmbedBuilder()
                    .setTitle(`<:podium:990199982760005663> | 以下是${interaction.guild.name}的金錢排行榜`)
                    .setDescription(`${list1}${list2}${list3}${list4}${list5}
            總共:\`${e.length}\`筆資料
            第 \`${number + 1} / ${Math.ceil(e.length / 5)}\` 頁(按按鈕會自動更新喔!)
                    `)
                    .setColor("Random")
                    .setTimestamp()
                    .setFooter({
                        text: `${interaction.user.tag}的查詢`,
                        iconURL: interaction.user.displayAvatarURL({
                            dynamic: true
                        })
                    });
                const bt100 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${number - 1}coin_rank`)
                        .setEmoji("<:previous:986067803910066256>")
                        .setLabel('上一頁')
                        .setStyle(ButtonStyle.Success)
                        .setDisabled(number - 1 === -1 ? true : false),
                        new ButtonBuilder()
                        .setCustomId(`${number + 1}coin_rank`)
                        .setEmoji("<:next:986067802056167495>")
                        .setLabel('下一頁')
                        .setStyle(ButtonStyle.Success)
                        .setDisabled(number + 1 >= Math.ceil(e.length / 5) ? true : false),
                    );
                if (number === 0) {
                    interaction.reply({
                        embeds: [embed],
                        components: [bt100]
                    })
                } else {
                    interaction.channel.send({
                        embeds: [embed],
                        components: [bt100]
                    })
                    interaction.message.delete()
                }
                return

            })


        } catch (error) {
            const error_send = require('../../functions/error_send.js')
            error_send(error, interaction)
        }
    }
}