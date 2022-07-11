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
module.exports = {
    name: '統計系統創建',
    description: '創建統計消息',
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
        name: '統計選項',
        type: 'STRING',
        description: '輸入統計要統計甚麼',
        required: false,
        choices:[
            { name: '頻道數量', value: '頻道數量' },
            { name: '文字頻道數量', value: '文字頻道數量' },
            { name: '語音頻道數量', value: '語音頻道數量' },
        ],
    }],
    UserPerms: 'MANAGE_MESSAGES',
    //video: 'https://mhcat.xyz/commands/statistics.html',
    emoji: `<:statistics:986108146747600928>`,
    run: async (client, interaction, options) => {
        try {
        await interaction.deferReply().catch(e => { });
        function errors(content){const embed = new MessageEmbed().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("RED");interaction.followUp({embeds: [embed]})}
        const member = interaction.options.getString("統計選項")
        const vt = interaction.options.getString("統計頻道類型")
        const members = interaction.guild.members.cache.filter(member => !member.user.bot);
        const bots = interaction.guild.members.cache.filter(member => member.user.bot);
        if(vt !== "文字頻道" && vt !== "語音頻道")return errors("你沒有進行設置要文字頻道還是語音頻道!或是你打錯了!")
        const embed = new MessageEmbed()
                .setTitle("<a:greentick:980496858445135893> | 成功創建!頻道(不要動到數字就沒問題)跟類別的名稱都能自行更改喔!")
                .setColor("GREEN")
        Number.findOne({
            guild: interaction.guild.id,
        }, async (err, data) => {
            if (err) throw err;
            if(!data){
                const lodd = new MessageEmbed().setTitle(`<a:lodding:980493229592043581> | 正在進行設置中!`).setColor("GREEN")
                const lodding = await interaction.followUp({embeds: [lodd]})
                const parent = await interaction.guild.channels.create("伺服器統計數據(這串可隨便改)", { type: "GUILD_CATEGORY" });
                switch (vt) {
                    case "語音頻道":
                        const membernumber = await interaction.guild.channels.create(`總人數:${interaction.guild.members.cache.size}`, {
                            type:"GUILD_VOICE",
                            parent: parent.id,
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
                        })
                            const usernumber = await interaction.guild.channels.create(`總成員:${members.size}`, {
                            type:"GUILD_VOICE",
                            parent: parent.id,
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
                        })
                            const botnumber = await interaction.guild.channels.create(`總BOT數:${bots.size}`, {
                            type:"GUILD_VOICE",
                            parent: parent.id,
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
                        })
                        data = new Number({
                            guild: interaction.guild.id,
                                parent: parent.id,
                                memberNumber: membernumber.id,
                                memberNumber_name: interaction.guild.members.cache.size,
                                userNumber: usernumber.id,
                                userNumber_name: members.size,
                                BotNumber: botnumber.id,
                                BotNumber_name: bots.size,
                                channelnumber: null,
                                channelnumber_name: null,
                                textnumber: null,
                                textnumber_name: null,
                                voicenumber: null,
                                voicenumber_name: null,
                                categoriesnumber: null,
                                categoriesnumber_name: null,
                                rolesnumber: null,
                                rolesnumber_name: null,
                                rolenumber: null,
                                rolenumber_name: null,
                                norolenumber: null,
                                norolenumber_name: null,
                                emojisnumber: null, 
                                emojisnumber_name: null,
                                staticnumber: null,
                                staticnumber_name: null,
                                gifnumber: null,
                                gifnumber_name: null,
                                stickersnumber:null,
                                stickersnumber_name: null,
                                boostsnumber: null,
                                boostsnumber_name: null,
                                tier: null,
                                tier_name: null,
                                onlinenumber: null,
                                onlinenumber_name: null,
                                dndnumber: null,
                                dndnumber_name: null,
                                idlenumber: null,
                                idlenumber_name: null,
                                offlinenumber: null,
                                offlinenumber_name: null,
                                onlinebotnumber: null,
                                onlinebotnumber_name: null,
                                statusnumber: null,
                                statusnumber_name: null,
                        })
                        data.save()
                        break;
                        case "文字頻道":
                            const membernumber_text = await interaction.guild.channels.create(`總人數: ${interaction.guild.members.cache.size}`, {
                                type:"text",
                                parent: parent.id,
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
                            })
                            const usernumber_text = await interaction.guild.channels.create(`總成員: ${members.size}`, {
                                type:"text",
                                parent: parent.id,
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
                            })
                            const botnumber_text = await interaction.guild.channels.create(`總BOT數: ${bots.size}`, {
                                type:"text",
                                parent: parent.id,
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
                            })
                            data = new Number({
                                guild: interaction.guild.id,
                                parent: parent.id,
                                memberNumber: membernumber_text.id,
                                memberNumber_name: interaction.guild.members.cache.size,
                                userNumber: usernumber_text.id,
                                userNumber_name: members.size,
                                BotNumber: botnumber_text.id,
                                BotNumber_name: bots.size,
                                channelnumber: null,
                                channelnumber_name: null,
                                textnumber: null,
                                textnumber_name: null,
                                voicenumber: null,
                                voicenumber_name: null,
                                categoriesnumber: null,
                                categoriesnumber_name: null,
                                rolesnumber: null,
                                rolesnumber_name: null,
                                rolenumber: null,
                                rolenumber_name: null,
                                norolenumber: null,
                                norolenumber_name: null,
                                emojisnumber: null, 
                                emojisnumber_name: null,
                                staticnumber: null,
                                staticnumber_name: null,
                                gifnumber: null,
                                gifnumber_name: null,
                                stickersnumber:null,
                                stickersnumber_name: null,
                                boostsnumber: null,
                                boostsnumber_name: null,
                                tier: null,
                                tier_name: null,
                                onlinenumber: null,
                                onlinenumber_name: null,
                                dndnumber: null,
                                dndnumber_name: null,
                                idlenumber: null,
                                idlenumber_name: null,
                                offlinenumber: null,
                                offlinenumber_name: null,
                                onlinebotnumber: null,
                                onlinebotnumber_name: null,
                                statusnumber: null,
                                statusnumber_name: null,
                            })
                            data.save()
                        break;
                    default:
                        break;
                }
                lodding.edit({embeds: [embed]})
            }else{
                const all_channel = interaction.guild.channels.cache.filter((c) => c.type !== "category").size;
                const text_channel_number = interaction.guild.channels.cache.filter((c) => c.type === "GUILD_TEXT").size;
                const voice_channel_number = interaction.guild.channels.cache.filter((c) => c.type === "GUILD_VOICE").size;
                if(!member)return errors("由於你已經創建過了，所以你必須說明你要創建的統計名稱，或是刪除現有的統計資料(使用統計資料刪除)!")
                const parent_id = interaction.guild.channels.cache.get(data.parent) ? data.parent : null
                if(vt === "文字頻道"){
                    switch (member) {
                         //頻道數量 ===============================================================================================================
                        case "頻道數量":
                            if(data.channelnumber !== null )return errors("這個統計你已經創建過了!")
                            const botnumber_text = await interaction.guild.channels.create(`總頻道數: ${all_channel}`, {
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
                            })
                            data.collection.update(({guild: interaction.guild.id,}), {$set: {channelnumber: `${botnumber_text.id}`}})
                            data.collection.update(({guild: interaction.guild.id,}), {$set: {channelnumber_name: `${all_channel}`}})
                            interaction.followUp({embeds:[embed]})
                            break;
                            //文字頻道數量 ===============================================================================================================
                            case "文字頻道數量":
                            if(data.textnumber !== null )return errors("這個統計你已經創建過了!")
                            const text_channel = await interaction.guild.channels.create(`總文字頻道數: ${text_channel_number}`, {
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
                            })
                            data.collection.update(({guild: interaction.guild.id,}), {$set: {textnumber: `${text_channel.id}`}})
                            data.collection.update(({guild: interaction.guild.id,}), {$set: {textnumber_name: `${text_channel_number}`}})
                            interaction.followUp({embeds:[embed]})
                            break;
                            //文字頻道數量 ===============================================================================================================
                            case "語音頻道數量":
                            if(data.voicenumber !== null )return errors("這個統計你已經創建過了!")
                            const voice_channel = await interaction.guild.channels.create(`總語音頻道數: ${voice_channel_number}`, {
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
                            })
                            data.collection.update(({guild: interaction.guild.id,}), {$set: {voicenumber: `${voice_channel.id}`}})
                            data.collection.update(({guild: interaction.guild.id,}), {$set: {voicenumber_name: `${text_channel_number}`}})
                            interaction.followUp({embeds:[embed]})
                            break;
                        default:
                        return errors("沒有這項統計可以創建欸QQ")
                            break;
                    }
                }else if(vt === "語音頻道"){
                    switch (member) {
                        //頻道數量 ===============================================================================================================
                       case "頻道數量":
                           if(data.channelnumber !== null )return errors("這個統計你已經創建過了!")
                           const botnumber_text = await interaction.guild.channels.create(`總頻道數: ${all_channel}`, {
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
                           })
                           data.collection.update(({guild: interaction.guild.id,}), {$set: {channelnumber: `${botnumber_text.id}`}})
                           data.collection.update(({guild: interaction.guild.id,}), {$set: {channelnumber_name: `${all_channel}`}})
                           interaction.followUp({embeds:[embed]})
                           break;
                           //文字頻道數量 ===============================================================================================================
                           case "文字頻道數量":
                           if(data.textnumber !== null )return errors("這個統計你已經創建過了!")
                           const text_channel = await interaction.guild.channels.create(`總文字頻道數: ${text_channel_number}`, {
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
                           })
                           data.collection.update(({guild: interaction.guild.id,}), {$set: {textnumber: `${text_channel.id}`}})
                           data.collection.update(({guild: interaction.guild.id,}), {$set: {textnumber_name: `${text_channel_number}`}})
                           interaction.followUp({embeds:[embed]})
                           break;
                           //文字頻道數量 ===============================================================================================================
                           case "語音頻道數量":
                           if(data.voicenumber !== null )return errors("這個統計你已經創建過了!")
                           const voice_channel = await interaction.guild.channels.create(`總語音頻道數: ${voice_channel_number}`, {
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
                           })
                           data.collection.update(({guild: interaction.guild.id,}), {$set: {voicenumber: `${voice_channel.id}`}})
                           data.collection.update(({guild: interaction.guild.id,}), {$set: {voicenumber_name: `${text_channel_number}`}})
                           interaction.followUp({embeds:[embed]})
                           break;
                       default:
                        return errors("沒有這項統計可以創建欸QQ")
                           break;
                   }
                }
            }
        })


    } catch (error) {
        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setURL("https://discord.gg/7g7VE2Sqna")
            .setStyle("LINK")
            .setLabel("支援伺服器")
            .setEmoji("<:customerservice:986268421144592415>"),
            new MessageButton()
            .setURL("https://mhcat.xyz")
            .setEmoji("<:worldwideweb:986268131284627507>")
            .setStyle("LINK")
            .setLabel("官方網站")
        );
        return interaction.reply({
            embeds:[new MessageEmbed()
            .setTitle("<a:error:980086028113182730> | 很抱歉，出現了錯誤!")
            .setDescription("**如果可以的話再麻煩幫我到支援伺服器回報w**" + `\n\`\`\`${error}\`\`\`\n常見錯誤:\n\`Missing Access\`:**沒有權限**\n\`Missing Permissions\`:**沒有權限**`)
            .setColor("RED")
            ],
            components:[row]
        })
    }
}}