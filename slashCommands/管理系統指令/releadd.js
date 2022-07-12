const text_xp = require("../../models/text_xp.js");
const canvacord = require("canvacord")
const btn = require("../../models/btn.js")
const moment = require("moment")
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }
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
module.exports = {
    name: '選取身分組設定',
    description: '設定領取身分組的消息(點按鈕自動增加身分組)',
    options: [{
        name: '身分組',
        type: 'ROLE',
        description: '輸入身分組!',
        required: true,
    }],
    //video: 'https://mhcat.xyz/commands/announcement.html',
    UserPerms: '訊息管理',
    emoji: `<:add:985948803469279303>`,
    run: async (client, interaction, options) => {
        try {
        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");interaction.reply({embeds: [embed],ephemeral: true})}
        if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES))return errors("你沒有權限使用這個指令")
        const role1 = interaction.options.getRole("身分組")
        if(Number(role1.position) >= Number(interaction.guild.me.roles.highest.position)) return errors("我沒有權限給大家這個身分組(請把我的身分組調高)!")
        const role = role1.id
        const random_number = getRandomArbitrary(0, 10000000000)
        const number1 = moment().utcOffset("+08:00").format('YYYYMMDDHHmm') + random_number + "add"
        const number2 = moment().utcOffset("+08:00").format('YYYYMMDDHHmm') + random_number + "delete"
        btn.findOne({
            guild: interaction.guild.id,
            number: moment().utcOffset("+08:00").format('YYYYMMDDHHmm') + random_number + "add",
            role: role
        }, async (err, data, data1) => {
            if (err) throw err; 
            if (!data) {
            data = new btn({
                guild: interaction.guild.id,
                number: number1,
                role: role
            }),
            data1 = new btn({
                guild: interaction.guild.id,
                number: number2,
                role: role
            })
            } else {
            return errors("很抱歉，出現了重複的資料，請重試!")
        }
        data.save()
        data1.save()
        })
        const modal = new Modal()
        .setCustomId("nal")
        .setTitle('領取身分系統!');
        const content = new TextInputComponent()
        .setCustomId('roleaddcontent' + moment().utcOffset("+08:00").format('YYYYMMDDHHmm') + random_number)
        .setLabel("請輸入身分訊息內文")
        .setStyle('PARAGRAPH');
        const content1 = new MessageActionRow().addComponents(content);
        modal.addComponents(content1);
        await interaction.showModal(modal);

    } catch (error) {
        const error_send= require('../../functions/error_send.js')
        error_send(error, interaction)
    }
    }
}