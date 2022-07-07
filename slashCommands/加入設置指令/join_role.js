const text_xp = require("../../models/text_xp.js");
const canvacord = require("canvacord")
const join_role = require("../../models/join_role.js")
const { 
    MessageActionRow,
    MessageSelectMenu,
    MessageButton,
    MessageEmbed,
    Collector,
    Discord,
    MessageAttachment,
    Permissions
 } = require('discord.js');
module.exports = {
    name: '加入身份組設置',
    description: '設定玩家加入時要給甚麼身份組',
    options: [{
        name: '身分組',
        type: 'ROLE',
        description: '輸入身分組!',
        required: true,
    }],
    video: 'https://mhcat.xyz/docs/join_role',
    UserPerms: '訊息管理',
    emoji: `<:roleplaying:985945121264635964>`,
    run: async (client, interaction, options) => {
        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");interaction.reply({embeds: [embed],ephemeral: true})}
        if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES))return errors("你沒有權限使用這個指令")
        const role1 = interaction.options.getRole("身分組")
        const role = role1.id
        if(Number(role1.position) >= Number(interaction.guild.me.roles.highest.position)) return errors("我沒有權限為大家增加這個身分組，請將我的身分組位階調高")
        join_role.findOne({
            guild: interaction.guild.id,
            role: role
        }, async (err, data) => {
            if (err) throw err; 
            if (!data) {
            data = new join_role({
                guild: interaction.guild.id,
                role: role
            })
            data.save()
            } else {
            return errors("很抱歉，這個身分組已經被註冊了，請重試!")
            }
            const embed = new MessageEmbed()
            .setTitle("🪂 加入身分組系統")
            .setColor(client.color.greate)
            .setDescription(`<a:green_tick:994529015652163614> **成功創建加入給身分組!**\n**身分組:** <@${role}>!`)
            interaction.reply({embeds: [embed]})
        })
    }
}