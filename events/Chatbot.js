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
    PermissionsBitField,
    ChannelType
} = require('discord.js');
const client = require('../index');
const chat = require('../models/chat.js')
const data_new = require("../chat.json");
const chatgpt_get = require('../models/chatgpt_get.js');
const chatgpt = require("../models/chatgpt.js");
function len(str) {
    return str.replace(/[^\x00-\xff]/g, "xx").length;
}
function getRandomArbitrary(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}


client.on('messageCreate', async (message) => {
    if (message.channel.type === ChannelType.DM) return
    if (message.author.bot) return;
    if (message.guild === null) return;
    if (!message.guild) return;
    chatgpt_get.findOne({
        guild: message.guild.id,
    }, async (err, data_chatgpt) => {
        if (!data_chatgpt) return 
        if (data_chatgpt.price <= 0) return 
        chat.findOne({
            guild: message.guild.id,
        }, async (err, data1) => {
            if (!data1) return 
            if (data1.channel !== message.channel.id) return 
            if (message.content.includes('@')) {
                let msg = await message.channel.send("為防止伺服器招到tag攻擊，請勿在與機器人聊天時含有@");
                message.delete()
                setTimeout(() => {
                    msg.delete()
                }, 4000);
            } else {


                chatgpt.findOne({
                    guild: message.guild.id,
                }, async (err, data) => {
                    if (data) {
                        if (Date.now() - data.time < 10000) {
                            let msg = await message.channel.send({
                                content: '一次只能傳送一個消息，請等待機器人回復完成後在繼續!',
                                ephemeral: true
                            });
                            message.delete()
                            setTimeout(() => {
                                msg.delete()
                            }, 2000);
                            return
                        } else if (Date.now() - data.time > 40000) {
                            data_chatgpt.collection.updateOne(({
                                guild: message.guild.id,
                            }), {
                                $set: {
                                    price: data_chatgpt.price - len(message.content) * 0.00003
                                }
                            })
                            data.collection.updateOne(({
                                guild: message.guild.id,
                            }), {
                                $set: {
                                    guild: message.guild.id,
                                    resid_c: null,
                                    resid_p: null,
                                    reply: false,
                                    message: message.content,
                                    time: Date.now()
                                }
                            })
                            message.channel.sendTyping()
                            setTimeout(() => {
                                chatgpt.findOne({
                                    guild: message.guild.id,
                                }, async (err, data) => {
                                    if (data.message.includes('@')) return message.reply('由於chatGPT回傳回來的訊息含有@，為防止遭到tag攻擊，已自動迴避該則消息!')
                                    message.reply({
                                        content: data.message,
                                    })
                                })
                            }, 10000)
                        } else {
                            data_chatgpt.collection.updateOne(({
                                guild: message.guild.id,
                            }), {
                                $set: {
                                    price: data_chatgpt.price - len(message.content) * 0.00003
                                }
                            })
                            data.collection.updateOne(({
                                guild: message.guild.id,
                            }), {
                                $set: {
                                    guild: message.guild.id,
                                    resid_c: data.resid_c,
                                    resid_p: data.resid_p,
                                    reply: false,
                                    message: message.content,
                                    time: Date.now()
                                }
                            })
                            message.channel.sendTyping()
                            setTimeout(() => {
                                chatgpt.findOne({
                                    guild: message.guild.id,
                                }, async (err, data) => {
                                    if (data.message.includes('@')) return message.reply('由於chatGPT回傳回來的訊息含有@，為防止遭到tag攻擊，已自動迴避該則消息!')
                                    message.reply({
                                        content: data.message,
                                    })
                                })
                            }, 10000)
                        }
                    } else {
                        data_chatgpt.collection.updateOne(({
                            guild: message.guild.id,
                        }), {
                            $set: {
                                price: data_chatgpt.price - len(message.content) * 0.00003
                            }
                        })
                        data = new chatgpt({
                            guild: message.guild.id,
                            resid_c: null,
                            resid_p: null,
                            reply: false,
                            message: message.content,
                            time: Date.now()
                        })
                        data.save()
                        message.channel.sendTyping()
                        setTimeout(() => {
                            chatgpt.findOne({
                                guild: message.guild.id,
                            }, async (err, data) => {
                                if (data.message.includes('@')) return message.reply('由於chatGPT回傳回來的訊息含有@，為防止遭到tag攻擊，已自動迴避該則消息!')
                                message.reply({
                                    content: data.message,
                                })
                            })
                        }, 10000)
                    }
                })
            }
        })
    })
})



