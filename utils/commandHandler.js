const Permissions = require('./Permissions')

module.exports = (client) => {
    client.on('message', message => {
        const { author, content, guild, channel } = message
        const prefix = content.substr(0,client.config.prefix.length)
        const command = content.split(" ")[0].substr(client.config.prefix.length)
        const args = content.split(" ").slice(1)
        const text = args.join(" ")

        if(prefix !== client.config.prefix || author.bot || channel.type === 'dm') return

    
        if(client.commands.get(command)) {
            const cmd = client.commands.get(command)
            
            if(!cmd.permission) return cmd.callback(message, args, text, client)
            
            if(Permissions(message, [cmd.permission])) return cmd.callback(message, args, text, client)
            
        }
    })
}