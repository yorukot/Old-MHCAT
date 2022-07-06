const {
    Client,
    Message,
    MessageActionRow,
    MessageEmbed,
    MessageButton
} = require('discord.js');
const client = require('../index');
const chat = require('../models/chat.js')
const data = require("../chat.json");
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if(message.guild === null) return;
    if(!message.guild) return;
    chat.findOne({
        guild: message.guild.id,
    }, async (err, data1) => {
    if(!data1) return;
    if(data1.channel !== message.channel.id) return;
    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
      }
      const con = message.content;
      if(con.length[1] = "說"){
          if(con.includes("說出" || "說")){
              const con1 = con.replace(/[說出]/gi, '');
              if(con1.length === 0)return message.reply("說出甚麼?");
              if(con.includes("幹" || "操" || "bitch")){
                  message.reply("很抱歉，讀取到你說出了一些不好的字元，因此拒絕說出w" + "\n字元:")
                  return;
              }else{
                  if(con1.includes("我")){
                  const me = con1.replace("我", "你")
                  message.reply(`"${me}"`);
                  return;
                  }else{
                      message.reply(con1);
                  return;
                  }
      }}};
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
              
      let findCloestKeyData  = (dataObject, matchKey) => {
      let mostMachingKey = '';
      let highestProbability = 0;
      Object.keys(dataObject).forEach(key => {
          let probability =  similarity(key,matchKey);
          if(probability > highestProbability){
          highestProbability = probability;
          mostMachingKey = key;
          }
      });
      return dataObject[mostMachingKey];
      }
      const randomnumber = getRandomInt(100000000)
      let result = findCloestKeyData(data, con);
      const bt = new MessageActionRow()
      .addComponents(
          new MessageButton()
          .setCustomId(`${randomnumber}`)
          .setLabel('回報錯誤')
          .setStyle('PRIMARY'),
      );
      if(!result){
           message.reply({content:"我看不懂你的意思，在講一次好不好w"})
          return
      }
      setTimeout(() => {
          return message.reply({content: result})
          }, 300)
    })
})