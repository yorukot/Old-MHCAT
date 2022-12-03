const btn = require("../models/btn.js")
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
const {
    ChartJSNodeCanvas,
    ChartConfiguration,
} = require("chartjs-node-canvas");
const system = require('../models/system.js')

const canvas = new ChartJSNodeCanvas({
    type: 'jpg',
    width: 1920,
    height: 700,
    backgroundColour: "rgb(28 28 28)",
});
canvas.registerFont(`./fonts/NotoSansTC-Regular.otf`, {
    family: "NotoSansTC",
});
const lotter = require('../models/lotter.js')
const os = require("os");
const process = require('process');
const client = require('../index');

function round(num) {
    var m = Number((Math.abs(num) * 100).toPrecision(15));
    return Math.round(m) / 100 * Math.sign(num);
}
const {
    user
} = require("../index");

client.on("interactionCreate", async (interaction) => {
    function errors(content) {
        const embed = new EmbedBuilder().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("Red");
        interaction.editReply({
            embeds: [embed],
            ephemeral: true
        })
    }
    try {
        if (interaction.isButton()) {

            if (interaction.customId.includes('shardinfoupdate') || interaction.customId.includes('botinfoupdate')) {
                try {
                    if (interaction.customId === 'shardinfoupdate') {
                        const data = client.cluster.broadcastEval('this.receiveBotInfo()');
                        const a = []
                        data.then(function (result) {
                            for (let i = 0; i < result.length; i++) {
                                const {
                                    shards,
                                    guild,
                                    members,
                                    ram,
                                    rssRam,
                                    ping,
                                    uptime
                                } = result[i]
                                const test = {
                                    name: `<:server:986064124209418251> 分片ID: ${shards}`,
                                    value: `\`\`\`fix\n公會數量: ${guild}\n使用者數量: ${members}\n記憶體: ${ram}\\${rssRam} mb\n上線時間:${uptime}\n延遲: ${ping}\`\`\``,
                                    inline: true
                                }
                                a.push(test)
                            }
                            const row = new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                    .setEmoji("<:update:1020532095212335235>")
                                    .setCustomId('shardinfoupdate')
                                    .setLabel('更新')
                                    .setStyle(ButtonStyle.Success)
                                );
                            interaction.update({
                                embeds: [
                                    new EmbedBuilder()
                                    .setColor(`Random`)
                                    .setTitle(`<:vagueness:999527612634374184> 以下是每個分片的資訊!!`)
                                    .setFields(a)
                                    .setTimestamp()
                                ],
                                components: [row]
                            })

                        })
                    } else {
                        await interaction.deferReply({
                            ephemeral: true
                        });
                        const data1 = client.cluster.broadcastEval('this.receiveBotInfo()');
                        const a = []
                        let guildss = 0
                        let membersss = 0
                        let result = null
                        data1.then(function (result1) {
                            for (let i = 0; i < result1.length; i++) {
                                result = result1
                                const {
                                    cluster,
                                    shards,
                                    guild,
                                    members,
                                    ram,
                                    rssRam,
                                    ping,
                                    uptime
                                } = result1[i]
                                guildss = guild + guildss
                                membersss = members + membersss
                            }
                        })
                        const totalRam = Math.round(os.totalmem() / 1024 / 1024);
                        const usedRam = Math.round((os.totalmem() - os.freemem()) / 1024 / 1024);
                        const osaa = require("os-utils");
                        system.findOne({
                            a: 'dsa'
                        }, async (err, data111) => {
                            const datapoints = data111.ram;
                            const datapoints1 = data111.cpu;
                            const data = {
                                labels: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ],
                                datasets: [{
                                        label: 'RAM',
                                        data: datapoints,
                                        pointHoverBorderWidth: 0,
                                        pointRadius: 0,
                                        borderColor: '#28FF28',
                                    },
                                    {
                                        label: 'CPU',
                                        data: datapoints1,
                                        pointHoverBorderWidth: 0,
                                        pointRadius: 0,
                                        borderColor: '#FFA042',
                                    }
                                ]
                            };
                            const configuration = {
                                type: 'line',
                                data: data,
                                options: {
                                    responsive: true,
                                    plugins: {
                                        legend: {
                                            labels: {
                                                font: {
                                                    size: 52,
                                                },
                                            },
                                            position: 'top',
                                        },
                                        title: {
                                            font: {
                                                size: 52
                                            },
                                            display: true,
                                            text: '系統使用量(最近24小時)'
                                        },

                                    }
                                },
                            };
                            const image = await canvas.renderToBuffer(configuration);
                            const attachment = new AttachmentBuilder(image);
                            const row = new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                    .setEmoji("<:update:1020532095212335235>")
                                    .setCustomId('botinfoupdate')
                                    .setLabel('更新')
                                    .setStyle(ButtonStyle.Success)
                                );
                            osaa.cpuUsage(function (v) {
                                const embed = new EmbedBuilder()
                                    .setTitle("<a:mhcat:996759164875440219> MHCAT目前系統使用量:")
                                    .addFields([{
                                            name: "<:cpu:986062422383161424> CPU型號:\n",
                                            value: `\`${os.cpus().map((i) => `${i.model}`)[0]}\``,
                                            inline: false
                                        },
                                        {
                                            name: "<:cpu:987630931932229632> CPU使用量:\n",
                                            value: `\`${(v * 100).toFixed(2)}\`**%**`,
                                            inline: true
                                        },
                                        {
                                            name: "<:vagueness:999527612634374184> 分片數量:\n",
                                            value: `\`${result.length}\` **個**`,
                                            inline: true
                                        },
                                        {
                                            name: "<:rammemory:986062763598155797> RAM使用量:",
                                            value: `\`${usedRam}\\${totalRam}\` **MB**\`(${((usedRam / totalRam) * 100).toFixed(2)}%)\``,
                                            inline: true
                                        },
                                        {
                                            name: "<:chronometer:986065703369080884> 開機時間:",
                                            value: `**<t:${Math.round((Date.now() / 1000) - process.uptime())}:R>**`,
                                            inline: true
                                        },
                                        {
                                            name: "<:server:986064124209418251> 總伺服器:",
                                            value: `\`${guildss}\``,
                                            inline: true
                                        },
                                        {
                                            name: `<:user:986064391139115028> 總使用者:`,
                                            value: `\`${membersss}\``,
                                            inline: true
                                        },
                                    ])
                                    .setColor('Random')
                                    .setTimestamp()
                                    .setImage("attachment://file.jpg");
                                interaction.message.edit({
                                    embeds: [embed],
                                    files: [attachment],
                                    components: [row]
                                })
                                interaction.editReply({
                                    content: client.emoji.done + '** | 成功更新!**'
                                })
                            })

                        })
                    }
                } catch (error) {
                    interaction.editReply({
                        content: "opps,出現了錯誤!\n有可能是你設定沒設定好\n或是我沒有權限喔(請確認我的權限比你要加的權限高，還需要管理身分組的權限)"
                    })
                }
            } else if (interaction.customId.includes('add') || interaction.customId.includes('delete')) {
                await interaction.deferReply({
                    ephemeral: true
                });
                try {
                    btn.findOne({
                        guild: interaction.guild.id,
                        number: interaction.customId,
                    }, async (err, data) => {
                        if (err) throw err;
                        if (!data) {
                            return;
                        } else {
                            if (interaction.customId.includes('add')) {
                                const role = interaction.guild.roles.cache.get(data.role)
                                if (!role) return errors("請通知群主管裡員找不到這個身分組!")
                                if (interaction.member.roles.cache.has(role.id)) {
                                    const error = new EmbedBuilder()
                                        .setColor("Red")
                                        .setTitle("<a:Discord_AnimatedNo:1015989839809757295> | 你已經擁有身分組了!")
                                    interaction.editReply({
                                        embeds: [error],
                                        ephemeral: true
                                    })

                                } else {
                                    if (Number(role.position) >= Number(interaction.guild.members.me.roles.highest.position)) return errors("請通知群主管裡員我沒有權限給你這個身分組(請把我的身分組調高)!")
                                    interaction.member.roles.add(role)
                                    const add = new EmbedBuilder()
                                        .setColor("Green")
                                        .setTitle("<a:green_tick:994529015652163614> | 成功增加身分組!")
                                    interaction.editReply({
                                        embeds: [add],
                                        ephemeral: true
                                    })
                                }
                            } else if (interaction.customId.includes('delete')) {
                                const role = interaction.guild.roles.cache.get(data.role)
                                if (!role) return errors("找不到這個身分組!")
                                if (interaction.member.roles.cache.has(role.id)) {
                                    if (Number(role.position) >= Number(interaction.guild.members.me.roles.highest.position)) return errors("請通知群主管裡員我沒有權限給你這個身分組(請把我的身分組調高)!")
                                    interaction.member.roles.remove(role)
                                    const warn = new EmbedBuilder()
                                        .setColor("Green")
                                        .setTitle("<a:green_tick:994529015652163614> | 成功刪除身分組!")
                                    interaction.editReply({
                                        embeds: [warn],
                                        ephemeral: true
                                    })
                                } else {
                                    const warn = new EmbedBuilder()
                                        .setColor("Red")
                                        .setTitle("<a:Discord_AnimatedNo:1015989839809757295> |  你沒有這個身分組!")
                                    interaction.editReply({
                                        embeds: [warn],
                                        ephemeral: true
                                    })
                                }
                            } else {
                                interaction.editReply({
                                    content: "很抱歉，出現了錯誤!",
                                    ephemeral: true
                                })
                            }
                        }
                    })
                } catch (error) {
                    interaction.editReply({
                        content: "opps,出現了錯誤!\n有可能是你設定沒設定好\n或是我沒有權限喔(請確認我的權限比你要加的權限高，還需要管理身分組的權限)"
                    })
                }
            } else if (interaction.customId.includes("lotter")) {
                await interaction.deferReply({
                    ephemeral: true
                });
                if (interaction.customId.includes("lottersearch")) {
                    const iddd = interaction.customId.replace("search", '')
                    lotter.findOne({
                        guild: interaction.guild.id,
                        id: iddd,
                    }, async (err, data) => {
                        if (!data) return interaction.editReply({
                            content: "<a:Discord_AnimatedNo:1015989839809757295> | 這個抽獎已經因為時間過久而被刪除資料(結束超過30天)!",
                            ephemeral: true
                        })
                        if (data) {
                            const e = data.member.map(
                                (w, i) => `${interaction.guild.members.cache.get(w.id) ? interaction.guild.members.cache.get(w.id).user.username + '#' + interaction.guild.members.cache.get(w.id).user.discriminator : '使用者已消失!'}`
                            )
                            const a = data.member.map(
                                (w, i) => w.id
                            )

                            function timeConverter(UNIX_timestamp) {
                                const date = new Date(UNIX_timestamp);
                                const options = {
                                    formatMatcher: 'basic',
                                    timeZone: 'Asia/Taipei',
                                    timeZoneName: 'long',
                                    year: 'numeric',
                                    month: "2-digit",
                                    day: "2-digit",
                                    hour12: false
                                };
                                return date.toLocaleTimeString('zh-TW', options)
                            }
                            const b = data.member.map(
                                (w, i) => `${interaction.guild.members.cache.get(w.id) ? interaction.guild.members.cache.get(w.id).user.username + '#' + interaction.guild.members.cache.get(w.id).user.discriminator : '使用者已退出伺服器!'}(id:${w.id})|參加時間:${!isNaN(w.time) ? timeConverter(w.time) : w.time}`
                            )
                            const match = a.find(element => {
                                if (element.includes(interaction.user.id)) {
                                    return true;
                                } else {
                                    return false;
                                }
                            });
                            let atc = new AttachmentBuilder(Buffer.from(`${b.join(`\n`)}`), {
                                name: 'discord.txt'
                            });
                            const embed = new EmbedBuilder()
                                .setTitle(`抽獎人數資訊`)
                                .setDescription(`<:list:992002476360343602>**目前共有**\`${e.length}\`**人參加抽獎**\n<:star:987020551698649138>**您是否有參加該抽獎:**${match ? '\`有\`' : '\`沒有\`'}\n\n${e.length < 100 ? '┃ ' + '' + e.join(' ┃ ') + '┃' : "**由於人數過多，無法顯示所有成員名稱!\n請使用\`.txt\`檔案觀看**"}`)
                                .setColor("Random")
                            const bt = new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                    .setCustomId(iddd + 'restart')
                                    .setLabel('點我重抽!')
                                    .setEmoji("<:votingbox:988878045882499092>")
                                    .setStyle(ButtonStyle.Success),
                                    new ButtonBuilder()
                                    .setCustomId(iddd + 'stop')
                                    .setLabel('點我取消此次抽獎!')
                                    .setEmoji("<:warning:985590881698590730>")
                                    .setStyle(ButtonStyle.Danger),
                                );

                            interaction.editReply({
                                content: (((data.owner && data.owner === interaction.member.id) || (interaction.guild.ownerId === interaction.user.id)) ? true : (!data.owner && interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) ? true : false) ? "<:shield:1019529265101930567> | 你有權限(創辦人或服主)執行終止抽獎或是重抽，是否要執行其中一項?" : null,
                                ephemeral: true,
                                components: (((data.owner && data.owner === interaction.member.id) || (interaction.guild.ownerId === interaction.user.id)) ? true : (!data.owner && interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) ? true : false) ? [bt] : null,
                                embeds: [embed],
                                files: [atc]
                            })
                        }
                    })
                } else if (interaction.customId.includes("lotterrestart")) {
                    const iddd = interaction.customId.replace("restart", '')

                    function getRandomArbitrary(min, max) {
                        min = Math.ceil(min);
                        max = Math.floor(max);
                        return Math.floor(Math.random() * (max - min) + min);
                    }
                    lotter.findOne({
                        guild: interaction.guild.id,
                        id: iddd,
                    }, async (err, data) => {
                        if (!data) return interaction.editReply({
                            content: "<a:Discord_AnimatedNo:1015989839809757295> | 這個抽獎已經因為時間過久而被刪除資料(結束超過30天)!",
                            ephemeral: true
                        })
                        if (data) {
                            const winner_array = []
                            for (y = data.howmanywinner - 1; y > -1; y--) {
                                const winner = data.member[getRandomArbitrary(0, data.member.length)]
                                if (winner === undefined) {
                                    y--
                                } else {
                                    winner_array.push(winner.id)
                                }
                                const guild = client.guilds.cache.get(data.guild);
                                if (!guild) return
                                let channel = guild.channels.cache.get(data.message_channel);
                                if (!channel) return
                                const winner_embed = new EmbedBuilder()
                                    .setTitle("<:fireworks:997374182016958494> 恭喜中獎者! <:fireworks:997374182016958494>")
                                    .setDescription(data.member.length === 0 ? "**沒有人參加抽獎欸QQ**" : `
**<:celebration:997374188060946495> 恭喜:**
<@${winner_array.join('>\n<@')}>
<:gift:994585975445528576> **抽中:** ${data.gift}
`)
                                    .setColor(interaction.guild.members.me.displayHexColor)
                                    .setFooter({
                                        text: "沒抽中的我給你一個擁抱w"
                                    })
                                channel.send({
                                    content: `<@${winner_array.join('><@')}>`,
                                    embeds: [winner_embed]
                                })
                                data.collection.updateOne(({
                                    guild: data.guild,
                                    id: data.id
                                }), {
                                    $set: {
                                        end: true
                                    }
                                })
                                data.save()
                                interaction.editReply({
                                    content: "<a:green_tick:994529015652163614> | 成功重抽!",
                                    ephemeral: true
                                })
                            }
                        }
                    })
                } else if (interaction.customId.includes("lotterstop")) {
                    const iddd = interaction.customId.replace("stop", '')
                    lotter.findOne({
                        guild: interaction.guild.id,
                        id: iddd,
                    }, async (err, data) => {
                        if (!data) return interaction.editReply({
                            content: "<a:Discord_AnimatedNo:1015989839809757295> | 很抱歉，這個抽獎已經因為超過時間而刪除資料了!",
                            ephemeral: true
                        })
                        if (data) {
                            data.collection.updateOne(({
                                guild: data.guild,
                                id: data.id
                            }), {
                                $set: {
                                    end: true
                                }
                            })
                            const greate = new EmbedBuilder()
                                .setColor("Green")
                                .setTitle("<a:green_tick:994529015652163614> | 成功取消此次抽獎!")
                            interaction.editReply({
                                embeds: [greate],
                                ephemeral: true
                            })
                        }
                    })
                } else {
                    lotter.findOne({
                        guild: interaction.guild.id,
                        id: interaction.customId,
                    }, async (err, data) => {
                        if (!data) return interaction.editReply({
                            content: "<a:Discord_AnimatedNo:1015989839809757295> | 這個抽獎已經因為時間過久而被刪除資料(結束超過30天)!",
                            ephemeral: true
                        })
                        if (data) {
                            const match = data.member.find(element => {
                                if (element.id.includes(interaction.user.id)) {
                                    return true;
                                } else {
                                    return false;
                                }
                            });
                            if (match) {
                                if (data.end === true) return interaction.editReply({
                                    content: "<a:Discord_AnimatedNo:1015989839809757295> | 很抱歉，這個抽獎已經過期!",
                                    ephemeral: true
                                })
                                return interaction.editReply({
                                    content: "<a:Discord_AnimatedNo:1015989839809757295> | 你無法重複參加!",
                                    ephemeral: true
                                })
                            }
                            const date = Math.floor(Date.now() / 1000)
                            if (data.maxNumber !== null && data.member.length >= data.maxNumber) return interaction.editReply({
                                content: "<a:Discord_AnimatedNo:1015989839809757295> | 以達到最高參與人數",
                                ephemeral: true
                            })
                            if (Number(data.date) >= Number(date)) {
                                if (data.yesrole !== null && !interaction.member.roles.cache.some(role => role.id === data.yesrole)) return interaction.editReply({
                                    content: "<a:Discord_AnimatedNo:1015989839809757295> | 很抱歉，創辦人設定你不能抽獎!",
                                    ephemeral: true
                                })
                                if (data.norole !== null && interaction.member.roles.cache.some(role => role.id === data.norole)) return interaction.editReply({
                                    content: "<a:Discord_AnimatedNo:1015989839809757295> | 很抱歉，創辦人設定你不能抽獎!",
                                    ephemeral: true
                                })
                                const object = {
                                    time: Date.now(),
                                    id: interaction.user.id,
                                }
                                data.member.push(object)
                                data.save()
                                const greate = new EmbedBuilder()
                                    .setColor("Green")
                                    .setTitle("<a:green_tick:994529015652163614> | 成功參加抽獎!")
                                interaction.editReply({
                                    embeds: [greate],
                                    ephemeral: true
                                })
                            } else {
                                return interaction.editReply({
                                    content: "<a:Discord_AnimatedNo:1015989839809757295> | 很抱歉，這個抽獎已經過期!",
                                    ephemeral: true
                                })
                            }
                        } else {
                            return interaction.editReply({
                                content: "<a:Discord_AnimatedNo:1015989839809757295> | 這個抽獎已經找不到囉"
                            })
                        }
                    })
                }
            } else if (interaction.customId.includes("verification")) {
                function errors1(content) {
                    const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");
                    interaction.reply({
                        embeds: [embed],
                        ephemeral: true
                    })
                }
                const verification = require("../models/verification.js");
                verification.findOne({
                    guild: interaction.guild.id,
                }, async (err, data) => {
                    if (err) throw err;
                    const role = interaction.guild.roles.cache.get(data.role)
                    if (!role) return errors1("驗證身分組已經不存在了，請通管理員!")
                    if (Number(role.position) >= Number(interaction.guild.members.me.roles.highest.position)) return errors1("請通知群主管裡員我沒有權限給你這個身分組(請把我的身分組調高)!")
                    const text = interaction.customId.replace("verification", "")
                    const {
                        ActionRowBuilder,
                        ModalBuilder,
                        TextInputBuilder,
                        TextInputStyle
                    } = require('discord.js');
                    const modal = new ModalBuilder()
                        .setCustomId(text + 'ver')
                        .setTitle('請輸入驗證碼!');
                    const favoriteColorInput = new TextInputBuilder()
                        .setCustomId(text + 'ver')
                        .setLabel("請輸入圖片上的驗證碼")
                        .setStyle(TextInputStyle.Short);
                    const firstActionRow = new ActionRowBuilder().addComponents(favoriteColorInput);
                    modal.addComponents(firstActionRow);
                    await interaction.showModal(modal);
                })
            } else if (interaction.customId.includes("teach21point")) {
                await interaction.deferReply({
                    ephemeral: true
                });
                interaction.editReply({
                    embeds: [new EmbedBuilder()
                        .setTitle("<:creativeteaching:986060052949524600> 以下是21點介紹")
                        .setDescription(`
**這邊的倍數是一個人的賭注等於1所以兩個人就會是2**
\`\`\`fix
1.機器人是莊
2.機器人自己發一張排給自己
3.給遊玩的兩個人各兩張牌
4.在發一張給自己
5.問兩個人要不要加牌，直到兩個都選擇不加或沒牌了
6.把莊家加超過13
7.莊如果大於21點，兩個人各獲得原本賭注的1.5倍
8.如果莊家沒爆，兩個人比
9.如果其中一個玩家爆，另一個拿走2倍賭注，爆的那個拿走0倍
10.如果兩個都爆等於平局，不加不減
11.如果其中兩人都沒報，比大小，贏的人拿走全部賭注
\`\`\`
**不會的話，玩玩看就知道ㄌ**`)
                        .setColor("Random")
                    ],
                    ephemeral: true
                })
            } else if (interaction.customId.includes("thansize")) {
                await interaction.deferReply({
                    ephemeral: true
                });
                interaction.editReply({
                    embeds: [new EmbedBuilder()
                        .setTitle("<:creativeteaching:986060052949524600> 以下為比大小介紹")
                        .setDescription(`
**這邊的倍數是一個人的賭注等於1所以兩個人就會是2**
\`\`\`fix
1.同意遊玩
2.由機器人抽取兩位的數字(1-100)
3.比大小
4.大的拿走所有賭注
\`\`\`
**不會的話，玩玩看就知道ㄌ**`)
                        .setColor("Random")
                    ],
                    ephemeral: true
                })
            }
        } else if (interaction.isMessageComponent) {
            if (interaction.customId != 'helphelphelphelpmenu') return;
            await interaction.deferReply({
                ephemeral: true
            });
            const {
                description,
                emo
            } = require('../config.json')
            const {
                readdirSync
            } = require("fs");
            let {
                values
            } = interaction;
            let color = 'Random'
            let value = values[0];
            let cots = [];
            let catts = [];

            readdirSync("./slashCommands/").forEach((dir) => {
                if (dir.toLowerCase() !== value.toLowerCase()) return;
                const commands = readdirSync(`./slashCommands/${dir}/`).filter((file) =>
                    file.endsWith(".js")
                );


                const cmds = commands.map((command) => {
                    let file = require(`../slashCommands/${dir}/${command}`); //getting the commands again

                    if (!file.name) return "沒有任何指令";

                    let name = file.name.replace(".js", "");

                    if (client.slash_commands.get(name).hidden) return;


                    let des = client.slash_commands.get(name).description;
                    let emo = client.slash_commands.get(name).emoji;
                    let optionsa = client.slash_commands.get(name).options;
                    let emoe = emo ? `${emo}` : ``;

                    let obj = {
                        cname: `${emoe} </${name}`,
                        des,
                        optionsa
                    }

                    return obj;
                });

                let dota = new Object();

                cmds.map(co => {
                    if (co == undefined) return;
                    if (co.optionsa && co.optionsa[0] && co.optionsa[0].type === 1) {
                        for (let x = 0; x < co.optionsa.length; x++) {
                            dota = {
                                name: `${cmds.length === 0 ? "進行中" : "" + co.cname + " " + co.optionsa[x].name + ":964185876559196181>"}`,
                                value: `\`\`\`fix\n${co.optionsa[x].description ? `${co.optionsa[x].description}` : `沒有說明`}\`\`\``,
                                inline: true,
                            }
                            catts.push(dota)
                        }
                    } else {
                        dota = {
                            name: `${cmds.length === 0 ? "進行中" : "" + co.cname + ":964185876559196181>"}`,
                            value: co.des ? `\`\`\`fix\n${co.des}\`\`\`` : `\`沒有說明\``,
                            inline: true,
                        }
                        catts.push(dota)
                    }
                });

                cots.push(dir.toLowerCase());
            });

            if (cots.includes(value.toLowerCase())) {
                const combed = new EmbedBuilder()
                    .setTitle(`__${emo[value.charAt(0).toUpperCase() + value.slice(1)]} ${value.charAt(0).toUpperCase() + value.slice(1)} 指令!__`)
                    .setDescription(`> 使用 \`/help 指令名稱:\` 以獲取有關指令的更多信息!\n> 例: \`/help 指令名稱:公告發送\`\n\n`)
                    .addFields(catts)
                    .setColor(color)
                    .setFooter({
                        text: `${interaction.user.tag}的查詢`,
                        iconURL: interaction.user.displayAvatarURL({
                            dynamic: true
                        })
                    });

                return interaction.editReply({
                    embeds: [combed],
                    ephemeral: true
                })
            };
        }
    } catch (error) {
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setURL("https://discord.gg/7g7VE2Sqna")
                .setStyle(ButtonStyle.Link)
                .setLabel("支援伺服器")
                .setEmoji("<:customerservice:986268421144592415>"),
                new ButtonBuilder()
                .setURL("https://mhcat.xyz")
                .setEmoji("<:worldwideweb:986268131284627507>")
                .setStyle(ButtonStyle.Link)
                .setLabel("官方網站")
            );
        return interaction.editReply({
            embeds: [new EmbedBuilder()
                .setTitle("<a:Discord_AnimatedNo:1015989839809757295> | 很抱歉，出現了錯誤!")
                .setDescription("**如果可以的話再麻煩幫我到支援伺服器回報w**" + `\n\`\`\`${error}\`\`\``)
                .setColor("Red")
            ],
            components: [row]
        })
    }
})