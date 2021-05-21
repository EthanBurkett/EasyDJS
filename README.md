# Easy DJS
## Configure your bot
```javascript
const path = require('path')
const Bot = require('@chaoticvisions/easydjs')

// Variables with a question mark are optional
Bot.config({
    token: 'Bot Token',
    loadCommands?: true, // If False, Bot.commands(commandFolder) will need to be run to use the command handler
    commandsFolder: path.join(__dirname, '/commands'),
    online?: (client) => {
        console.log(client.user.tag)
    }
})
```

### Adding Commands
```javascript
// commands/ban.js
module.exports = {
    name: 'ban',
    permission: 'BAN_MEMBERS',
    description: 'Ban someone from the guild',
    callback: (message, args) => {
        message.mentions.members.first().ban({ reason: args[0] })
    }
}
```

### Adding Events
You can add events by adding this line of code to your project
```javascript
Bot.AddEvent(EventName, Handler)
```
#### Example
```javascript
Bot.AddEvent("guildMemberAdd", (member) => {
    const welcomeChannel = member.guild.channels.cache.find(channel => channel.name === 'welcome')

    welcomeChannel.send(`${member.tag} joined the server!`)
})
```

## Most Importantly
### Run the bot
```javascript
Bot.run()
```

### Firestore (by Firebase) Integration
```javascript
// Database/db.js
const Bot = require('@chaoticvisions/easydjs')
const serviceAccount = require('path-to-serviceAccount.json')
const databaseUrl = 'url from firestore'

module.exports = Bot.firestore(serviceAccount, databaseUrl)

// index.js
const Bot = require('@chaoticvisions/easydjs')
const Database = require('./Database/db.js')

Database.collection("guilds").doc('123456').set({
    prefix: '!'
})
```

### Firestore QuickDB
With the new update a Quick Database tool has been created. This includes creation of models for the database for ease of access.
```javascript
const { QuickDB } = require('@chaoticvisions/easydjs')
const Database = require('./Database/Firestore')

QuickDB(Database).set({
    collection: {
        name: "guilds",
        value: "123"
    },
    subCollection?: {
        name: "users",
        value: "321"
    },
    set: {
        prefix: '!'
    }
})

QuickDB(Database).get({
    collection: {
        name: "guilds",
        value: "123"
    },
    subCollection?: {
        name: "users",
        value: "321"
    },
    done: (doc) => {
        console.log(doc.data)
    }
})
```

#### Models
**IMPORTANT: Make sure you make a collection called 'models' inside firestore console, *not* a sub collection.**
```javascript
const { QuickDB } = require('@chaoticvisions/easydjs')
const Database = require('./Database/Firestore')

// On Guild Join Event
/*
QuickDB(DBFile).create(model, {
    collection: {
      name: collectionName,
      value: collectionDocument
    }
})
QuickDB(DBFile).set(model, {
    valueToSet: 'hello'
})
*/
client.on('guildCreate', (guild) => {
    QuickDB(Database).model.create(`guild_${guild.id}`, {
        collection: {
            name: "guilds",
            value: guild.id
        }
    }, true) // The boolean decides if the document merges if it already exists with data. Default is true.

    QuickDB(Database).model.set(`guild_${guild.id}`, {
        prefix: '$'
    })
})
```
```javascript
// Now we can add the get function to our command
// QuickDB(DBFile).model.get(model, done)

// commands/cases.js
module.exports = {
    name: 'cases',
    description: 'get the amount of cases for the server',
    callback: (message, args) => {
        QuickDB(Database).model.get(`guild_${guild.id}`, (doc) => {
            return message.reply(doc.data().cases)
        })
    }
}

```

### MySQL Integration
With the latest patch, MySQL was implemented. Here are the MySQL functions:
```javascript
const Bot = require("@chaoticvisions/easydjs");
const sqlData = {
    host: "db-host",
    user: "db-username",
    password: "db-password",
    database: "db-name"
}
Bot.mysql(sqlData).createTable('users', '(name VARCHAR(255), password VARCHAR(255))');

Bot.mysql(sqlData).insertInto('users', 'name, password', 'testing, password');

Bot.mysql(sqlData).delete('users', 'name', 'testing');

Bot.mysql(sqlData).findOneAndUpdate({
    table: 'users', // Find The table
    findCol: 'name', // Make it only update the value where this column equals findColVal
    findColVal: 'testing', // Refer to above comment
    column: 'password', // This sets the column value it will change
    newVal: 'newpassword', // This will set the new value from column referenced in 'column'
})

/*
Find Two And Update is the same as Find One And Update except it checks for 2 different columns
*/

Bot.mysql(sqlData).findTwoAndUpdate({
    table: 'users', // Find The table
    findCol: 'name',
    find2Col: 'email',
    findColVal: 'testing',
    find2ColVal: 'test@test.com',
    column: 'password',
    newVal: 'newpassword',
})

** Bot.mysql(sqlData).query(query, function);
```
** This function is meant for advanced users familiar with MySQL.

## Example Usage of the Package
[Replit](https://replit.com/@ethanburkett/UsingEasyDJS)