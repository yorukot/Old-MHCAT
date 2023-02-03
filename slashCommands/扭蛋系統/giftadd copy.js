const gift = require("../../models/gift.js");
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
const { errorMonitor } = require("ws");
module.exports = {
    name: 'Gashapon-prize-amount-increase',
    cooldown: 10,
	description: '',
	description_localizations: {
		"en-US": "增加扭蛋的獎池裡的獎品的數量",
		"zh-TW": "Increase amount of prizes of gashapon",
	},
    options: [{
        name: 'Prize',
        type: ApplicationCommandOptionType.String,
	    description: '',
	    description_localizations: {
		    "en-US": "輸入這個獎品叫甚麼",
		    "zh-TW": "Enter prize name",
	    },
        required: true,
    },{
        name: 'How-many',
        type: ApplicationCommandOptionType.Number,
		description: '',
		description_localizations: {
			"en-US": "Enter how many prizes to add",
			"zh-TW": "輸入要增加多少個獎品",
		},
        required: true,
    }],
    video: 'https://mhcat.xyz/docs/prize_add',
    emoji: `<:add1:981722904251215872>`,
    UserPerms: '訊息管理',
    run: async (client, interaction, options, perms) => {
        await interaction.deferReply({ephemeral: true});
        try{
        function errors(content){const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");interaction.editReply({embeds: [embed],ephemeral: true})}
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages))return errors("你沒有權限使用這個指令")
        const gift_name = interaction.options.getString("獎品名稱")
        const gift_chence = interaction.options.getNumber("增加幾個")
        gift.findOne({
            guild: interaction.guild.id,
            gift_name: gift_name,
            }, async (err, data) => {
                if(data){
                    data.collection.updateOne(({
                        guild: interaction.guild.id,
                        gift_name: gift_name
                    }), {
                        $set: {
                            gift_count: data.gift_count + gift_chence
                        }
                    })
                    return interaction.editReply({
                        embeds:[
                            new EmbedBuilder()
                            .setTitle(client.emoji.done + "增加成功")
                            .addFields(
                                { name: '<:id:985950321975128094> **獎品名:**', value: `${data.gift_name}`, inline: true},
                                { name: '<:dice:997374185322057799> **獎品機率:**', value: `${data.gift_chence}`, inline: true},
                                { name: '<:security:997374179257102396> **獎品代碼:**', value: data.gift_code ? `${data.gift_code}` : "該獎品無代碼", inline: true},
                                { name: '<:counter:994585977207140423> **獎品數量:**', value: `${data.gift_count + gift_chence}個`, inline: true},
                                { name: '<:trashbin:995991389043163257> **自動刪除:**', value: `${data.auto_delete}`, inline: true},
                                { name: '<:givemoney:1019632789110399068> **給予代幣數:**', value: `${data.give_coin}個`, inline: true}
                            )
                            .setColor(client.color.greate)
                        ],
                        ephemeral: true
                    })
                }else{
                    return errors("找不到這個獎品!")
                }
            })
        } catch (error) {
            const error_send= require('../../functions/error_send.js')
            error_send(error, interaction)
        }
    }
}
