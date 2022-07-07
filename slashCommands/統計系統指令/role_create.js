const Number = require("../../models/Number.js");
const {
    Client,
    Message,
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    MessageAttachment,
    Permissions

} = require('discord.js');
const canvacord = require("canvacord");
const role_number = require("../../models/role.js");
module.exports = {
    name: '統計身分組人數',
    description: '統計某個特定的身分組的人數',
    options: [{
        name: '統計頻道類型',
        type: 'STRING',
        description: '輸入統計頻道要是文字頻道還是語音頻道',
        required: true,
        choices:[
            { name: '文字頻道', value: '文字頻道' },
            { name: '語音頻道', value: '語音頻道' },
        ],
    },{
        name: '身分組',
        type: 'ROLE',
        description: '輸入要統計哪個身分組',
        required: true,
    }],
    UserPerms: 'MANAGE_MESSAGES',
    //video: 'https://mhcat.xyz/commands/statistics.html',
    emoji: `<:statistics:986108146747600928>`,
    run: async (client, interaction, options) => {
        await interaction.deferReply().catch(e => { });
        const lodd = new MessageEmbed().setTitle(`<a:lodding:980493229592043581> | 正在進行設置中!`).setColor("GREEN")
        const lodding = await interaction.followUp({embeds: [lodd]})
        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");lodding.edit({embeds: [embed]})}
        const vt = interaction.options.getString("統計頻道類型")
        const role = interaction.options.getRole("身分組")
        const members = interaction.guild.members.cache.filter(member => member.roles.cache.some(role1 => role1.id === role.id));
        if(vt !== "文字頻道" && vt !== "語音頻道")return errors("你沒有進行設置要文字頻道還是語音頻道!或是你打錯了!")
        Number.findOne({
            guild: interaction.guild.id,
        }, async (err, data) => {
            if (err) throw err;
            if(!data){
                return errors("你還沒創建過統計頻道，請先使用`/統計系統創建`")
            }else{
                const parent_id = interaction.guild.channels.cache.get(data.parent) ? data.parent : null
                const voiceortext = vt === "文字頻道" ? {
                    type:"text",
                    parent: parent_id,
                    permissionOverwrites: [
                        {
                          id: interaction.guild.me.id,
                          allow: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.MANAGE_CHANNELS, Permissions.FLAGS.SEND_MESSAGES], //Allow permissions
                        },{
                            id: interaction.guild.roles.everyone.id,
                            deny: [Permissions.FLAGS.SEND_MESSAGES],
                            allow: [Permissions.FLAGS.VIEW_CHANNEL]
                        }
                     ]
                } : {
                    type:"GUILD_VOICE",
                    parent: parent_id,
                    permissionOverwrites: [
                    {
                      id: interaction.guild.me.id,
                      allow: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.MANAGE_CHANNELS, Permissions.FLAGS.CONNECT], //Allow permissions
                    },{
                        id: interaction.guild.roles.everyone.id,
                        deny: [Permissions.FLAGS.CONNECT],
                        allow: [Permissions.FLAGS.VIEW_CHANNEL]
                    }
                ]
                }
                    const voice_channel = await interaction.guild.channels.create(`${role.name}: ${members.size}`, voiceortext)
                    role_number.findOne({
                        guild: interaction.guild.id,
                        role: role.id
                    }, async (err, data1) => {
                        if (err) throw err;
                        if(!data1){
                            new role_number({
                                guild: interaction.guild.id,
                                channel: voice_channel.id,
                                channel_name: members.size,
                                role: role.id,
                            }).save()
                            lodding.edit({embeds: [
                                new MessageEmbed()
                                .setTitle("統計特定身分組成功創建")
                                .setDescription(`已成功為您創建統計特定身分組\n頻道:<#${voice_channel.id}> 名字可以更改喔，不要動到數字就好awa`)
                                .setColor("GREEN")
                            ]})
                        }else{
                            data1.delete();
                            new role_number({
                                guild: interaction.guild.id,
                                channel: voice_channel.id,
                                channel_name: members.size,
                                role: role.id,
                            }).save()
                            lodding.edit({embeds: [
                                new MessageEmbed()
                                .setTitle("統計特定身分組成功創建")
                                .setDescription(`已成功為您創建統計特定身分組\n頻道:<#${voice_channel.id}> 名字可以更改喔，不要動到數字就好awa`)
                                .setColor("GREEN")
                            ]})
                        }
                    })
            }
        })
}}