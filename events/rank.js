const text_xp = require("../models/text_xp.js")
const voice_xp = require("../models/voice_xp.js")

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
const client = require('../index');

client.on("interactionCreate", async (interaction) => {
    function errors(content) {
        const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");
        interaction.reply({
            embeds: [embed],
            ephemeral: true
        })
    }
    if (interaction.isButton()) {
        if (interaction.customId.includes('chat_xp_scratch')) {
            text_xp.find({
                guild: interaction.guild.id,
            }, async (err, data1) => {
                const array = []
                for (x = data1.length - 1; x > -1; x--) {
                    let b = 0
                    for (y = data1[x].leavel - 1; y > -1; y--) {
                        b = b + parseInt(Number(y) * (y / 3) * 100 + 100)
                    }
                    array.push({
                        xp_totle: b + Number(data1[x].xp),
                        member: data1[x].member,
                        leavel: data1[x].leavel,
                        xp: data1[x].xp
                    });
                }
                var byDate = array.slice(0);
                byDate.sort(function (a, b) {
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

                function bar(a, b) {
                    let progress = Math.round((20 * a / b));
                    let emptyProgress = 20 - progress;
                    if (emptyProgress < 0) {
                        return "出現了錯誤"
                    } else {
                        let block = "━"
                        let progressString = block.repeat(progress) + "➤" + '━'.repeat(emptyProgress);
                        return `\`[${progressString}]\``
                    }
                }
                const e = byDate.map(
                    (w, i) => `: <@${interaction.guild.members.cache.get(w.member) ? interaction.guild.members.cache.get(w.member).user.id : '該使用者已退出該伺服器'}>\n<:xp:990254386792005663>**總經驗:** \`${nFormatter(w.xp_totle)}\`\n<:levelup:990254382845157406>**等級:** \`${w.leavel}\`\n<:calendar:990254384812290048>**等級進度:**${bar(w.xp, parseInt(Number(w.leavel) * Number(w.leavel) /3 * 100  + 100))}\n`
                )
                const number = Number(interaction.customId.replace("chat_xp_scratch", ""))
                const list1 = e[number * 5 + 0] ? `❰第**${number*5 + 1 === 1 ? "<:medal:990203823970721863>" : number*5 + 1}**名❱ ${e[number*5 + 0]}` : ""
                const list2 = e[number * 5 + 1] ? `\n❰第**${number*5 + 2 === 2 ? "<:medal1:990203821085057075>" : number*5 + 2}**名❱ ${e[number*5 + 1]}` : ""
                const list3 = e[number * 5 + 2] ? `\n❰第**${number*5 + 3 === 3 ? "<:medal2:990203819096961104>" : number*5 + 3}**名❱ ${e[number*5 + 2]}` : ""
                const list4 = e[number * 5 + 3] ? `\n❰第**${number*5 + 4}**名❱ ${e[number*5 + 3]}` : ""
                const list5 = e[number * 5 + 4] ? `\n❰第**${number*5 + 5}**名❱ ${e[number*5 + 4]}` : ""
                const embed = new EmbedBuilder()
                    .setTitle(`<:podium:990199982760005663> | 以下是${interaction.guild.name}的聊天排行榜`)
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
                        .setCustomId(`${number - 1}chat_xp_scratch`)
                        .setEmoji("<:previous:986067803910066256>")
                        .setLabel('上一頁')
                        .setStyle(ButtonStyle.Success)
                        .setDisabled(number - 1 === -1 ? true : false),
                        new ButtonBuilder()
                        .setCustomId(`${number + 1}chat_xp_scratch`)
                        .setEmoji("<:next:986067802056167495>")
                        .setLabel('下一頁')
                        .setStyle(ButtonStyle.Success)
                        .setDisabled(number + 1 >= Math.ceil(e.length / 5) ? true : false),
                    );
                if (number === 0) {
                    interaction.update({
                        embeds: [embed],
                        components: [bt100]
                    })
                } else {
                    interaction.update({
                        embeds: [embed],
                        components: [bt100]
                    })
                }
                return

            })
        }
        if (interaction.customId.includes('voice_xp_scratch')) {
            voice_xp.find({
                guild: interaction.guild.id,
            }, async (err, data1) => {
                const array = []
                for (x = data1.length - 1; x > -1; x--) {
                    let b = 0
                    for (y = data1[x].leavel - 1; y > -1; y--) {
                        b = b + parseInt(Number(y) * (y / 2) * 100 + 100)
                    }
                    array.push({
                        xp_totle: b + Number(data1[x].xp),
                        member: data1[x].member,
                        leavel: data1[x].leavel,
                        xp: data1[x].xp
                    });
                }
                var byDate = array.slice(0);
                byDate.sort(function (a, b) {
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

                function bar(a, b) {
                    let progress = Math.round((20 * a / b));
                    let emptyProgress = 20 - progress;
                    if (emptyProgress < 0) {
                        return "出現了錯誤"
                    } else {
                        let block = "━"
                        let progressString = block.repeat(progress) + "➤" + '━'.repeat(emptyProgress);
                        return `\`[${progressString}]\``
                    }
                }
                const e = byDate.map(
                    (w, i) => `: <@${interaction.guild.members.cache.get(w.member) ? interaction.guild.members.cache.get(w.member).user.id : '該使用者已退出該伺服器'}>\n<:xp:990254386792005663>**總經驗:** \`${nFormatter(w.xp_totle)}\`\n<:levelup:990254382845157406>**等級:** \`${w.leavel}\`\n<:calendar:990254384812290048>**等級進度:**${bar(w.xp, parseInt(Number(w.leavel) * Number(w.leavel) /2 * 100  + 100))}\n`
                )
                const number = Number(interaction.customId.replace("voice_xp_scratch", ""))
                const list1 = e[number * 5 + 0] ? `❰第**${number*5 + 1 === 1 ? "<:medal:990203823970721863>" : number*5 + 1}**名❱ ${e[number*5 + 0]}` : ""
                const list2 = e[number * 5 + 1] ? `\n❰第**${number*5 + 2 === 2 ? "<:medal1:990203821085057075>" : number*5 + 2}**名❱ ${e[number*5 + 1]}` : ""
                const list3 = e[number * 5 + 2] ? `\n❰第**${number*5 + 3 === 3 ? "<:medal2:990203819096961104>" : number*5 + 3}**名❱ ${e[number*5 + 2]}` : ""
                const list4 = e[number * 5 + 3] ? `\n❰第**${number*5 + 4}**名❱ ${e[number*5 + 3]}` : ""
                const list5 = e[number * 5 + 4] ? `\n❰第**${number*5 + 5}**名❱ ${e[number*5 + 4]}` : ""
                const embed = new EmbedBuilder()
                    .setTitle(`<:podium:990199982760005663> | 以下是${interaction.guild.name}的語音排行榜`)
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
                        .setCustomId(`${number - 1}voice_xp_scratch`)
                        .setEmoji("<:previous:986067803910066256>")
                        .setLabel('上一頁')
                        .setStyle(ButtonStyle.Success)
                        .setDisabled(number - 1 === -1 ? true : false),
                        new ButtonBuilder()
                        .setCustomId(`${number + 1}voice_xp_scratch`)
                        .setEmoji("<:next:986067802056167495>")
                        .setLabel('下一頁')
                        .setStyle(ButtonStyle.Success)
                        .setDisabled(number + 1 >= Math.ceil(e.length / 5) ? true : false),
                    );
                if (number === 0) {
                    interaction.update({
                        embeds: [embed],
                        components: [bt100]
                    })
                } else {
                    interaction.update({
                        embeds: [embed],
                        components: [bt100]
                    })
                }
                return

            })
        } else if (interaction.customId.includes('coin_rank')) {
            const coin = require('../models/coin.js')
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
                const number = Number(interaction.customId.replace("coin_rank", ""))
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
                    interaction.update({
                        embeds: [embed],
                        components: [bt100]
                    })
                } else {
                    interaction.update({
                        embeds: [embed],
                        components: [bt100]
                    })
                }
                return

            })
        }
        if (interaction.customId.includes('text_leave_role')) {
            let chat_role = require('../models/chat_role.js');
            const number = Number(interaction.customId.replace('text_leave_role', ''))
                    chat_role.find({
                        guild: interaction.channel.guild.id,
                    }, async (err, data) => {
                        const data1 = []
                        for (let i = 0; i < data.length; i++) {
                            const role = interaction.guild.roles.cache.get(data[i].role)
                            if (!role) {
                                data[i].delete()
                            }
                            data1.push(data[i])
                        }
                        setTimeout(() => {
                        let testtestestesteteste = []
                        let a1 = data1[number * 12 + 0] ? testtestestesteteste.push({
                            name: `第${number*12 + 1}個:`,
                            value: `<:levelup:990254382845157406> **等級:**` + `\`${data1[number * 12 + 0].leavel}\`\n<:roleplaying:985945121264635964> **身分組:**<@&${data1[number * 12 + 0].role}>` + `\n${client.emoji.delete} **是否自動刪除身分組:**${data1[number * 12 + 0].delete_when_not}`,
                            inline: true
                        }) : null
                        let a2 = data1[number * 12 + 1] ? testtestestesteteste.push({
                            name: `第${number*12 + 2}個:`,
                            value: `<:levelup:990254382845157406> **等級:**` + `\`${data1[number * 12 + 1].leavel}\`\n<:roleplaying:985945121264635964> **身分組:**<@&${data1[number * 12 + 1].role}>` + `\n${client.emoji.delete} **是否自動刪除身分組:**${data1[number * 12 + 1].delete_when_not}`,
                            inline: true
                        }) : null
                        let a3 = data1[number * 12 + 2] ? testtestestesteteste.push({
                            name: `第${number*12 + 3}個:`,
                            value: `<:levelup:990254382845157406> **等級:**` + `\`${data1[number * 12 + 2].leavel}\`\n<:roleplaying:985945121264635964> **身分組:**<@&${data1[number * 12 + 2].role}>` + `\n${client.emoji.delete} **是否自動刪除身分組:**${data1[number * 12 + 2].delete_when_not}`,
                            inline: true
                        }) : null
                        let a4 = data1[number * 12 + 3] ? testtestestesteteste.push({
                            name: `第${number*12 + 4}個:`,
                            value: `<:levelup:990254382845157406> **等級:**` + `\`${data1[number * 12 + 3].leavel}\`\n<:roleplaying:985945121264635964> **身分組:**<@&${data1[number * 12 + 3].role}>` + `\n${client.emoji.delete} **是否自動刪除身分組:**${data1[number * 12 + 3].delete_when_not}`,
                            inline: true
                        }) : null
                        let a5 = data1[number * 12 + 4] ? testtestestesteteste.push({
                            name: `第${number*12 + 5}個:`,
                            value: `<:levelup:990254382845157406> **等級:**` + `\`${data1[number * 12 + 4].leavel}\`\n<:roleplaying:985945121264635964> **身分組:**<@&${data1[number * 12 + 4].role}>` + `\n${client.emoji.delete} **是否自動刪除身分組:**${data1[number * 12 + 4].delete_when_not}`,
                            inline: true
                        }) : null
                        let a6 = data1[number * 12 + 12] ? testtestestesteteste.push({
                            name: `第${number*12 + 6}個:`,
                            value: `<:levelup:990254382845157406> **等級:**` + `\`${data1[number * 5 + 12].leavel}\`\n<:roleplaying:985945121264635964> **身分組:**<@&${data1[number * 12 + 5].role}>` + `\n${client.emoji.delete} **是否自動刪除身分組:**${data1[number * 12 + 5].delete_when_not}`,
                            inline: true
                        }) : null
                        let a7 = data1[number * 12 + 6] ? testtestestesteteste.push({
                            name: `第${number*12 + 7}個:`,
                            value: `<:levelup:990254382845157406> **等級:**` + `\`${data1[number * 12 + 6].leavel}\`\n<:roleplaying:985945121264635964> **身分組:**<@&${data1[number * 12 + 6].role}>` + `\n${client.emoji.delete} **是否自動刪除身分組:**${data1[number * 12 + 6].delete_when_not}`,
                            inline: true
                        }) : null
                        let a8 = data1[number * 12 + 7] ? testtestestesteteste.push({
                            name: `第${number*12 + 8}個:`,
                            value: `<:levelup:990254382845157406> **等級:**` + `\`${data1[number * 12 + 7].leavel}\`\n<:roleplaying:985945121264635964> **身分組:**<@&${data1[number * 12 + 7].role}>` + `\n${client.emoji.delete} **是否自動刪除身分組:**${data1[number * 12 + 7].delete_when_not}`,
                            inline: true
                        }) : null
                        let a9 = data1[number * 12 + 8] ? testtestestesteteste.push({
                            name: `第${number*12 + 9}個:`,
                            value: `<:levelup:990254382845157406> **等級:**` + `\`${data1[number * 12 + 8].leavel}\`\n<:roleplaying:985945121264635964> **身分組:**<@&${data1[number * 12 + 8].role}>` + `\n${client.emoji.delete} **是否自動刪除身分組:**${data1[number * 12 + 8].delete_when_not}`,
                            inline: true
                        }) : null
                        let a10 = data1[number * 12 + 9] ? testtestestesteteste.push({
                            name: `第${number*12 + 10}個:`,
                            value: `<:levelup:990254382845157406> **等級:**` + `\`${data1[number * 12 + 9].leavel}\`\n<:roleplaying:985945121264635964> **身分組:**<@&${data1[number * 12 + 9].role}>` + `\n${client.emoji.delete} **是否自動刪除身分組:**${data1[number * 12 + 9].delete_when_not}`,
                            inline: true
                        }) : null
                        let a11 = data1[number * 12 + 10] ? testtestestesteteste.push({
                            name: `第${number*12 + 11}個:`,
                            value: `<:levelup:990254382845157406> **等級:**` + `\`${data1[number * 12 + 10].leavel}\`\n<:roleplaying:985945121264635964> **身分組:**<@&${data1[number * 12 + 10].role}>` + `\n${client.emoji.delete} **是否自動刪除身分組:**${data1[number * 12 + 10].delete_when_not}`,
                            inline: true
                        }) : null
                        let a12 = data1[number * 12 + 11] ? testtestestesteteste.push({
                            name: `第${number*12 + 12}個:`,
                            value: `<:levelup:990254382845157406> **等級:**` + `\`${data1[number * 12 + 11].leavel}\`\n<:roleplaying:985945121264635964> **身分組:**<@&${data1[number * 12 + 11].role}>` + `\n${client.emoji.delete} **是否自動刪除身分組:**${data1[number * 12 + 11].delete_when_not}`,
                            inline: true
                        }) : null

                        const bt100 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${number - 1}text_leave_role`)
                        .setEmoji("<:previous:986067803910066256>")
                        .setLabel('上一頁')
                        .setStyle(ButtonStyle.Success)
                        .setDisabled(number - 1 === -1 ? true : false),
                        new ButtonBuilder()
                        .setCustomId(`${number + 1}text_leave_role`)
                        .setEmoji("<:next:986067802056167495>")
                        .setLabel('下一頁')
                        .setStyle(ButtonStyle.Success)
                        .setDisabled(number + 1 >= Math.ceil(data1.length / 12) ? true : false),
                    );
                        interaction.update({
                            embeds: [
                                new EmbedBuilder()
                                .setTitle(`${client.emoji.channel} 以下是聊天經驗身分組的所有設定!!`)
                                .setFields(testtestestesteteste)
                                .setColor(`Random`)
                                .setFooter({text: `總共: ${data1.length} 筆資料\n第 ${number + 1} / ${Math.ceil(data1.length / 12)} 頁(按按鈕會自動更新喔!`})
                            ],
                            components: [bt100]
                        })
                    }, 1000);
                    })
                }
        if (interaction.customId.includes('voice_leave_role')) {
            let chat_role = require('../models/voice_role.js');
            const number = Number(interaction.customId.replace('voice_leave_role', ''))
                    chat_role.find({
                        guild: interaction.channel.guild.id,
                    }, async (err, data) => {
                        const data1 = []
                        for (let i = 0; i < data.length; i++) {
                            const role = interaction.guild.roles.cache.get(data[i].role)
                            if (!role) {
                                data[i].delete()
                            }
                            data1.push(data[i])
                        }
                        setTimeout(() => {
                        let testtestestesteteste = []
                        let a1 = data1[number * 12 + 0] ? testtestestesteteste.push({
                            name: `第${number*12 + 1}個:`,
                            value: `<:levelup:990254382845157406> **等級:**` + `\`${data1[number * 12 + 0].leavel}\`\n<:roleplaying:985945121264635964> **身分組:**<@&${data1[number * 12 + 0].role}>` + `\n${client.emoji.delete} **是否自動刪除身分組:**${data1[number * 12 + 0].delete_when_not}`,
                            inline: true
                        }) : null
                        let a2 = data1[number * 12 + 1] ? testtestestesteteste.push({
                            name: `第${number*12 + 2}個:`,
                            value: `<:levelup:990254382845157406> **等級:**` + `\`${data1[number * 12 + 1].leavel}\`\n<:roleplaying:985945121264635964> **身分組:**<@&${data1[number * 12 + 1].role}>` + `\n${client.emoji.delete} **是否自動刪除身分組:**${data1[number * 12 + 1].delete_when_not}`,
                            inline: true
                        }) : null
                        let a3 = data1[number * 12 + 2] ? testtestestesteteste.push({
                            name: `第${number*12 + 3}個:`,
                            value: `<:levelup:990254382845157406> **等級:**` + `\`${data1[number * 12 + 2].leavel}\`\n<:roleplaying:985945121264635964> **身分組:**<@&${data1[number * 12 + 2].role}>` + `\n${client.emoji.delete} **是否自動刪除身分組:**${data1[number * 12 + 2].delete_when_not}`,
                            inline: true
                        }) : null
                        let a4 = data1[number * 12 + 3] ? testtestestesteteste.push({
                            name: `第${number*12 + 4}個:`,
                            value: `<:levelup:990254382845157406> **等級:**` + `\`${data1[number * 12 + 3].leavel}\`\n<:roleplaying:985945121264635964> **身分組:**<@&${data1[number * 12 + 3].role}>` + `\n${client.emoji.delete} **是否自動刪除身分組:**${data1[number * 12 + 3].delete_when_not}`,
                            inline: true
                        }) : null
                        let a5 = data1[number * 12 + 4] ? testtestestesteteste.push({
                            name: `第${number*12 + 5}個:`,
                            value: `<:levelup:990254382845157406> **等級:**` + `\`${data1[number * 12 + 4].leavel}\`\n<:roleplaying:985945121264635964> **身分組:**<@&${data1[number * 12 + 4].role}>` + `\n${client.emoji.delete} **是否自動刪除身分組:**${data1[number * 12 + 4].delete_when_not}`,
                            inline: true
                        }) : null
                        let a6 = data1[number * 12 + 12] ? testtestestesteteste.push({
                            name: `第${number*12 + 6}個:`,
                            value: `<:levelup:990254382845157406> **等級:**` + `\`${data1[number * 5 + 12].leavel}\`\n<:roleplaying:985945121264635964> **身分組:**<@&${data1[number * 12 + 5].role}>` + `\n${client.emoji.delete} **是否自動刪除身分組:**${data1[number * 12 + 5].delete_when_not}`,
                            inline: true
                        }) : null
                        let a7 = data1[number * 12 + 6] ? testtestestesteteste.push({
                            name: `第${number*12 + 7}個:`,
                            value: `<:levelup:990254382845157406> **等級:**` + `\`${data1[number * 12 + 6].leavel}\`\n<:roleplaying:985945121264635964> **身分組:**<@&${data1[number * 12 + 6].role}>` + `\n${client.emoji.delete} **是否自動刪除身分組:**${data1[number * 12 + 6].delete_when_not}`,
                            inline: true
                        }) : null
                        let a8 = data1[number * 12 + 7] ? testtestestesteteste.push({
                            name: `第${number*12 + 8}個:`,
                            value: `<:levelup:990254382845157406> **等級:**` + `\`${data1[number * 12 + 7].leavel}\`\n<:roleplaying:985945121264635964> **身分組:**<@&${data1[number * 12 + 7].role}>` + `\n${client.emoji.delete} **是否自動刪除身分組:**${data1[number * 12 + 7].delete_when_not}`,
                            inline: true
                        }) : null
                        let a9 = data1[number * 12 + 8] ? testtestestesteteste.push({
                            name: `第${number*12 + 9}個:`,
                            value: `<:levelup:990254382845157406> **等級:**` + `\`${data1[number * 12 + 8].leavel}\`\n<:roleplaying:985945121264635964> **身分組:**<@&${data1[number * 12 + 8].role}>` + `\n${client.emoji.delete} **是否自動刪除身分組:**${data1[number * 12 + 8].delete_when_not}`,
                            inline: true
                        }) : null
                        let a10 = data1[number * 12 + 9] ? testtestestesteteste.push({
                            name: `第${number*12 + 10}個:`,
                            value: `<:levelup:990254382845157406> **等級:**` + `\`${data1[number * 12 + 9].leavel}\`\n<:roleplaying:985945121264635964> **身分組:**<@&${data1[number * 12 + 9].role}>` + `\n${client.emoji.delete} **是否自動刪除身分組:**${data1[number * 12 + 9].delete_when_not}`,
                            inline: true
                        }) : null
                        let a11 = data1[number * 12 + 10] ? testtestestesteteste.push({
                            name: `第${number*12 + 11}個:`,
                            value: `<:levelup:990254382845157406> **等級:**` + `\`${data1[number * 12 + 10].leavel}\`\n<:roleplaying:985945121264635964> **身分組:**<@&${data1[number * 12 + 10].role}>` + `\n${client.emoji.delete} **是否自動刪除身分組:**${data1[number * 12 + 10].delete_when_not}`,
                            inline: true
                        }) : null
                        let a12 = data1[number * 12 + 11] ? testtestestesteteste.push({
                            name: `第${number*12 + 12}個:`,
                            value: `<:levelup:990254382845157406> **等級:**` + `\`${data1[number * 12 + 11].leavel}\`\n<:roleplaying:985945121264635964> **身分組:**<@&${data1[number * 12 + 11].role}>` + `\n${client.emoji.delete} **是否自動刪除身分組:**${data1[number * 12 + 11].delete_when_not}`,
                            inline: true
                        }) : null

                        const bt100 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${number - 1}voice_leave_role`)
                        .setEmoji("<:previous:986067803910066256>")
                        .setLabel('上一頁')
                        .setStyle(ButtonStyle.Success)
                        .setDisabled(number - 1 === -1 ? true : false),
                        new ButtonBuilder()
                        .setCustomId(`${number + 1}voice_leave_role`)
                        .setEmoji("<:next:986067802056167495>")
                        .setLabel('下一頁')
                        .setStyle(ButtonStyle.Success)
                        .setDisabled(number + 1 >= Math.ceil(data1.length / 12) ? true : false),
                    );
                        interaction.update({
                            embeds: [
                                new EmbedBuilder()
                                .setTitle(`${client.emoji.channel} 以下是語音經驗身分組的所有設定!!`)
                                .setFields(testtestestesteteste)
                                .setColor(`Random`)
                                .setFooter({text: `總共: ${data1.length} 筆資料\n第 ${number + 1} / ${Math.ceil(data1.length / 12)} 頁(按按鈕會自動更新喔!`})
                            ],
                            components: [bt100]
                        })
                    }, 1000);

                    })
                }
    }
})