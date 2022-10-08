const text_xp = require("../../models/text_xp.js");
const canvacord = require("canvacord")
const verification = require("../../models/verification.js")
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
    name: '驗證設置',
    cooldown: 10,
    description: '設置驗證完成後要給甚麼身份組',
    options: [{
        name: '身分組',
        type: ApplicationCommandOptionType.Role,
        description: '輸入身份組!',
        required: true,
    },{
        name: '改名',
        type: ApplicationCommandOptionType.String,
        description: '輸入名稱，{name}代表原本的名稱ex:平名 | {name} 就會變成 平名 | 夜貓',
        required: false,
    }],
    video: 'https://mhcat.xyz/commands/announcement.html',
    UserPerms: '訊息管理',
    emoji: `<:configuration:984010500608249886>`,
    run: async (client, interaction, options, perms) => {
<<<<<<< HEAD
        await interaction.deferReply({ ephemeral: true });
=======
        await interaction.deferReply();
>>>>>>> a0da53e (🌟 | 更新各種東西)
        try {
        function errors(content){const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");interaction.editReply({embeds: [embed],ephemeral: true})}
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages))return errors(`你需要有\`${perms}\`才能使用此指令`)
        const role1 = interaction.options.getRole("身分組")
        const name1 = interaction.options.getString("改名")
        const name = name1 ? name1 : null
        const role = role1.id
        if(Number(role1.position) >= Number(interaction.guild.members.me.roles.highest.position)) return errors("我沒有權限為大家增加這個身分組，請將我的身分組位階調高")
        verification.findOne({
            guild: interaction.guild.id,
        }, async (err, data) => {
            if (err) throw err; 
            if (!data) {
            data = new verification({
                guild: interaction.guild.id,
                role: role,
                name: name
            })
            data.save()
            } else {
            data.delete()
            data = new verification({
                guild: interaction.guild.id,
                role: role,
                name: name
            })
            data.save()            
            }
            const embed = new EmbedBuilder()
            .setTitle("<a:green_tick:994529015652163614> 設置成功!")
            .setColor("Green")
            .setDescription(`<:roleplaying:985945121264635964>身分組: <@&${role}>!\n <:id:985950321975128094>改名為:${name}`)
<<<<<<< HEAD
            interaction.reply({embeds: [embed]})
=======
            interaction.editReply({embeds: [embed]})
>>>>>>> a0da53e (🌟 | 更新各種東西)
        })

    } catch (error) {
        const error_send= require('../../functions/error_send.js')
        error_send(error, interaction)
    }
    }
}