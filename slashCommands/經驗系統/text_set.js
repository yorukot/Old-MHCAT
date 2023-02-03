const text_xp_channel = require('../../models/text_xp_channel.js');
const canvacord = require("canvacord")
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
 var validateColor = require("validate-color").default;
 function checkURL(image) {
    return(image.match(/\.(jpg|png)$/) != null);
}
module.exports = {
    name: 'Chat-XP-settings',
    cooldown: 10,
	description: '',
	description_localizations: {
		"en-US": "Set where chat XP notification should be send",
		"zh-TW": "設定聊天經驗通知要在哪發送",
	},
    options: [{
        name: 'Channel',
        type: ApplicationCommandOptionType.Channel,
	    description: '',
	    description_localizations: {
		    "en-US": "Enter channel!",
		    "zh-TW": "輸入頻道!",
	    },
        channel_types: [0,5],
        required: true
    },{
        name: 'Message',
        type: ApplicationCommandOptionType.String,
	    description: '',
	    description_localizations: {
		    "en-US": "When a user level-up, enter (level)=level, (user)=tag user",
		    "zh-TW": "當有人升等的訊息，輸入:(leavel)為等級，(user)為tag使用者",
	    },
        required: false
    },{
        name: 'Color',
        type: ApplicationCommandOptionType.String,
	    description: '',
	    description_localizations: {
		    "en-US": "Enter user check color theme(default:white, yeah, i know)",
		    "zh-TW": "輸入玩家查詢的主題要甚麼顏色(默認為白色)!",
	    },
        required: false
    },{
        name: 'Background',
        type: ApplicationCommandOptionType.String,
	    description: '',
	    description_localizations: {
		    "en-US": "Enter user check background(default:discord color), support png and jpg, best size is 931*231",
		    "zh-TW": "輸入玩家查詢的背景(默認為discord色)支援png和jpg(可使用discord的複製連結)最佳大小為931*231",
	    },
        required: false
    }],
    video: 'https://mhcat.xyz/docs/chat_xp_set',
    UserPerms: '訊息管理',
    emoji: `<:configuration:984010500608249886>`,
    run: async (client, interaction, options, perms) => {
        await interaction.deferReply();
        try {
        function errors(content){const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");interaction.editReply({embeds: [embed]})}
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages))return errors(`你需要有\`${perms}\`才能使用此指令`)
        const channel1 = interaction.options.getChannel("頻道")
        const color = interaction.options.getString("顏色")
        const image = interaction.options.getString("背景")
        const message = interaction.options.getString("訊息")
        if(color){
            if (!validateColor(color)) return errors('你傳送的並不是顏色(色碼)')
        }
        if(image){
            if (!validateColor(image)){
                if(!checkURL(image)){
                    return errors('你傳送的並不是顏色或png或jpg連結')
                }
            }
        }
        const channel = channel1.id
        text_xp_channel.findOne({
            guild: interaction.channel.guild.id,
        }, async (err, data) => {
            if(data) data.delete()
                data = new text_xp_channel({
                    guild: interaction.channel.guild.id,
                    channel: channel,
                    background: image ? image : null,
                    color: color ? color : null,
                    message: message ? message : null,
                })
                data.save()
                const announcement_set_embed = new EmbedBuilder()
                .setTitle("聊天經驗系統")
                .setDescription(`您的聊天經驗升等頻道成功創建\n您目前的升等通知頻道為 ${channel1}`)
                .setColor("Green")
                interaction.editReply({embeds: [announcement_set_embed]})
                const lines = "<:line:992363971803881493>"
                if(message) interaction.channel.send(`以下為你的訊息預覽:\n${lines}我${lines}只${lines}是${lines}分${lines}隔${lines}線${lines}\n\n${message}`)   
        })
        } catch (error) {
        const error_send= require('../../functions/error_send.js')
        error_send(error, interaction)
    }
    }
}