client.on('messageCreate', async (message) => {
    if (message.channel.type === ChannelType.DM) return
    if (message.author.bot) return;
    if (message.guild === null) return;
    if (!message.guild) return;
    chatgpt_get.findOne({
        guild: message.guild.id,
    }, async (err, data_chatgpt) => {
        if (data_chatgpt && data_chatgpt.price >= 0) return
        chat.findOne({
            guild: message.guild.id,
        }, async (err, data1) => {
            if (!data1) return;
            if (data1.channel !== message.channel.id) return;

            function getRandomInt(max) {
                return Math.floor(Math.random() * max);
            }
            const con = message.content;
            if (con.length[1] = "說") {
                if (con.includes("說出" || "說")) {
                    const con1 = con.replace(/[說出]/gi, '');
                    if (con1.length === 0) return message.reply("說出甚麼?");
                    if (con.includes("幹" || "操" || "bitch")) {
                        message.reply("很抱歉，讀取到你說出了一些不好的字元，因此拒絕說出w" + "\n字元:")
                        return;
                    } else {
                        if (con1.includes("我")) {
                            const me = con1.replace("我", "你")
                            message.reply(`"${me}"`);
                            return;
                        } else {
                            message.reply(con1);
                            return;
                        }
                    }
                }
            };

            function similarity(s1, s2) {
                var longer = s1;
                var shorter = s2;
                if (s1.length < s2.length) {
                    longer = s2;
                    shorter = s1;
                }
                var longerLength = longer.length;
                if (longerLength == 0) {
                    return 1.0;
                }
                return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
            }

            function editDistance(s1, s2) {
                s1 = s1.toLowerCase();
                s2 = s2.toLowerCase();

                var costs = new Array();
                for (var i = 0; i <= s1.length; i++) {
                    var lastValue = i;
                    for (var j = 0; j <= s2.length; j++) {
                        if (i == 0)
                            costs[j] = j;
                        else {
                            if (j > 0) {
                                var newValue = costs[j - 1];
                                if (s1.charAt(i - 1) != s2.charAt(j - 1))
                                    newValue = Math.min(Math.min(newValue, lastValue),
                                        costs[j]) + 1;
                                costs[j - 1] = lastValue;
                                lastValue = newValue;
                            }
                        }
                    }
                    if (i > 0)
                        costs[s2.length] = lastValue;
                }
                return costs[s2.length];
            }

            let findCloestKeyData = (dataObject, matchKey) => {
                let mostMachingKey = '';
                let highestProbability = 0;
                Object.keys(dataObject).forEach(key => {
                    let probability = similarity(key, matchKey);
                    if (probability > highestProbability) {
                        highestProbability = probability;
                        mostMachingKey = key;
                    }
                });
                return dataObject[mostMachingKey];
            }
            const randomnumber = getRandomInt(100000000)
            let result = findCloestKeyData(data_new, con);
            const bt = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId(`${randomnumber}`)
                    .setLabel('回報錯誤')
                    .setStyle(ButtonStyle.Primary),
                );
            if (!result) {
                message.reply({
                    content: "我看不懂你的意思，在講一次好不好w"
                })
                return
            }

            message.channel.sendTyping()
            setTimeout(() => {
                message.reply({
                    content: result
                })
            }, getRandomArbitrary(1000, 5000))
        })
    })
})