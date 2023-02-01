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
const ghp = require('../../models/ghp.js')
const coin = require('../../models/coin.js');
const canvacord = require("canvacord");
let row1 = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
        .setCustomId("1" + "ghp_number")
        .setEmoji("<:numberone:1005471516407906324>")
        .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
        .setCustomId("2" + "ghp_number")
        .setEmoji("<:number2:1005471518018510950>")
        .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
        .setCustomId("3" + "ghp_number")
        .setEmoji("<:number3:1005471519574597672>")
        .setStyle(ButtonStyle.Secondary),
    );
let row2 = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
        .setCustomId("4" + "ghp_number")
        .setEmoji("<:numberfour:1005471521147473950>")
        .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
        .setCustomId("5" + "ghp_number")
        .setEmoji("<:number5:1005471522649022517>")
        .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
        .setCustomId("6" + "ghp_number")
        .setEmoji("<:six:1005471524721020948>")
        .setStyle(ButtonStyle.Secondary),
    );
let row3 = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
        .setCustomId("7" + "ghp_number")
        .setEmoji("<:seven:1005471526222581760>")
        .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
        .setCustomId("8" + "ghp_number")
        .setEmoji("<:number8:1005471527891898398>")
        .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
        .setCustomId("9" + "ghp_number")
        .setEmoji("<:number9:1005471529699655780>")
        .setStyle(ButtonStyle.Secondary),
    );
