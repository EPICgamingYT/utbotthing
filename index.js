const Discord = require('discord.js');
const client = new Discord.Client();
const botconfig = require('./botconfig.json');
const fs = require('fs');
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

client.on("error", (e) => console.error(e));

client.on("warn", (e) => console.warn(e));

fs.readdir("./commands/", (err, files) => {

    if (err) console.log(err);
    let jsfile = files.filter(f => f.split(".").pop() === "js");
    if (jsfile.length <= 0) {
        console.log("Couldn`t find commands!.");
        return;
    }

    jsfile.forEach((f, i) => {
        let props = require(`./commands/${f}`);
        console.log(`${i + 1}: ${f} loaded!`)
        client.commands.set(props.help.name, props);

        props.help.aliases.forEach(alias => {
            client.aliases.set(alias, props.help.name);
        });
        
    });
  
});

client.on('ready', async => {
    function changing_status() {
        let status = ['!help | Prefix: !', 'under devlopment!', 'utbot.wadj.ga', 'NEW: Set log channel!', 'Alpha thing', `${client.users.size} users!`, `on ${client.guilds.size} servers`]
        let random = status[Math.floor(Math.random() * status.length)]
        client.user.setActivity(random)
      }
	client.user.setActivity('I am a bot', {"type": "PLAYING"});

});


client.on('message', async message => {
	if(message.author.bot) return;
	if(message.channel.type === "dm") return;

	let prefix = botconfig.prefix;
    let args = message.content.slice(prefix.length).trim().split(' ');
    let cmd = args.shift().toLowerCase();
    let command;
    
    if(!message.content.startsWith(prefix)) return;
    else if (client.commands.has(cmd)) {
    command = client.commands.get(cmd);
    } else if (client.aliases.has(cmd)) {
    command = client.commands.get(client.aliases.get(cmd));
    }
    try {
    command.run(client, message, args);
    } catch (e) {
    message.channel.send(`:x: The command \`${cmd}\` couldn't be found!`);
}
});

client.on('guildMemberAdd', async member => {
	let welcomeChannel = member.guild.channels.find(c => c.name === "welcome-leave");
	let testEmbed = new Discord.RichEmbed()
	.setTitle(`<a:funkyparrot:501410363561082891> ${member.user.tag} joined <a:funkyparrot:501410363561082891>`)
	.setDescription(`Welcome! We hope you have a wonderful time here!`)
	.addField('Have a nice time here', `${member}`)
	.addField('Please have a look at important channels', `<#501087972494540800> \n <#501087926608723988>`)
	.setColor("#F00FF0")
	.addField('When you finished with that...', 'Come meet our nice community in <#501054290366824481>!');

	welcomeChannel.send(testEmbed);
});

client.on('guildMemberRemove', async member => {
let welcomeChannel = member.guild.channels.find(c => c.name === "welcome-leave");
	let testEmbed = new Discord.RichEmbed()
	.setTitle(`<a:reee:501416809044508692> ${member.user.tag} left <a:reee:501416809044508692>`)
	.setDescription(`Bye bye! We hope to see you again!`)
	.addField('Member left', `${member.user.tag}`)
	.setColor("#F00FF0");

	welcomeChannel.send(testEmbed);
});
client.login(botconfig.token);

