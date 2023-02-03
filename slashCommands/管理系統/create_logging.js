const text_xp = require("../../models/text_xp.js");
const canvacord = require("canvacord")
const logging = require('../../models/logging.js');
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
    name: 'Set-log-channel',
    cooldown: 10,
	description: '',
	description_localizations: {
		"en-US": "Set where log messages should send(I love this feature)",
		"zh-TW": "設置日誌訊息要在哪發送",
	},
    options: [{
        name: 'Channel',
        type: ApplicationCommandOptionType.Channel,
        channel_types: [0,5],
	    description: '',
	    description_localizations: {
		    "en-US": "Enter log channel!",
		    "zh-TW": "輸入日誌頻道!",
	    },
        required: true,
    }],
    //video: 'https://mhcat.xyz/commands/announcement.html',
    UserPerms: '訊息管理',
    emoji: `<:logfile:985948561625710663>`,
    run: async (client, interaction, options, perms) => {
        await interaction.deferReply();
        try {
        function errors(content){const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");interaction.editReply({embeds: [embed],ephemeral: true})}
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages))return errors(`你需要有\`${perms}\`才能使用此指令`)
        const channel = interaction.options.getChannel("頻道")
        const channel_id = channel.id
        logging.findOne({
            guild: interaction.channel.guild.id,
        }, async (err, data) => {
            if(data){
                // 度資料庫的內容進行更新
                data.collection.updateOne(({guild: interaction.channel.guild.id}), {$set: {channel_id: channel_id}})
                data.save()
                // 設定embed & send embed
                const announcement_set_embed = new EmbedBuilder()
                .setTitle("公告系統")
                .setDescription(`您的公告頻道成功更新\n您目前的公告頻道為 ${channel}`)
                .setColor("Green")
                interaction.editReply({embeds: [announcement_set_embed]})
            }else{
                // 創建一個新的data
                data = new logging({
                    guild: interaction.channel.guild.id,
                    channel_id: channel_id,
                })
                data.save()
                // 設定embed & send embed
                const announcement_set_embed = new EmbedBuilder()
                .setTitle("公告系統")
                .setDescription(`您的公告頻道成功更新\n您目前的公告頻道為 ${channel}`)
                .setColor("Green")
                interaction.editReply({embeds: [announcement_set_embed]})
            }
        })

    } catch (error) {
        const error_send= require('../../functions/error_send.js')
        error_send(error, interaction)
    }
    }
}
