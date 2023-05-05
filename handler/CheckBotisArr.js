const client = require('../index');
const {
    EmbedBuilder,
    WebhookClient
} = require('discord.js')
const config = require('../config.json')
const readywebhook = new WebhookClient({
    url: config.readyWebhook
})

const MAX_PING = 500;
const MAX_FAILS = 3;

let fails = 0;

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag} with ${client.cluster.id}`);
  
    setInterval(() => {
      const ping = client.ws.ping;
      console.log(`Ping: ${ping}ms`);
      
      if (ping > MAX_PING) {
        console.log(`Ping too high, ${fails + 1} fails`);
        
        fails++;
        
        if (fails >= MAX_FAILS) {
          let embed = new EmbedBuilder()
          .setTitle(`正在重啟${client.cluster.id}!`)
          .setColor("Green")
      if (client.user.id !== "984485913201635358") readywebhook.send({
          embeds: [embed]
      })
          console.log(`Max fails reached, restarting...`);
          console.log(`Restarting...`);
          process.exit(0);
        }
      } else {
        fails = 0;
      }
    }, 30000); // 
})