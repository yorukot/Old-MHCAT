const guild = require('../../models/guild.js');
const ann_all_set = require('../../models/ann_all_set.js');
var validateColor = require("validate-color").default;
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
    name: 'Set-announcement-channel',
    cooldown: 10,
	description: '',
	description_localizations: {
		"en-US": "Set where announcement should be send",
		"zh-TW": "設定公告在哪發送",
	},
    options: [{
        name: 'One-time-announcement-channel',
        type: ApplicationCommandOptionType.Subcommand,
		description: '',
		description_localizations: {
			"en-US": "Set one-time announcement channel",
			"zh-TW": "設定一次性公告頻道要在哪發送",
		},
        options: [{
            name: 'Channel',
            type: ApplicationCommandOptionType.Channel,
		    description: '',
		    description_localizations: {
			    "en-US": "Set announcement channel!",
			    "zh-TW": "輸入公告發送的頻道!",
		    },
            required: true,
            channel_types: [0, 5],
        }]
    }, {
        name: 'Bind-announcement-channel',
        type: ApplicationCommandOptionType.Subcommand,
		description: '',
		description_localizations: {
			"en-US": "Set binding-type announcement channel and format of content",
			"zh-TW": "設定綁定型公告要在哪發送以及發送時的格式",
		},
        options: [{
            name: 'Channel',
            type: ApplicationCommandOptionType.Channel,
		    description_localizations: {
			    "en-US": "Enter which channel should be announcement channel!",
			    "zh-TW": "輸入公告發送的頻道!",
		    },
            required: true,
            channel_types: [0, 5],
        }, {
            name: 'Label',
            type: ApplicationCommandOptionType.String,
		    description: '',
		    description_localizations: {
			    "en-US": "Enter which role should be labeled",
			    "zh-TW": "輸入要標註哪個身分組!",
		    },
            required: true,
        }, {
            name: 'Color',
            type: ApplicationCommandOptionType.String,
		    description: '',
		    description_localizations: {
			    "en-US": "Enter this binding-type announcement channels setting!(Random if you want random color)",
			    "zh-TW": "輸入這個綁定公告頻道的設定!(隨機顏色請輸入Random)",
		    },
            required: true,
        }, {
            name: 'Title',
            type: ApplicationCommandOptionType.String,
		    description: '',
		    description_localizations: {
			    "en-US": "Enter which channel should be announcement channel!",
			    "zh-TW": "輸入公告發送的頻道!",
		    },
            required: true,
        }]
    }, {
        name: 'Delete-binding-type-announcement-channel',
        type: ApplicationCommandOptionType.Subcommand,
		description: '',
		description_localizations: {
			"en-US": "Delete settings before",
			"zh-TW": "刪除之前的設定",
		},
        options: [{
            name: 'Channel',
            type: ApplicationCommandOptionType.Channel,
		    description: '',
		    description_localizations: {
			    "en-US": "Enter which channel should be announcement channel!",
			    "zh-TW": "輸入公告發送的頻道!",
		    },
            required: true,
            channel_types: [0, 5],
        }]
    }],
    video: 'https://mhcat.xyz/docs/ann_set',
    UserPerms: '訊息管理',
    emoji: `<:configuration:984010500608249886>`,
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
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return errors(`你需要有\`${perms}\`才能使用此指令`)
            const channel = interaction.options.getChannel("頻道")
            //對資料庫進行更改
            if (interaction.options.getSubcommand() === "一次性公告頻道") {
                guild.findOne({
                    guild: interaction.channel.guild.id,
                }, async (err, data) => {
                    if (data) {
                        // 度資料庫的內容進行更新
                        data.collection.updateOne(({
                            guild: interaction.channel.guild.id
                        }), {
                            $set: {
                                announcement_id: channel.id
                            }
                        })
                        // 設定embed & send embed
                        const announcement_set_embed = new EmbedBuilder()
                            .setTitle("<:megaphone:985943890148327454> 公告系統")
                            .setDescription(`<:Channel:994524759289233438> **您的公告頻道成功__更新__!!**\n**您目前的公告頻道為**:${channel}`)
                            .setColor(client.color.greate)
                        interaction.editReply({
                            embeds: [announcement_set_embed]
                        })
                    } else {
                        // 創建一個新的data
                        data = new guild({
                            guild: interaction.channel.guild.id,
                            announcement_id: channel.id,
                        })
                        data.save()
                        // 設定embed & send embed
                        const announcement_set_embed = new EmbedBuilder()
                            .setTitle("<:megaphone:985943890148327454> 公告系統")
                            .setDescription(`<:Channel:994524759289233438> **您的公告頻道成功__創建__!!**\n**您目前的公告頻道為**:${channel}`)
                            .setColor(client.color.greate)
                        interaction.editReply({
                            embeds: [announcement_set_embed]
                        })
                    }
                })
            } else if (interaction.options.getSubcommand() === "綁定公告頻道") {
                ann_all_set.findOne({
                    guild: interaction.channel.guild.id,
                    announcement_id: channel.id
                }, async (err, data) => {
                    const tag = interaction.options.getString("標註")
                    const color = interaction.options.getString("顏色")
                    const title = interaction.options.getString("標題")
                    if (!validateColor(color) && color !== "Random") return errors('你傳送的並不是顏色(色碼)')
                    if (data) {
                        data.delete()
                        data = new ann_all_set({
                            guild: interaction.guild.id,
                            announcement_id: channel.id,
                            tag: tag,
                            color: color,
                            title: title,
                        })
                        data.save()
                        const announcement_set_embed = new EmbedBuilder()
                            .setTitle("<:megaphone:985943890148327454> 綁定型公告系統")
                            .setDescription(`<:Channel:994524759289233438> **您的綁定型公告頻道成功__更新__!!**\n**新增綁定型公告頻道為**:${channel}`)
                            .setColor(client.color.greate)
                        interaction.editReply({
                            embeds: [announcement_set_embed]
                        })
                    } else {
                        // 創建一個新的data
                        data = new ann_all_set({
                            guild: interaction.guild.id,
                            announcement_id: channel.id,
                            tag: tag,
                            color: color,
                            title: title,
                        })
                        data.save()
                        // 設定embed & send embed
                        const announcement_set_embed = new EmbedBuilder()
                            .setTitle("<:megaphone:985943890148327454> 綁定型公告系統")
                            .setDescription(`<:Channel:994524759289233438> **您的綁定型公告頻道成功__創建__!!**\n**新增綁定型公告頻道為**:${channel}`)
                            .setColor(client.color.greate)
                        interaction.editReply({
                            embeds: [announcement_set_embed]
                        })
                    }
                })
            } else if (interaction.options.getSubcommand() === "綁定公告頻道刪除") {
                ann_all_set.findOne({
                    guild: interaction.channel.guild.id,
                    announcement_id: channel.id
                }, async (err, data) => {
                    if (data) {
                        data.delete()
                        const announcement_set_embed = new EmbedBuilder()
                            .setTitle("<:megaphone:985943890148327454> 綁定型公告系統")
                            .setDescription(`${client.emoji.delete} **您的綁定型公告頻道成功__刪除__!!**\n**刪除的綁定型公告頻道為**:${channel}`)
                            .setColor(client.color.greate)
                        interaction.editReply({
                            embeds: [announcement_set_embed]
                        })
                    } else {
                        return errors('你沒有對這個頻道設定過綁定型公告!')
                    }
                })
            }

        } catch (error) {
            const error_send = require('../../functions/error_send.js')
            error_send(error, interaction)
        }
    }
}
