const discord = require('discord.js');
const client = new discord.Client();
const config = require("./config/config.json");
const profanities = require("profanities");
const PREFIX = config.DISCORD_BOT.PREFIX;
const TOKEN = config.DISCORD_BOT.TOKEN;

var serverAmount;

function updateServerCount(){
    serverAmount = client.guilds.cache.size;
    setTimeout(updateServerCount, 5000);
}

client.on('ready', () => {
    console.log(`${client.user.tag} has logged in`);
    updateServerCount();
    client.user.setActivity(`${serverAmount} Servers! Use /help`, {type : "WATCHING"});

    client.guilds.cache.forEach(guild => {
        console.log(`${guild.name} | ${guild.id}`);
      })
})


const isValidCommand = (message, cmdName) => (message.content.toLowerCase().startsWith(PREFIX + cmdName));
client.on("message", async function(message) {
    if(message.author.bot){return;}
    if(isValidCommand(message, "ban")){
        if(message.member.hasPermission("BAN_MEMBERS")){
            let memberID = message.content.substring(message.content.indexOf(" ") + 1);
            let member = message.guild.members.cache.get(memberID);

            if(member){
                if(member.hasPermission("ADMINISTRATOR")){
                    message.channel.send("This user is a Owner/Admin, I cannot ban them.")
                }
                else{
                    member.ban();
                    message.channel.send("Successfully banned user " + memberID);
                }
            }
            else{
                message.channel.send("Could not find that user.");
            }
        }
        else{
            message.reply("You don't have the permissions to do this!")
        }
    }

    if(isValidCommand(message, "kick")){
        if(message.member.hasPermission("KICK_MEMBERS")){
            let memberID = message.content.substring(message.content.indexOf(" ") + 1);
            let member = message.guild.members.cache.get(memberID);

            if(member){
                if(member.hasPermission("ADMINISTRATOR")){
                    message.channel.send("This user is a Owner/Admin, I cannot kick them.")
                }
                else{
                    member.ban();
                    message.channel.send("Successfully kicked user " + memberID);
                }
            }
            else{
                message.channel.send("Could not find that user.");
            }
        }
        else{
            message.reply("You don't have the permissions to do this!")
        }
    }

    if(isValidCommand(message, "invite")){
        message.channel.send("Thanks for using ModBot! If you would like to add me again to another server or join the support server, here are the links!\n\n**Invite**: https://dsc.gg/modbot \n**Join**: https://discord.gg/HVNA99JWD3")
    }

    if(isValidCommand(message, "help")){
        message.author.send({embed: {
            color: "#ff384f",
            title: "Help",
            fields: [
              { name: "Commands", value: "/ban\n/kick\n/invite\n", inline: true},
              { name: "Usage", value: "Ban a user with their userID\nKick a user with their userID\nGet the bot invite and support server join links\n", inline: true}
            ]
          }
        });
    }

    for (x = 0; x < profanities.length; x++){
            let msg = message.content.toLowerCase();
            if (msg.includes(profanities[x])){
                let profanityEmbed = new discord.MessageEmbed();
                let profanityWarnMessage = `**${message.author.username}**! You aren't allowed to say that! If you continue with this behavior, You may be **Punished**.`;
                profanityEmbed.addField("Warning", profanityWarnMessage);
                profanityEmbed.setColor("#ff3030");
                profanityEmbed.setAuthor(message.author.tag, message.author.displayAvatarURL());
                profanityEmbed.setTimestamp();
                message.delete();
                message.channel.send(profanityEmbed);
        }
        return;
    } 
})


client.login(TOKEN);