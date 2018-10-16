const Discord = require('discord.js');
const botconfig = require('../botconfig.json')
module.exports.run = async(client,message,args) => {

if(!args[0])return message.channel.send('Give me a command to reload!')
message.delete().catch(err => {})
client.loadCommand = (commandName) => {
    try {
      const props = require(`../commands/${commandName}`);
      if (props.init) {
        props.init(client);
      }
      client.commands.set(props.help.name, props);
      return false;
    } catch (e) {
      return message.channel.send(e);
    }
  };
  client.unloadCommand = async (commandName) => {
    console.log(`Reloaded ${commandName}.js`)
    let command;
    if (client.commands.has(commandName)) {
      command = client.commands.get(commandName);
    } else if (client.aliases.has(commandName)) {
      command = client.commands.get(client.aliases.get(commandName));
    }
    if (!command) return message.channel.send('Woops, Cant load that cmd!')
  
    delete require.cache[require.resolve(`../commands/${commandName}.js`)];
    return false;
  };

  let response = await client.unloadCommand(args[0]);
  if (response) return message.reply(`Error Unloading: ${response}`)

  response = client.loadCommand(args[0]);
  if (response) return message.reply(`Error Loading: ${response}`)

  message.channel.send(':ok_hand: Done!')



}
module.exports.help = {
	name: "reload",
	aliases: []
}