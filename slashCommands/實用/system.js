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
const system = require('../../models/system.js')

const canvas = new ChartJSNodeCanvas({
    type: 'jpg',
    width: 1920,
<<<<<<< HEAD
    height: 1920,
=======
    height: 700,
>>>>>>> a0da53e (🌟 | 更新各種東西)
    backgroundColour: "rgb(28 28 28)",
});
canvas.registerFont(`./fonts/NotoSansTC-Regular.otf`, {
    family: "NotoSansTC",
});

const os = require("os");
const process = require('process');
const Clienta = require('../../index')
module.exports = {
    name: 'info',
    cooldown: 5,
    description: '查詢系統使用量',
    options: [{
        name: 'bot',
        type: ApplicationCommandOptionType.Subcommand,
        description: '查看bot的資訊',
    }, {
        name: 'shard',
        type: ApplicationCommandOptionType.Subcommand,
        description: '查看分片的資訊',
    }],
    emoji: "<:system:1005119719294128279>",
    run: async (client, interaction, options) => {
        await interaction.deferReply().catch(e => {});
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
                const test = {
                    name: `<:server:986064124209418251> 分片ID: ${shards}`,
                    value: `\`\`\`fix\n公會數量: ${guild}\n使用者數量: ${members}\n記憶體: ${ram}\\${rssRam} mb\n上線時間:${uptime}\n延遲: ${ping}\`\`\``,
                    inline: true
                }
                a.push(test)
                guildss = guild + guildss
                membersss = members + membersss
            }
        })
<<<<<<< HEAD
            const totalRam = Math.round(os.totalmem() / 1024 / 1024);
            const usedRam = Math.round((os.totalmem() - os.freemem()) / 1024 / 1024);
            const osaa = require("os-utils");
            system.findOne({
                a: 'dsa'
            }, async (err, data111) => {
                const datapoints = data111.ram;
                const datapoints1 = data111.cpu;
                const data = {
                labels: ['','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','',],
                datasets: [
                    {
                    label: 'RAM',
                    data: datapoints,
                    borderColor: '#28FF28',
                    },
                    {
                    label: 'CPU',
                    data: datapoints1,
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
=======
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
>>>>>>> a0da53e (🌟 | 更新各種東西)
                        legend: {
                            labels: {
                                font: {
                                    size: 52,
<<<<<<< HEAD
                                    family: "'Noto Sans TC', sans-serif",
                                },
                            },
                          position: 'top',
=======
                                },
                            },
                            position: 'top',
>>>>>>> a0da53e (🌟 | 更新各種東西)
                        },
                        title: {
                            font: {
                                size: 52
                            },
<<<<<<< HEAD
                          display: true,
                          text: '系統使用量(最近兩小時)'
                        },
                        
                      }
                    },
                };
                const image = await canvas.renderToBuffer(configuration);
                console.log(image)
                const attachment = new AttachmentBuilder(image);
                if (interaction.options.getSubcommand() === "bot") {
                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                            .setEmoji("<:update:1020532095212335235>")
                            .setCustomId('botinfoupdate')
                            .setLabel('更新')
                            .setStyle(ButtonStyle.Success)
                        );
=======
                            display: true,
                            text: '系統使用量(最近24小時)'
                        },

                    }
                },
            };
            const image = await canvas.renderToBuffer(configuration);
            const attachment = new AttachmentBuilder(image);
            if (interaction.options.getSubcommand() === "bot") {
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setEmoji("<:update:1020532095212335235>")
                        .setCustomId('botinfoupdate')
                        .setLabel('更新')
                        .setStyle(ButtonStyle.Success)
                    );
                osaa.cpuUsage(function (v) {
>>>>>>> a0da53e (🌟 | 更新各種東西)
                    const embed = new EmbedBuilder()
                        .setTitle("<a:mhcat:996759164875440219> MHCAT目前系統使用量:")
                        .addFields([{
                                name: "<:cpu:986062422383161424> CPU型號:\n",
                                value: `\`${os.cpus().map((i) => `${i.model}`)[0]}\``,
                                inline: false
                            },
                            {
                                name: "<:cpu:987630931932229632> CPU使用量:\n",
<<<<<<< HEAD
                                value: `\`${Math.round(osaa.cpuUsage(function(v){return (v)}) * 100)}\`%`,
=======
                                value: `\`${(v * 100).toFixed(2)}\`**%**`,
>>>>>>> a0da53e (🌟 | 更新各種東西)
                                inline: true
                            },
                            {
                                name: "<:vagueness:999527612634374184> 分片數量:\n",
<<<<<<< HEAD
                                value: `\`${result.length}\` 個`,
=======
                                value: `\`${result.length}\` **個**`,
>>>>>>> a0da53e (🌟 | 更新各種東西)
                                inline: true
                            },
                            {
                                name: "<:rammemory:986062763598155797> RAM使用量:",
<<<<<<< HEAD
                                value: `\`${usedRam}\\${totalRam}\` MB`,
=======
                                value: `\`${usedRam}\\${totalRam}\` **MB**\`(${((usedRam / totalRam) * 100).toFixed(2)}%)\``,
>>>>>>> a0da53e (🌟 | 更新各種東西)
                                inline: true
                            },
                            {
                                name: "<:chronometer:986065703369080884> 開機時間:",
<<<<<<< HEAD
                                value: `<t:${Math.round((Date.now() / 1000) - process.uptime())}:R>`,
=======
                                value: `**<t:${Math.round((Date.now() / 1000) - process.uptime())}:R>**`,
>>>>>>> a0da53e (🌟 | 更新各種東西)
                                inline: true
                            },
                            {
                                name: "<:server:986064124209418251> 總伺服器:",
                                value: `\`${guildss}\``,
                                inline: true
                            },
                            {
                                name: `<:user:986064391139115028> 總使用者:`,
<<<<<<< HEAD
                                value: `\`${membersss}\` 名`,
=======
                                    value: `\`${membersss}\``,
>>>>>>> a0da53e (🌟 | 更新各種東西)
                                inline: true
                            },
                        ])
                        .setColor('Random')
                        .setImage("attachment://file.jpg");
                    interaction.followUp({
                        embeds: [embed],
                        files: [attachment],
                        components: [row]
                    })
<<<<<<< HEAD
                } else {
                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                            .setEmoji("<:update:1020532095212335235>")
                            .setCustomId('shardinfoupdate')
                            .setLabel('更新')
                            .setStyle(ButtonStyle.Success)
                        );
                    interaction.followUp({
                        embeds: [
                            new EmbedBuilder()
                            .setColor(`Random`)
                            .setTitle(`<:vagueness:999527612634374184> 以下是每個分片的資訊!!`)
                            .setFields(a)
                        ],
                        components: [row]
                    })
                }
        return
            })
=======
                })
            } else {
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setEmoji("<:update:1020532095212335235>")
                        .setCustomId('shardinfoupdate')
                        .setLabel('更新')
                        .setStyle(ButtonStyle.Success)
                    );
                interaction.followUp({
                    embeds: [
                        new EmbedBuilder()
                        .setColor(`Random`)
                        .setTitle(`<:vagueness:999527612634374184> 以下是每個分片的資訊!!`)
                        .setFields(a)
                    ],
                    components: [row]
                })
            }
            return
        })
>>>>>>> a0da53e (🌟 | 更新各種東西)
    }
}