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
const work_set = require('../../models/work_set.js')
const work_something = require('../../models/work_something.js')
const work_user = require('../../models/work_user.js')
module.exports = {
    name: '打工系統',
    description: '用自己的心血來獲得一些獎勵吧!',
    cooldown: 5,
    options: [{
        name: '打工系統設定',
        type: ApplicationCommandOptionType.Subcommand,
        description: '設定打工系統的各項設定，伺服器第一次使用請使用這個指令!',
        options: [{
            name: '每天可獲得多少精力',
            type: ApplicationCommandOptionType.Integer,
            description: '每天可以獲得多少精力(每天24點發送)!',
            required: true,
        }, {
            name: '精力上限為多少',
            type: ApplicationCommandOptionType.Integer,
            description: '每人的精力上限最多是多少!',
            required: true,
        }]
    }, {
        name: '新增打工事項',
        type: ApplicationCommandOptionType.Subcommand,
        description: '新增打工的事項',
        options: [{
            name: '打工地點名稱',
            type: ApplicationCommandOptionType.String,
            description: '打工地點名稱!(重複的話會自動刪除舊的)',
            required: true,
        }, {
            name: '耗費時間',
            type: ApplicationCommandOptionType.Number,
            description: '打工一次需要耗費多少時間(小時為單位)!',
            required: true,
        }, {
            name: '耗費精力',
            type: ApplicationCommandOptionType.Integer,
            description: '打工一次需耗費多少的精力!',
            required: true,
        }, {
            name: '取得代幣',
            type: ApplicationCommandOptionType.Integer,
            description: '打工一次可取得多少代幣!',
            required: true,
        }]
    }, {
        name: '打工事項刪除',
        type: ApplicationCommandOptionType.Subcommand,
        description: '刪除打工事項',
        options: [{
            name: '打工地點名稱',
            type: ApplicationCommandOptionType.String,
            description: '輸入打工地點名稱!',
            required: true,
        }]
    }, {
        name: '打工介面',
        type: ApplicationCommandOptionType.Subcommand,
        description: '在這裡一般使用者可以使用所有的東西!!',
    }],
    UserPerms: '除了打工介面其他都是需要訊息管理喔!',
    //video: 'https://mhcat.xyz/commands/statistics.html',
    emoji: `<:working:1048617967799242772>`,
    run: async (client, interaction, options, perms) => {
        await interaction.deferReply();
        try {
            function errors(content) {
                const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");
                interaction.editReply({
                    embeds: [embed]
                })
            }
            if (interaction.options.getSubcommand() === "打工系統設定") {
                if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return errors(`你需要有\`${perms}\`才能使用此指令`)
                let get_energy = interaction.options.getInteger("每天可獲得多少精力")
                let max_energy = interaction.options.getInteger("精力上限為多少")
                work_set.findOne({
                    guild: interaction.channel.guild.id,
                }, async (err, data) => {
                    if (data) data.delete()
                    data = new work_set({
                        guild: interaction.guild.id,
                        get_energy: get_energy,
                        max_energy: max_energy,
                    })
                    data.save()
                    const embed = new EmbedBuilder()
                        .setTitle(`<:working:1048617967799242772> 打工系統`)
                        .setDescription(`${client.emoji.done}**成功設定打工系統!**
<:lighting:1048626093994803200> **每天可獲得精力:**\`${get_energy}\`
**精力上限:**\`${max_energy}\``)
                        .setColor(client.color.greate)

                    interaction.editReply({
                        embeds: [embed]
                    })
                })
            } else if (interaction.options.getSubcommand() === "新增打工事項") {
                if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return errors(`你需要有\`${perms}\`才能使用此指令`)
                work_set.findOne({
                    guild: interaction.channel.guild.id,
                }, async (err, data1111) => {
                    if (!data1111) return errors('請先使用`/打工系統 打工系統設定`進行初始設定!')

                    let name = interaction.options.getString("打工地點名稱")
                    let time_1111 = interaction.options.getNumber("耗費時間")
                    let energy = interaction.options.getInteger("耗費精力")
                    let coin = interaction.options.getInteger("取得代幣")
                    let time = Math.round(time_1111 * 60 * 60)
                    work_something.find({
                        guild: interaction.channel.guild.id,
                    }, async (err, data) => {
                        if (data.length > 19) return errors("你的打工事項已經滿了，請先刪除一些!")
                        work_something.findOne({
                            guild: interaction.channel.guild.id,
                            name: name
                        }, async (err, data) => {
                            if (data) data.delete()
                            data = new work_something({
                                guild: interaction.guild.id,
                                name: name,
                                time: time,
                                energy: energy,
                                coin: coin,
                            })
                            data.save()
                            const embed = new EmbedBuilder()
                                .setTitle(`<:working:1048617967799242772> 打工事項成功增加`)
                                .setDescription(`<:id:1010884394791207003> **打工地點名稱:** \`${name}\`
<:ontime:981966857718353950> **耗費時間:** \`${time_1111}小時\`
<:lighting:1048626093994803200> **耗費精力:** \`${energy}\`
 <:money:997374193026994236> **取得代幣:** \`${coin}\`
    `)
                                .setColor(client.color.greate)
                            interaction.editReply({
                                embeds: [embed]
                            })
                        })
                    })
                })
            } else if (interaction.options.getSubcommand() === "打工事項刪除") {
                if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return errors(`你需要有\`${perms}\`才能使用此指令`)
                work_set.findOne({
                    guild: interaction.channel.guild.id,
                }, async (err, data1111) => {
                    if (!data1111) return errors('請先使用`/打工系統 打工系統設定`進行初始設定!')
                })
                let name = interaction.options.getString("打工地點名稱")
                work_something.findOne({
                    guild: interaction.channel.guild.id,
                    name: name
                }, async (err, data) => {
                    if (!data) return errors('很抱歉，找不到這個名字的資料!')
                    data.delete()
                    const embed = new EmbedBuilder()
                        .setTitle(`<:working:1048617967799242772> 打工事項`)
                        .setDescription(`${client.emoji.delete} **成功刪除打工事項**:\`${name}\``)
                        .setColor(client.color.greate)
                    interaction.editReply({
                        embeds: [embed]
                    })
                })
            } else if (interaction.options.getSubcommand() === "打工介面") {
                work_set.findOne({
                    guild: interaction.channel.guild.id,
                }, async (err, data1111) => {
                    if (!data1111) return errors('請先請管理員使用`/打工系統 打工系統設定`進行初始設定!')
                    work_something.find({
                        guild: interaction.guild.id,
                    }, async (err, data) => {
                        if (data.length === 0) return errors("目前沒有任何打工給你做喔!")
                        work_user.findOne({
                            guild: interaction.guild.id,
                            user: interaction.user.id
                        }, async (err, data) => {
                            if (!data) {
                                work_set.findOne({
                                    guild: interaction.channel.guild.id,
                                }, async (err, data1111) => {
                                    const data = new work_user({
                                        guild: interaction.guild.id,
                                        user: interaction.user.id,
                                        state: "待業中",
                                        end_time: 0,
                                        energi: data1111.max_energy,
                                        get_coin: 0
                                    })
                                    data.save()
                                })
                            }
                        })
                        let test = []
                        const array = []
                        let buttons = []
                        let buttons1 = []
                        let buttons2 = []
                        let buttons3 = []
                        let buttons4 = []
                        for (let i = 0; i < data.length; i++) {
                            let arrary111 = {
                                name: `<:id:985950321975128094> **打工地點名稱 :** \`${data[i].name}\``,
                                value: `<:lighting:1048626093994803200> **打工所需精力 : **\`${data[i].energy}\` \n<:ontime:981966857718353950> **耗費時間 : **\`${Number(data[i].time) / 60}分(${Number(data[i].time) / 60/60}小時)\` \n<:id:985950321975128094> **打工報酬 : **\`${data[i].coin}\`(代幣)`,
                                inline: true
                            }
                            array.push(arrary111)
                            if ((buttons.length > 4) && !(buttons1.length > 4)) {
                                buttons1.push(
                                    new ButtonBuilder()
                                    .setCustomId(`${data[i].name}`)
                                    .setLabel(data[i].name)
                                    .setStyle(ButtonStyle.Primary)
                                )
                            } else if (buttons1.length > 4 && !(buttons2.length > 4)) {
                                buttons2.push(
                                    new ButtonBuilder()
                                    .setCustomId(`${data[i].name}`)
                                    .setLabel(data[i].name)
                                    .setStyle(ButtonStyle.Primary)
                                )
                            } else if (buttons2.length > 4 && !(buttons3.length > 4)) {
                                buttons3.push(
                                    new ButtonBuilder()
                                    .setCustomId(`${data[i].name}`)
                                    .setLabel(data[i].name)
                                    .setStyle(ButtonStyle.Primary)
                                )
                            } else if (buttons3.length > 4 && !(buttons4.length > 4)) {
                                buttons4.push(
                                    new ButtonBuilder()
                                    .setCustomId(`${data[i].name}`)
                                    .setLabel(data[i].name)
                                    .setStyle(ButtonStyle.Primary)
                                )
                            } else {
                                buttons.push(
                                    new ButtonBuilder()
                                    .setCustomId(`${data[i].name}`)
                                    .setLabel(data[i].name)
                                    .setStyle(ButtonStyle.Primary)
                                )
                            }
                        }
                        all_shop = new ActionRowBuilder()
                            .addComponents(
                                buttons
                            );
                        all_shop1 = new ActionRowBuilder()
                            .addComponents(
                                buttons1
                            );
                        all_shop2 = new ActionRowBuilder()
                            .addComponents(
                                buttons2
                            );
                        all_shop3 = new ActionRowBuilder()
                            .addComponents(
                                buttons3
                            );
                        all_shop4 = new ActionRowBuilder()
                            .addComponents(
                                buttons4
                            );
                        test.push(all_shop)
                        if (buttons1.length > 0) {
                            test.push(all_shop1)
                            if (buttons2.length > 0) {
                                test.push(all_shop2)
                                if (buttons3.length > 0) {
                                    test.push(all_shop3)
                                    if (buttons4.length > 0) {
                                        test.push(all_shop4)
                                    }
                                }
                            }
                        }
                        setTimeout(() => {
                            work_user.findOne({
                                guild: interaction.guild.id,
                                user: interaction.user.id
                            }, async (err, user_data) => {
                                work_set.findOne({
                                    guild: interaction.channel.guild.id,
                                }, async (err, data1111) => {
                                    let msgg = await interaction.editReply({
                                        embeds: [
                                            new EmbedBuilder()
                                            .setTitle(`<:list:992002476360343602> 以下是${interaction.guild.name}的打工簡章`)
                                            .setColor('Random')
                                            .setFields(array)
                                            .setDescription(`<:status:1048643690572283965> **你目前的打工狀態 :** \`${(user_data.end_time - Math.round(Date.now() / 1000)) > 0 ? `在${user_data.state}打工` : '待業中'}\`
<:chronometer:986065703369080884> **剩餘時間:** ${(user_data.end_time - Math.round(Date.now() / 1000)) > 0 ? `<t:${user_data.end_time}:R>` : '\`沒有打工再進行\`'}
<:lighting:1048626093994803200> **剩餘體力:** \`${user_data.energi} \\ ${data1111.max_energy}\`
<a:arrow_pink:996242460294512690> **點擊下方的按扭進行打工!**`)
                                            .setFooter({
                                                text: `${interaction.user.tag}的查詢`,
                                                iconURL: interaction.user.displayAvatarURL({
                                                    dynamic: true
                                                })
                                            })
                                        ],
                                        components: test
                                    })

                                    const filter = i => {
                                        if (msgg.id !== i.message.id) return false
                                        if (i.member.id !== interaction.member.id) {
                                            i.reply({
                                                embeds: [
                                                    new EmbedBuilder()
                                                    .setColor(client.color.error)
                                                    .setTitle(`${client.emoji.error} | 你不是查詢者無法使用!`)
                                                ],
                                                ephemeral: true
                                            })
                                            return false
                                        }
                                        return true
                                    }
                                    const collector1 = interaction.channel.createMessageComponentCollector({
                                        componentType: 2,
                                        filter,
                                        time: 60 * 10 * 1000,
                                        max: 1
                                    })
                                    collector1.on('collect', async (interaction01) => {
                                        const id = interaction01.customId;
                                        work_something.findOne({
                                            guild: interaction.guild.id,
                                            name: id
                                        }, async (err, data) => {
                                            function errorss(content) {
                                                const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");
                                                interaction01.update({
                                                    embeds: [embed]
                                                })
                                            }
                                            if (!data) return errorss("很抱歉，找不到這個打工地點，請於幾秒鐘後重試!")
                                            let aaaaaaa = new ActionRowBuilder()
                                                .addComponents(
                                                    new ButtonBuilder()
                                                    .setCustomId(id)
                                                    .setLabel("確認打工")
                                                    .setEmoji("<:tickmark:985949769224556614>")
                                                    .setStyle(ButtonStyle.Success)
                                                )

                                            interaction01.update({
                                                embeds: [
                                                    new EmbedBuilder()
                                                    .setTitle(`<:creativeteaching:986060052949524600> 以下是${data.name}打工的詳細資料`)
                                                    .setDescription(`<:id:1010884394791207003> **打工地點名稱:**\`${data.name}\`\n` +
                                                        `<:money:997374193026994236> **可獲得代幣:**\`${Number(data.coin)} 個代幣\`\n` +
                                                        `<:lighting:1048626093994803200> **消耗體力:**\`${data.energy}\`\n`
                                                    )
                                                    .setColor("Random")
                                                ],
                                                components: [aaaaaaa]
                                            })
                                            const collector111 = interaction.channel.createMessageComponentCollector({
                                                componentType: 2,
                                                filter,
                                                time: 60 * 10 * 1000,
                                            })
                                            collector111.on('collect', async (interaction01) => {

                                                const id = interaction01.customId;

                                                function errors11111(content) {
                                                    const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");
                                                    interaction01.update({
                                                        embeds: [embed],
                                                        components: []
                                                    })
                                                }
                                                if (id === `announcement_yes`) {
                                                    work_user.collection.updateOne(({
                                                        guild: interaction.channel.guild.id,
                                                        user: interaction.member.id
                                                    }), {
                                                        $set: {
                                                            state: data.name,
                                                            end_time: Math.round(Date.now() / 1000) + data.time,
                                                            energi: user_data.energi - data.energy,
                                                            get_coin: data.coin
                                                        }
                                                    })

                                                    const embed = new EmbedBuilder()
                                                        .setTitle(`<:working:1048617967799242772> 成功取得該工作!`)
                                                        .setDescription(`${client.emoji.done}**你已經成功取得**\`${data.name}\`**的工作**
<:tickmark:985949769224556614> **預計於:<t:${Math.round(Date.now() / 1000) + data.time}:R>打工完成**`)
                                                        .setColor(client.color.greate)
                                                    interaction01.update({
                                                        embeds: [embed],
                                                        components: []
                                                    })
                                                    return
                                                } else if (id === 'announcement_no') {
                                                    interaction01.update({
                                                        content: ":x: | **成功取消!**",
                                                        embeds: [],
                                                        components: []
                                                    })
                                                    return
                                                } else {

                                                    work_something.findOne({
                                                        guild: interaction.guild.id,
                                                        name: id
                                                    }, async (err, data) => {
                                                        if (!data) return interaction01.reply({
                                                            content: ':x: | 很抱歉，找不到這個商品，請重試!',
                                                            ephemeral: true
                                                        })
                                                        if (user_data.energi < (Number(data.energy))) return errors11111("你的體力不夠!")
                                                        if (user_data.state !== '待業中') {
                                                            const yes = new ActionRowBuilder()
                                                                .addComponents(
                                                                    new ButtonBuilder()
                                                                    .setCustomId("announcement_yes")
                                                                    .setEmoji("✅")
                                                                    .setLabel('是')
                                                                    .setStyle(ButtonStyle.Primary),
                                                                    new ButtonBuilder()
                                                                    .setCustomId('announcement_no')
                                                                    .setLabel('否')
                                                                    .setEmoji("❎")
                                                                    .setStyle(ButtonStyle.Danger),
                                                                );
                                                            await interaction01.update({
                                                                embeds: [new EmbedBuilder()
                                                                    .setTitle("⚠️ | 你目前有其他工作，如果堅持繼續將會強制停止之前的工作，並且不返還體力，是否繼續?")
                                                                    .setColor(client.color.error)
                                                                ],
                                                                components: [yes]
                                                            })
                                                        } else {
                                                            work_user.collection.updateOne(({
                                                                guild: interaction.channel.guild.id,
                                                                user: interaction.member.id
                                                            }), {
                                                                $set: {
                                                                    state: data.name,
                                                                    end_time: Math.round(Date.now() / 1000) + data.time,
                                                                    energi: user_data.energi - data.energy,
                                                                    get_coin: data.coin
                                                                }
                                                            })

                                                            const embed = new EmbedBuilder()
                                                                .setTitle(`<:working:1048617967799242772> 成功取得該工作!`)
                                                                .setDescription(`${client.emoji.done}**你已經成功取得**\`${data.name}\`**的工作**
    <:tickmark:985949769224556614> **預計於:<t:${Math.round(Date.now() / 1000) + data.time}:R>打工完成**`)
                                                                .setColor(client.color.greate)
                                                            interaction01.update({
                                                                embeds: [embed],
                                                                components: []
                                                            })
                                                        }

                                                    })
                                                }
                                            })
                                        })
                                    })
                                })
                            })
                        }, 2000)
                    });
                })
            }
        } catch (error) {
            const error_send = require('../../functions/error_send.js')
            error_send(error, interaction)
        }
    }
}