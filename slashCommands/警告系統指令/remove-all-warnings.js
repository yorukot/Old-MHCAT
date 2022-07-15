const db = require('../../models/warndb')
const text_xp = require("../../models/text_xp.js");
const canvacord = require("canvacord")
const join_role = require("../../models/join_role.js")
const ticket_js = require('../../models/ticket.js')
const voice_channel = require('../../models/voice_channel.js')
const moment = require('moment')
const { 
    MessageActionRow,
    MessageSelectMenu,
    MessageButton,
    MessageEmbed,
    Collector,
    Discord,
    MessageAttachment,
    Modal,
    TextInputComponent,
    Permissions
 } = require('discord.js');
 function getRandomArbitrary(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }
const { errorMonitor } = require("ws");
module.exports = {
    name: '警告全部清除',
    description: '清除一個使用者的全部警告',
    options: [{
        name: '使用者',
        type: 'USER',
        description: '要清除資料的使用者!',
        required: true
    }],
    //video: 'https://mhcat.xyz/commands/announcement.html',
    UserPerms: '訊息管理',
    emoji: `<:trashbin:986308183674990592>`,
    run: async (client, interaction, options, perms) => {
        try {
        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");interaction.reply({embeds: [embed]})}
        if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES))return errors(`你需要有\`${perms}\`才能使用此指令`)
        const user = interaction.options.getUser("使用者")
        db.findOne({
            guild: interaction.guild.id,
            user: user.id
        }, async (err, data) => {
            if (err) throw err;
            if (data) {
                await db.findOneAndDelete({
                    user: user.id,
                    guild: interaction.guild.id
                })
                const embed = new MessageEmbed()
                    .setTitle("<a:greentick:980496858445135893> | 這位使用者的警告成功移除!")
                    .setColor("GREEN")
                    interaction.reply({embeds:[embed]})
                const b = new MessageEmbed()
                .setColor("#00DB00")
                .setTitle("__**警告系統**__")
                .setDescription(`:white_check_mark: 你的所有警告被清除了!`)
                user.send({embeds: [b] })
            } else {
                errors("這位使用者沒有任何警告")
            }
        })


    } catch (error) {
        const error_send= require('../../functions/error_send.js')
        error_send(error, interaction)
    }
    }
}