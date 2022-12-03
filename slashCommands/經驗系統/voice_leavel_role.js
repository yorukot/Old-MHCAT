const chat_role = require('../../models/voice_role.js');
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
    name: '語音經驗身分組設定',
    cooldown: 10,
    description: '設定聊天經驗通知要在哪發送(兼增加、刪除、設定查詢)',
    options: [{
        name: '增加',
        type: ApplicationCommandOptionType.Subcommand,
        description: '當有人的等級達到後要給予身分組',
        options: [{
            name: '等級',
            type: ApplicationCommandOptionType.Integer,
            description: '輸入要在幾等時給予身分組!',
            required: true
        }, {
            name: '身分組',
            type: ApplicationCommandOptionType.Role,
            description: '當到達設定的等級時時，要給甚麼身份組',
            required: true
        }, {
            name: '是否自動刪除',
            type: ApplicationCommandOptionType.Boolean,
            description: '當使用者等級不再是所設定的等級時自動將此身分組刪除(默認為否)',
            required: false
        }]
    }, {
        name: '刪除',
        type: ApplicationCommandOptionType.Subcommand,
        description: '刪除之前的設定',
        options: [{
            name: '等級',
            type: ApplicationCommandOptionType.Integer,
            description: '輸入之前設定的身分組!',
            required: true
        }]
    }, {
        name: '設定查詢',
        type: ApplicationCommandOptionType.Subcommand,
        description: '查看之前的設定',
    }],
    video: 'https://mhcat.xyz/docs/chat_xp_set',
    UserPerms: '訊息管理',
    emoji: `<:configuration:984010500608249886>`,
    run: async (client, interaction, options, perms) => {
        await interaction.deferReply();
        try {
            function errors(content) {
                const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");
                interaction.editReply({
                    embeds: [embed]
                })
            }
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return errors(`你需要有\`${perms}\`才能使用此指令`)
            const leavel = interaction.options.getInteger("等級")
            const role11 = interaction.options.getRole("身分組")
            const deelete_wheb_not = interaction.options.getBoolean("是否自動刪除")
            const role = role11 ? role11 : {
                id: "dsa"
            }
            chat_role.findOne({
                guild: interaction.channel.guild.id,
                role: role.id,
                leavel: `${leavel}`
            }, async (err, data) => {
                if (interaction.options.getSubcommand() === "增加") {
                    if (Number(role.position) >= Number(interaction.guild.members.me.roles.highest.position)) return errors("我沒有權限給大家這個身分組(請把我的身分組調高)!")
                    if (data) data.delete()
                    data = new chat_role({
                        guild: interaction.channel.guild.id,
                        leavel: leavel,
                        role: role.id,
                        delete_when_not: deelete_wheb_not ? deelete_wheb_not : false
                    })
                    data.save()
                    const announcement_set_embed = new EmbedBuilder()
                        .setTitle(`${client.emoji.channel}語音經驗系統`)
                        .setDescription(`${client.emoji.done}成功\`增加\`/\`修改\`該設定`)
                        .setColor(client.color.greate)
                    interaction.editReply({
                        embeds: [announcement_set_embed]
                    })
                } else if (interaction.options.getSubcommand() === "設定查詢") {
                    chat_role.find({
                        guild: interaction.channel.guild.id,
                    }, async (err, data) => {
                        const testsetse = []
                        for (let i = 0; i < data.length; i++) {
                            const role = interaction.guild.roles.cache.get(data[i].role)
                            if (!role) {
                                data[i].delete()
                            }
                            let aaaaaaaaa = {
                                name: `<:levelup:990254382845157406> **等級:**` + `\`${data[i].leavel}\``,
                                value: `<:roleget:991997549726662706> **身分組:**<@&${data[i].role}>`,
                                inline: true
                            }
                            testsetse.push(aaaaaaaaa)
                        }
                        interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                .setTitle(`<:Voice:994844272790610011> 以下是語音經驗身分組的所有設定!!`)
                                .setColor(`Random`)
                                .setFields(testsetse)
                            ]
                        })
                    })
                } else {
                    if (data) {
                        data.delete()
                        const announcement_set_embed = new EmbedBuilder()
                            .setTitle(`${client.emoji.delete}語音經驗系統`)
                            .setDescription(`${client.emoji.done}成功刪除該設定`)
                            .setColor(client.color.greate)
                        return interaction.editReply({
                            embeds: [announcement_set_embed]
                        })
                    } else {
                        return errors("你沒有設定過這個選項!")
                    }
                }
            })

        } catch (error) {
            const error_send = require('../../functions/error_send.js')
            error_send(error, interaction)
        }
    }
}