const coin = require("../../models/coin.js");
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
    errorMonitor
} = require("ws");
module.exports = {
    name: 'Coin increase',
    cooldown: 10,
	description: '',
    description_localizations: {
        "en-US": "Change the amount of gashapon",
        "zh-TW": "改變扭蛋數量",
    },
    options: [{
        name: 'User',
        type: ApplicationCommandOptionType.User,
        description: '',
        description_localizations: {
            "en-US": "User to change",
            "zh-TW": "要改變的人",
        },
        required: true,
    }, {
        name: 'Increase or decrease',
        type: ApplicationCommandOptionType.String,
		description: '',
		description_localizations: {
			"en-US": "Insert name and description of this prize",
			"zh-TW": "輸入這個獎品叫甚麼，以及簡單概述",
		},
        required: true,
        choices: [{
                name: 'Increase',
                value: 'add'
            },
            {
                name: 'Decrease',
                value: 'reduce'
            },
        ],
    }, {
        name: 'Amount',
        type: ApplicationCommandOptionType.Integer,
		description: '',
		description_localizations: {
			"en-US": "Amount that increased or decreased",
			"zh-TW": "增加或減少的數量",
		},
        required: true,
    }],
    video: 'https://mhcat.xyz/docs/coin_increase',
    emoji: `<:income:997374186794258452>`,
    UserPerms: '訊息管理',
    run: async (client, interaction, options, perms) => {
        await interaction.deferReply();
        try {
            function errors(content) {
                const embed = new EmbedBuilder().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("Red");
                interaction.editReply({
                    embeds: [embed]
                })
            }
            const user = interaction.options.getUser("使用者")
            const add_reduce = interaction.options.getString("增加或減少")
            const number = interaction.options.getInteger("數量")
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return errors(`你需要有\`${perms}\`才能使用此指令`)
            coin.findOne({
                guild: interaction.guild.id,
                member: user.id
            }, async (err, data) => {
                if (!data) {
                    if (add_reduce === "reduce") return errors("不可減到負數!")
                    data = new coin({
                        guild: interaction.guild.id,
                        member: user.id,
                        coin: Number(number),
                        today: true
                    })
                    data.save()
                } else {
                    if (add_reduce === "reduce") {
                        if (data.coin - number < 0) return errors("不可減到負數!")
                        data.collection.updateOne(({
                            guild: interaction.channel.guild.id,
                            member: user.id
                        }), {
                            $set: {
                                coin: data.coin - Number(number)
                            }
                        })
                    } else {
                        if (data.coin + Number(number) > 999999999) return errors("不可以加超過`999999999`!!")
                        data.collection.updateOne(({
                            guild: interaction.channel.guild.id,
                            member: user.id
                        }), {
                            $set: {
                                coin: data.coin + Number(number)
                            }
                        })
                    }
                }
                const good = new EmbedBuilder()
                    .setTitle(`<:money:997374193026994236>已為${user.username}\`${add_reduce === "reduce" ? "減少" : "增加"}\`:\`${number}\`個代幣!`)
                    .setFooter({
                        text: `${add_reduce === "reduce" ? "減少" : "增加"}${number}`,
                        iconURL: interaction.member.displayAvatarURL({
                            dynamic: true
                        })
                    })
                    .setColor('Random')
                interaction.editReply({
                    embeds: [good],
                    ephemeral: false
                })
            })

        } catch (error) {
            const error_send = require('../../functions/error_send.js')
            error_send(error, interaction)
        }
    }
}
