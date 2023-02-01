const gift_change = require("../../models/gift_change.js");
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
    name: 'Coin related settings',
    cooldown: 10,
	description: '',
	description_localizations: {
		"en-US": "Change the amount of coin gashapon requires",
		"zh-TW": "改變每次扭蛋所需的代幣數量",
	},
    options: [{
        name: 'Coin raffle takes',
        type: ApplicationCommandOptionType.Integer,
		description: '',
		description_localizations: {
			"en-US": "The amount of coin raffle requires",
			"zh-TW": "每次扭蛋所需的代幣數量,
		},
        required: true,
    }, {
        name: 'Check-in cooldown time',
        type: ApplicationCommandOptionType.Integer,
		description: '',
		description_localizations: {
			"en-US": "Time between check-in(Unit is hour)(If you want to set it to 0:00, type 0)",
			"zh-TW": "每次簽到所需時間(單位為小時)(如想設為0:00重製請打0)",
		},
        required: true,
    }, {
        name: 'Check-in give coins',
        type: ApplicationCommandOptionType.Integer,
		description: '',
		description_localizations: {
			"en-US": "How many amount of coin check-in gives",
			"zh-TW": "每次扭蛋所需的代幣數量",
		},
        required: true,
    }, {
        name: 'Notification channel',
        type: ApplicationCommandOptionType.Channel,
        channel_types: [0, 5],
		description: '',
		description_localizations: {
			"en-US": "Channel to announcement raffle winner",
			"zh-TW": "抽中後的通知頻道",
		},
        required: true,
    }, {
        name: 'Level up double amount',
        type: ApplicationCommandOptionType.Number,
        description: '等級提升時要給等級幾倍的代幣ex:假設你提升到9等，倍數設10就會得到 9*10=90',
        required: true,
    }],
    video: 'https://mhcat.xyz/docs/required_coins',
    emoji: `<:coins:997374177944281190>`,
    UserPerms: '訊息管理',
    run: async (client, interaction, options, perms) => {
        await interaction.deferReply();
        try {
            function errors(content) {
                const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");
                interaction.editReply({
                    embeds: [embed],
                    ephemeral: true
                })
            }
            const number = interaction.options.getInteger("抽獎所需代幣")
            const time = interaction.options.getInteger("簽到所需時間")
            const channel = interaction.options.getChannel("通知頻道")
            const sign_coin = interaction.options.getInteger("簽到給予代幣數")
            const xp_multiple = interaction.options.getNumber("等級提升倍數")
            if (number > 999999999) return errors("最高代幣設定數只能是999999999")
            if (sign_coin > 999999999) return errors("最高代幣設定數只能是999999999")
            if (time < 0 && time !== 0) return errors('必須大於-1(0代表0:00重製)')
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return errors(`你需要有\`${perms}\`才能使用此指令`)
            gift_change.findOne({
                guild: interaction.guild.id,
            }, async (err, data) => {
                if (!data) {
                    data = new gift_change({
                        guild: interaction.guild.id,
                        coin_number: number,
                        sign_coin: sign_coin,
                        channel: channel.id,
                        xp_multiple: xp_multiple,
                        time: time * 60 * 60
                    })
                    data.save()
                } else {
                    data.delete()
                    data = new gift_change({
                        guild: interaction.guild.id,
                        coin_number: number,
                        sign_coin: sign_coin,
                        channel: channel.id,
                        xp_multiple: xp_multiple,
                        time: time * 60 * 60
                    })
                    data.save()
                }
                const good = new EmbedBuilder()
                    .setTitle(`<:money:997374193026994236>成功改變每次扭蛋及抽獎代幣數\n扭蛋所需代幣:\`${number}\`\n簽到給予代幣數:\`${sign_coin}\`\n等級提升給予倍數:\`${xp_multiple}\`\n每次簽到所需時間:\`${time} 小時\``)
                    .setDescription(`通知頻道:${channel}`)
                    .setFooter({
                        text: "MHCAT",
                        iconURL: interaction.member.displayAvatarURL({
                            dynamic: true
                        })
                    })
                    .setColor('Random')
                interaction.editReply({
                    embeds: [good]
                })
            })

        } catch (error) {
            const error_send = require('../../functions/error_send.js')
            error_send(error, interaction)
        }
    }
}
