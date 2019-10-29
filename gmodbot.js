const Discord = require("discord.js");
const client = new Discord.Client();
const settings = require('./config.json');
var statustring = "No signal";

var request = require('request');
var gmodCommand = '/gmod'; // Command for triggering
var gmodKey = settings.key; // Your gmod server key https://gmod-servers.com/servers/manage/ ( API Key )

var url = 'https://gmod-servers.com/api/?object=servers&element=detail&key=' + gmodKey;


function update() {
  request(url, function(err, response, body) {
      if(err) {
          console.log(err);
      }
      body = JSON.parse(body);
      var status = 'Server offline';
      console.log(body.password);
      if(body.is_online) {
          if((body.password==1)||(body.players>=body.maxplayers)){
            client.user.setStatus('idle')
            .catch(console.error);
          }else{
            client.user.setStatus('online')
            .catch(console.error);
          }
            if(body.players) {
				status = ' ' + body.players + ' players of ' + body.maxplayers;
              } else {
				status = ' 0 players of ' + body.maxplayers;
        }
      } else {
        client.user.setStatus('dnd')
        .catch(console.error);

      }
      client.user.setActivity(status, { type: 'PLAYING' })
      .then(presence => console.log(status))
      .catch(console.error);
  });

}

client.on("ready", () => {
  console.log("Ready!");
  client.setInterval(update,30000);
});

client.login(settings.token);