module.exports = {
    name: 'Coin-shop',
	description: '',
	description_localizations: {
		"en-US": "Use coin to buy some cool kid stuff!",
		"zh-TW": "使用你所賺到的代幣買一些特別的東西吧!",
	},
    cooldown: 5,
    options: [{
        name: 'Item-increase',
        type: ApplicationCommandOptionType.Subcommand,
		description: '',
		description_localizations: {
			"en-US": "Increase items in shop!",
			"zh-TW": "增加代幣商店裡的商品!",
		},
        options: [{
            name: 'Item-name',
            type: ApplicationCommandOptionType.String,
		    description: '',
		    description_localizations: {
			    "en-US": "Enter the name of this item!",
			    "zh-TW": "輸入這個商品的名稱!",
		    },
            required: true,
        }, {
            name: 'Coins-item-need',
            type: ApplicationCommandOptionType.Integer,
		    description: '',
		    description_localizations: {
			    "en-US": "Enter how many coins does this item need!!",
			    "zh-TW": "輸入這個商品需要多少代幣才能購買!!",
		    },
            required: true,
        }, {
            name: 'Item-description',
            type: ApplicationCommandOptionType.String,
		    description: '',
		    description_localizations: {
			    "en-US": "Enter the description of this item!",
			    "zh-TW": "輸入這個商品的描述!",
		    },
            required: true,
        }, {
            name: 'Delete-after-purchase',
            type: ApplicationCommandOptionType.Boolean,
		    description: '',
		    description_localizations: {
			    "en-US": "Should this item automatically delete after purchase!(If condition is false the amount of item won't decrease)",
			    "zh-TW": "這個商品是否要在當玩家購買後自動刪除!(如填寫false連商品數量都不會減少)",
		    },
            required: true,
        }, {
            name: 'Serial-number',
            type: ApplicationCommandOptionType.String,
		    description: '',
		    description_localizations: {
			    "en-US": "The serial number of this item. e.g. steam serial number",
			    "zh-TW": "這個商品的序號:ex:steam序號",
		    },
            required: false,
        }, {
            name: 'Is-this-item-a-role',
            type: ApplicationCommandOptionType.Role,
		    description: '',
		    description_localizations: {
			    "en-US": "Enter is this item a role or not!(If yes, enter the role you want, if else just ignore)",
			    "zh-TW": "輸入這個商品是不是身分組!(如果是請填寫你要的身分組，不是請忽略)",
		    },
            required: false,
        }, {
            name: 'Item-amount',
            type: ApplicationCommandOptionType.Integer,
		    description: '',
		    description_localizations: {
			    "en-US": "The amount of this item!",
			    "zh-TW": "這個商品有幾個!",
		    },
            required: false,
        }]
    }, {
        name: 'Item-delete',
        type: ApplicationCommandOptionType.Subcommand,
		description: '',
		description_localizations: {
			"en-US": "Delete a item(using item id)",
			"zh-TW": "刪除某個商品(使用商品id)",
		},
        options: [{
            name: 'Item-id',
            type: ApplicationCommandOptionType.Integer,
		    description: '',
		    description_localizations: {
			    "en-US": "The id of the item you want to delete!",
			"   zh-TW": "要刪除的商品的id!",
		    },
            required: true,
        }]
    }, {
        name: 'Buy-items',
        type: ApplicationCommandOptionType.Subcommand,
		description: '',
		description_localizations: {
			"en-US": "Buy items in the gashapon shop",
			"zh-TW": "購買扭蛋商店裡的商品",
		},
        options: [{
            name: 'Item-id',
            type: ApplicationCommandOptionType.Integer,
		    description: '',
		    description_localizations: {
			    "en-US": "Enter the id of the item you want to buy",
			    "zh-TW": "輸入要購買商品的id!",
		    },
            required: true,
        }, {
            name: 'Purchase-quantity',
            type: ApplicationCommandOptionType.Integer,
		    description: '',
		    description_localizations: {
			    "en-US": "Enter how many quantity you want to purchase!(Default is set as 1)",
			    "zh-TW": "輸入購買數量!(不填的話預設為1)",
		    },
            required: false,
        }]
    }, {
        name: 'Items-check',
        type: ApplicationCommandOptionType.Subcommand,
		description: '',
		description_localizations: {
			"en-US": "Check all items id and description",
			"zh-TW": "查詢所有商品id及商品資訊",
		},
        options: [{
            name: 'Item-id',
            type: ApplicationCommandOptionType.Integer,
		    description: '',
		    description_localizations: {
			    "en-US": "If you want to check the description of this item, enter this area",
			    "zh-TW": "如需查看該商品的詳細資料，請填此項!",
		    },
            required: false,
        }]
    }],
    UserPerms: '查詢跟購買大家都可用，剩下皆須訊息管理',
    //video: 'https://mhcat.xyz/commands/statistics.html',
    emoji: `<:store:1001118704651743372>`,
    run: async (client, interaction, options, perms) => {
        let choies = ""
        await interaction.deferReply();
        try {
            function errors(content) {
                const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");
                interaction.editReply({
                    embeds: [embed]
                })
            }
            if (interaction.options.getSubcommand() === "商品增加") {
                if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return errors(`你需要有\`${perms}\`才能使用此指令`)
                let name = interaction.options.getString("商品名")
                if (name.length > 15) return errors('商品名請少於15字!')
                let need_coin = interaction.options.getInteger("商品所需代幣")
                let commodity_description = interaction.options.getString("商品描述")
                let code11 = interaction.options.getString("序號")
                let auto_delete = interaction.options.getBoolean("是否要在購買後自動刪除")
                let role2 = interaction.options.getRole("商品是否為身分組")
                let commodity_count1 = interaction.options.getInteger("商品數量")
                let code = code11 ? code11 : null
                let commodity_count = commodity_count1 ? commodity_count1 : 1
                let role = role2 ? role2 : null

                if (need_coin < 0) return errors("`商品所需代幣`不可為負數!!!")
                if (commodity_count <= 0) return errors("商品數量不可小於或等於0!!")
                if (role && (Number(role.position) >= Number(interaction.guild.members.me.roles.highest.position))) return errors("我沒有權限為大家增加這個身分組，請將我的身分組位階調高")

                const id = Date.now()
                ghp.findOne({
                    guild: interaction.channel.guild.id,
                    commodity_id: id
                }, async (err, data) => {
                    ghp.find({
                        guild: interaction.channel.guild.id,
                    }, async (err, data1) => {
                        if (data1.length > 24) {
                            return errors("很抱歉，商品數量已達到上限!請刪除商品!")
                        } else {
                            if (data) return errors("很抱歉，資料重複，請等待幾秒後重試!")

                            data = new ghp({
                                guild: interaction.guild.id,
                                commodity_id: id,
                                name: name,
                                need_coin: need_coin,
                                commodity_description: commodity_description,
                                code: code,
                                auto_delete: auto_delete,
                                role: role2 ? role2.id : null,
                                commodity_count: commodity_count,
                            })
                            data.save()

                            const embed = new EmbedBuilder()
                                .setTitle(`<:store:1001118704651743372> 代幣商店系統`)
                                .setDescription(`已為您添加該商品!`)
                                .setFields({
                                    name: `<:id:985950321975128094> 商品名稱: ${name}`,
                                    value: `商品id:\`${id}\`\n需要代幣數: \`${need_coin}\`\n商品描述:\`${commodity_description}\`\n商品是否自動刪除:\`${auto_delete}\`\n身分組:\`${role}\n商品數量:${commodity_count}\``,
                                })
                                .setColor(client.color.greate)

                            interaction.editReply({
                                embeds: [embed]
                            })
                        }

                    })

                })

            } else if (interaction.options.getSubcommand() === "商品刪除") {

                if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return errors(`你需要有\`${perms}\`才能使用此指令`)

                let id = interaction.options.getInteger("商品id")

                ghp.findOne({
                    guild: interaction.channel.guild.id,
                    commodity_id: id
                }, async (err, data) => {

                    if (!data) return errors("很抱歉，找不到這個商品，是不是打錯了?!")

                    if (data) data.delete()

                    const embed = new EmbedBuilder()
                        .setTitle(`<:store:1001118704651743372> 代幣商店系統`)
                        .setDescription(`${client.emoji.delete}已為您刪除該商品!`)
                        .setColor(client.color.greate)

                    interaction.editReply({
                        embeds: [embed]
                    })
                })
            } else if (interaction.options.getSubcommand() === "購買商品") {

                let id = interaction.options.getInteger("商品id")
                let need_count111 = interaction.options.getInteger("購買數量")
                let need_count = need_count111 ? need_count111 : 1

                if (need_count <= 0) return errors("購買數量必須大於0!")

                ghp.findOne({
                    guild: interaction.channel.guild.id,
                    commodity_id: id
                }, async (err, data) => {

                    if (!data) return errors("很抱歉，找不到這個商品，是不是打錯了?!")

                    coin.findOne({
                        guild: interaction.guild.id,
                        member: interaction.member.id
                    }, async (err, coin) => {

                        if (!coin) return errors("你還沒有任何代幣欸使用`/簽到`或是多講話，都可以獲得代幣喔!")
                        if (coin.coin < (Number(data.need_coin) * need_count)) return errors("你的代幣數不夠!")
                        if (data.commodity_count < need_count) return errors(`很抱歉!該商品數量只剩下:\`${data.commodity_count}\``)

                        if (data.auto_delete && data.commodity_count === 1) data.delete()

                        let role = interaction.guild.roles.cache.get(data.role)
                        if (role && need_count > 1) return errors("這項商品為身分組商品，只能購買一樣!")
                        if (role) interaction.member.roles.add(role)

                        if (data.code !== null) interaction.member.send({
                            embeds: [
                                new EmbedBuilder()
                                .setTitle(`${client.emoji.done}您已成功購買\`${data.name}\``)
                                .setDescription(`<:security:997374179257102396> 您的獎品代碼:\n\`${data.code}\``)
                                .setColor(client.color.greate)
                            ]
                        })

                        if (data.auto_delete) data.collection.updateOne(({
                            guild: interaction.channel.guild.id,
                            commodity_id: id
                        }), {
                            $set: {
                                commodity_count: data.commodity_count - need_count
                            }
                        })
                        coin.collection.updateOne(({
                            guild: interaction.channel.guild.id,
                            member: interaction.member.id
                        }), {
                            $set: {
                                coin: coin.coin - (Number(data.need_coin) * need_count)
                            }
                        })

                        const embed = new EmbedBuilder()
                            .setTitle(`<:store:1001118704651743372> 代幣商店系統`)
                            .setDescription(`${client.emoji.done}您已成功購買:${data.name}\n數量:${need_count}!`)
                            .setColor(client.color.greate)

                        interaction.editReply({
                            embeds: [embed]
                        })
                    })
                })
            } else if (interaction.options.getSubcommand() === "商品查詢") {

                let id = interaction.options.getInteger("商品id")

                if (id) {
                    ghp.findOne({
                        guild: interaction.guild.id,
                        commodity_id: id
                    }, async (err, data) => {
                        if (!data) return errors("找不到這個商品，是不是輸入錯誤了呢?")
                        return interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                .setTitle(`<:creativeteaching:986060052949524600> 以下是${data.name}的詳細資料`)
                                .setDescription(`商品id:\n\`\`\`${data.commodity_id}\`\`\`` +
                                    `商品價格:\n\`\`\`${Number(data.need_coin)} 個代幣\`\`\`` +
                                    `商品描述:\n\`\`\`${data.commodity_description}\`\`\`` +
                                    `是否在買走後自動刪除:\n\`\`\`${data.auto_delete}\`\`\`` +
                                    `商品是否會附加身分組:\n<@&${data.role}>\n ` +
                                    `商品數量:\n\`\`\`${data.commodity_count}\`\`\``
                                )
                                .setColor("Random")
                                .setFooter({
                                    text: `${interaction.user.tag}的查詢`,
                                    iconURL: interaction.user.displayAvatarURL({
                                        dynamic: true
                                    })
                                })
                            ]
                        })
                    })
                } else {
                    ghp.find({
                        guild: interaction.guild.id,
                    }, async (err, data) => {
                        if (data.length === 0) return errors("目前商店沒有任何商品喔!")
                        let test = []
                        const array = []
                        let buttons = []
                        let buttons1 = []
                        let buttons2 = []
                        let buttons3 = []
                        let buttons4 = []
                        for (let i = 0; i < data.length; i++) {
                            let arrary111 = {
                                name: `<:id:985950321975128094> **商品名 :** \`${data[i].name}\``,
                                value: `💰 **商品價錢 :**\`${data[i].need_coin}\`\n<:productdescription:1001163044560314398> **商品說明 :**\`${data[i].commodity_description}\`\n<:id:985950321975128094> **商品id:**\`${data[i].commodity_id}\``,
                                inline: true
                            }
                            array.push(arrary111)
                            if ((buttons.length > 4) && !(buttons1.length > 4)) {
                                buttons1.push(
                                    new ButtonBuilder()
                                    .setCustomId(`${data[i].commodity_id}`)
                                    .setLabel(data[i].name)
                                    .setStyle(ButtonStyle.Primary)
                                )
                            } else if (buttons1.length > 4 && !(buttons2.length > 4)) {
                                buttons2.push(
                                    new ButtonBuilder()
                                    .setCustomId(`${data[i].commodity_id}`)
                                    .setLabel(data[i].name)
                                    .setStyle(ButtonStyle.Primary)
                                )
                            } else if (buttons2.length > 4 && !(buttons3.length > 4)) {
                                buttons3.push(
                                    new ButtonBuilder()
                                    .setCustomId(`${data[i].commodity_id}`)
                                    .setLabel(data[i].name)
                                    .setStyle(ButtonStyle.Primary)
                                )
                            } else if (buttons3.length > 4 && !(buttons4.length > 4)) {
                                buttons4.push(
                                    new ButtonBuilder()
                                    .setCustomId(`${data[i].commodity_id}`)
                                    .setLabel(data[i].name)
                                    .setStyle(ButtonStyle.Primary)
                                )
                            } else {
                                buttons.push(
                                    new ButtonBuilder()
                                    .setCustomId(`${data[i].commodity_id}`)
                                    .setLabel(data[i].name)
                                    .setStyle(ButtonStyle.Primary)
                                )
                            }
                        }
                        all_shop = new ActionRowBuilder()
                            .addComponents(
                                buttons
                            );
                        all_shop1 = new ActionRowBuilder()
                            .addComponents(
                                buttons1
                            );
                        all_shop2 = new ActionRowBuilder()
                            .addComponents(
                                buttons2
                            );
                        all_shop3 = new ActionRowBuilder()
                            .addComponents(
                                buttons3
                            );
                        all_shop4 = new ActionRowBuilder()
                            .addComponents(
                                buttons4
                            );
                        test.push(all_shop)
                        if (buttons1.length > 0) {
                            test.push(all_shop1)
                            if (buttons2.length > 0) {
                                test.push(all_shop2)
                                if (buttons3.length > 0) {
                                    test.push(all_shop3)
                                    if (buttons4.length > 0) {
                                        test.push(all_shop4)
                                    }
                                }
                            }
                        }

                        let msgg = await interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                .setTitle(`<:list:992002476360343602> 以下是${interaction.guild.name}的商店`)
                                .setColor('Random')
                                .setFields(array)
                                .setDescription('<a:arrow_pink:996242460294512690> **點擊下方的按扭進行購買及查詢詳情!**')
                                .setFooter({
                                    text: `${interaction.user.tag}的查詢`,
                                    iconURL: interaction.user.displayAvatarURL({
                                        dynamic: true
                                    })
                                })
                            ],
                            components: test
                        })
                        const filter = i => {
                            if (msgg.id !== i.message.id) return false
                            if (i.member.id !== interaction.member.id) {
                                i.reply({
                                    embeds: [
                                        new EmbedBuilder()
                                        .setColor(client.color.error)
                                        .setTitle(`${client.emoji.error} | 你不是查詢者無法使用!`)
                                    ],
                                    ephemeral: true
                                })
                                return false
                            }
                            return true
                        }
                        const collector1 = interaction.channel.createMessageComponentCollector({
                            componentType: 2,
                            filter,
                            time: 60 * 10 * 1000,
                            max: 1
                        })
                        collector1.on('collect', async (interaction01) => {
                            const id = interaction01.customId;
                            if (!id.includes('ghp') && !id.includes('ghp_number')) {
                                ghp.findOne({
                                    guild: interaction.channel.guild.id,
                                    commodity_id: id
                                }, async (err, data) => {
                                    function errorss(content) {
                                        const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");
                                        interaction01.update({
                                            embeds: [embed]
                                        })
                                    }
                                    if (!data) return errorss("很抱歉，找不到這個商品，請於幾秒鐘後重試!")
                                    let aaaaaaa = new ActionRowBuilder()
                                        .addComponents(
                                            new ButtonBuilder()
                                            .setCustomId(id + "ghp")
                                            .setLabel("購買該商品")
                                            .setEmoji("<:addtocart:1010884094088978474>")
                                            .setStyle(ButtonStyle.Success)
                                        )
                                    interaction01.update({
                                        embeds: [
                                            new EmbedBuilder()
                                            .setTitle(`<:creativeteaching:986060052949524600> 以下是${data.name}的詳細資料`)
                                            .setDescription(`<:id:1010884394791207003> 商品id:\n\`\`\`${data.commodity_id}\`\`\`` +
                                                `<:pricetag:1010884565822349392> 商品價格:\n\`\`\`${Number(data.need_coin)} 個代幣\`\`\`` +
                                                `<:sign:997374180632825896> 商品描述:\n\`\`\`${data.commodity_description}\`\`\`` +
                                                `<:trashbin:995991389043163257> 是否自動刪除:\n\`\`\`${data.auto_delete}\`\`\`` +
                                                `<:roleplaying:985945121264635964> 是否會附加身分組:\n${data.role === null ? '不會' : `<@&${data.role}>`}\n ` +
                                                `<:counter:994585977207140423> 商品數量:\n\`\`\`${data.commodity_count}\`\`\``
                                            )
                                            .setColor("Random")
                                        ],
                                        components: [aaaaaaa]
                                    })
                                    const collector111 = interaction.channel.createMessageComponentCollector({
                                        componentType: 2,
                                        filter,
                                        time: 60 * 10 * 1000,
                                    })
                                    collector111.on('collect', async (interaction01) => {
                                        const id = interaction01.customId;
                                        if (!id.includes('ghp_number')) {
                                            let new_id = id.replace("ghp", '')
                                            let row4 = new ActionRowBuilder()
                                                .addComponents(
                                                    new ButtonBuilder()
                                                    .setCustomId("back" + "ghp_number")
                                                    .setEmoji("<:previous:1010916328045035560>")
                                                    .setStyle(ButtonStyle.Danger),
                                                    new ButtonBuilder()
                                                    .setCustomId("0" + "ghp_number")
                                                    .setEmoji("<:zero1:1010925602066399273>")
                                                    .setStyle(ButtonStyle.Secondary),
                                                    new ButtonBuilder()
                                                    .setCustomId("confirm" + "ghp_number" + new_id)
                                                    .setEmoji("<:confirm:1010916326405054515>")
                                                    .setStyle(ButtonStyle.Success),
                                                );
                                            interaction01.update({
                                                embeds: [
                                                    new EmbedBuilder()
                                                    .setTitle('<:choose:1007244640958808088> 請選擇購買數量!')
                                                    .setColor(client.color.greate)
                                                    .setDescription(`<:id:1010884394791207003> 商品id:\n\`\`\`${data.commodity_id}\`\`\`` +
                                                        `<:pricetag:1010884565822349392> 商品價格:\n\`\`\`${Number(data.need_coin)} 個代幣\`\`\`` +
                                                        `<:sign:997374180632825896> 商品描述:\n\`\`\`${data.commodity_description}\`\`\`` +
                                                        `<:trashbin:995991389043163257> 是否自動刪除:\n\`\`\`${data.auto_delete}\`\`\`` +
                                                        `<:roleplaying:985945121264635964> 是否會附加身分組:\n${data.role === null ? '不會' : `<@&${data.role}>`}\n ` +
                                                        `<:counter:994585977207140423> 商品數量:\n\`\`\`${data.commodity_count}\`\`\`` +
                                                        `目前選擇數量:`
                                                    )
                                                    .setColor('Random')
                                                ],
                                                components: [row1, row2, row3, row4]
                                            })
                                        } else {
                                            let new_id = id.replace("ghp_number", '')
                                            if (new_id.includes('back')) {
                                                choies = choies.slice(0, -1);
                                                interaction01.update({
                                                    embeds: [
                                                        new EmbedBuilder()
                                                        .setTitle('<:choose:1007244640958808088> 請選擇購買數量!')
                                                        .setColor(client.color.greate)
                                                        .setDescription(`<:id:1010884394791207003> 商品id:\n\`\`\`${data.commodity_id}\`\`\`` +
                                                            `<:pricetag:1010884565822349392> 商品價格:\n\`\`\`${Number(data.need_coin)} 個代幣\`\`\`` +
                                                            `<:sign:997374180632825896> 商品描述:\n\`\`\`${data.commodity_description}\`\`\`` +
                                                            `<:trashbin:995991389043163257> 是否自動刪除:\n\`\`\`${data.auto_delete}\`\`\`` +
                                                            `<:roleplaying:985945121264635964> 是否會附加身分組:\n${data.role === null ? '不會' : `<@&${data.role}>`}\n ` +
                                                            `<:counter:994585977207140423> 商品數量:\n\`\`\`${data.commodity_count}\`\`\`` +
                                                            `目前選擇數量:\`${choies}\``
                                                        )
                                                        .setColor('Random')
                                                    ],
                                                })
                                            } else if (new_id.includes('confirm')) {
                                                let new_new_id = new_id.replace('confirm', '')

                                                function errors11111(content) {
                                                    const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");
                                                    interaction01.update({
                                                        embeds: [embed],
                                                        components: []
                                                    })
                                                }
                                                let need_count = Number(choies)
                                                if (Number(choies) <= 0) return interaction01.reply({
                                                    content: ':x: | 購買數量必須大於0!',
                                                    ephemeral: true
                                                })
                                                ghp.findOne({
                                                    guild: interaction.channel.guild.id,
                                                    commodity_id: new_new_id
                                                }, async (err, data) => {
                                                    if (!data) return interaction01.reply({
                                                        content: ':x: | 很抱歉，找不到這個商品，請重試!',
                                                        ephemeral: true
                                                    })
                                                    coin.findOne({
                                                        guild: interaction.guild.id,
                                                        member: interaction.member.id
                                                    }, async (err, coin) => {
                                                        if (!coin) return errors11111("你還沒有任何代幣欸使用`/簽到`或是多講話，都可以獲得代幣喔!")
                                                        if (coin.coin < (Number(data.need_coin) * need_count)) return errors11111("你的代幣數不夠!")

                                                        if (data.auto_delete && data.commodity_count === 1) data.delete()

                                                        let role = interaction.guild.roles.cache.get(data.role)
                                                        if (role) interaction.member.roles.add(role)

                                                        if (data.code !== null) interaction01.member.send({
                                                            embeds: [
                                                                new EmbedBuilder()
                                                                .setTitle(`${client.emoji.done}您已成功購買\`${data.name}\``)
                                                                .setDescription(`<:security:997374179257102396> 您的獎品代碼:\n\`${data.code}\``)
                                                                .setColor(client.color.greate)
                                                            ]
                                                        })

                                                        if (data.auto_delete) data.collection.updateOne(({
                                                            guild: interaction.channel.guild.id,
                                                            commodity_id: id
                                                        }), {
                                                            $set: {
                                                                commodity_count: data.commodity_count - need_count
                                                            }
                                                        })
                                                        coin.collection.updateOne(({
                                                            guild: interaction.channel.guild.id,
                                                            member: interaction.member.id
                                                        }), {
                                                            $set: {
                                                                coin: coin.coin - (Number(data.need_coin) * need_count)
                                                            }
                                                        })

                                                        const embed = new EmbedBuilder()
                                                            .setTitle(`<:store:1001118704651743372> 代幣商店系統`)
                                                            .setDescription(`${client.emoji.done}您已成功購買:${data.name}\n數量:${need_count}!`)
                                                            .setColor(client.color.greate)

                                                        interaction01.update({
                                                            embeds: [embed],
                                                            components: []
                                                        })
                                                    })
                                                })
                                            } else {
                                                choies = choies + `${new_id}`
                                                if (Number(choies) > Number(data.commodity_count)) {
                                                    choies = choies.slice(0, -1);
                                                    return interaction01.reply({
                                                        content: ':x: | 你輸入的數量不可超過商品數量!',
                                                        ephemeral: true
                                                    })
                                                }
                                                let role = interaction.guild.roles.cache.get(data.role)
                                                if (role && Number(choies) > 1) {
                                                    choies = choies.slice(0, -1);
                                                    return interaction01.reply({
                                                        content: ':x: | 此商品為身分組商品，只能夠買一樣!',
                                                        ephemeral: true
                                                    })
                                                }
                                                interaction01.update({
                                                    embeds: [
                                                        new EmbedBuilder()
                                                        .setTitle('<:choose:1007244640958808088> 請選擇購買數量!')
                                                        .setColor(client.color.greate)
                                                        .setDescription(`<:id:1010884394791207003> 商品id:\n\`\`\`${data.commodity_id}\`\`\`` +
                                                            `<:pricetag:1010884565822349392> 商品價格:\n\`\`\`${Number(data.need_coin)} 個代幣\`\`\`` +
                                                            `<:sign:997374180632825896> 商品描述:\n\`\`\`${data.commodity_description}\`\`\`` +
                                                            `<:trashbin:995991389043163257> 是否自動刪除:\n\`\`\`${data.auto_delete}\`\`\`` +
                                                            `<:roleplaying:985945121264635964> 是否會附加身分組:\n${data.role === null ? '不會' : `<@&${data.role}>`}\n ` +
                                                            `<:counter:994585977207140423> 商品數量:\n\`\`\`${data.commodity_count}\`\`\`` +
                                                            `目前選擇數量:\`${choies}\``
                                                        )
                                                        .setColor('Random')
                                                    ],
                                                })
                                            }
                                        }
                                    })
                                })
                            }
                        })
                    })
                }
            }
        } catch (error) {
            const error_send = require('../../functions/error_send.js')
            error_send(error, interaction)
        }
    }
}
