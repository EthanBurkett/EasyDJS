const colors = require('colors');
const fs = require('fs');
const Discord = require('discord.js');
const Client = new Discord.Client();
const Type = require('./utils/checkType');
const path = require('path');

module.exports.Client = Client

module.exports.run = () => {
	Client.login(Client.config.token).catch(err => {
		console.log(err);
	});
};

module.exports.config = data => {
	Type(data, 'object');

	Client.config = data;
};

Client.commands = new Discord.Collection();
Client.dbModels = new Discord.Collection();

Client.on('ready', () => {
	if (Client.config.loadCommands) this.commands(Client.config.commandsFolder);

	Client.config.online(Client);
});
module.exports.commands = dir => {
	const files = fs.readdirSync(dir);
	for (const file of files) {
		const stat = fs.lstatSync(path.join(dir, file));

		if (stat.isDirectory()) {
			this.commands(path.join(dir, file));
		} else {
			const fileContent = require(path.join(dir, file));

			Client.commands.set(file.slice(0, file.length - 3), fileContent);
			console.log(
				' Loaded command: '.bgBlack.blue +
					`${file.slice(0, file.length - 3)} `.bgBlack.white
			);
		}
	}
};

module.exports.embed = (data) => {
    return new Discord.MessageEmbed(data)
}

module.exports.mysql = (data) => {
    const sql = require("mysql");
    var connection = sql.createConnection(data);
    connection.connect((e) => {
        if (e) {
            console.log("MySQL Error:".red + "\n" + e);
            return;
        }
    });
    return {
        createTable: (name, data) => {
            connection.query(`CREATE TABLE IF NOT EXISTS ${name} ${data}`);
        },
        insertInto: (table, column, data) => {
            connection.query(`INSERT IGNORE INTO ${table} (${column}) VALUES (${data})`);
        },
        delete: (table, column, data) => {
            connection.query(`DELETE FROM ${table} WHERE ${column} = '${data}'`)
        },
        query: (q, f) => {
            switch (f) {
                case undefined:
                    connection.query(q)
                default:
                    connection.query(q, f)
            }

        },
        findOneAndUpdate: (data, callback) => {
            connection.query(`SELECT * FROM ${data.table} WHERE ${data.findCol}='${data.findColVal}'`, (err, rows) => {
                if (err) throw err

                if (rows.length <= 0) {
                    connection.query(`INSERT IGNORE INTO ${data.table} (${data.column}) VALUES (${data.newVal})`)
                    return
                }
                rows.forEach(r => {
                    connection.query(`UPDATE ${data.table} SET ${data.column}='${data.newVal}' WHERE ${data.findCol}='${data.findColVal}'`)
                    switch (callback) {
                        case undefined:
                            break;
                        default:
                            callback(r)
                    }
                })


            })
        },
        findTwoAndUpdate: (data, callback) => {
            connection.query(`SELECT * FROM ${data.table} WHERE ${data.findCol}='${data.findColVal}' AND ${data.find2Col}='${data.find2ColVal}'`, (err, rows) => {
                if (err) throw err

                if (rows.length <= 0) {
                    connection.query(`INSERT IGNORE INTO ${data.table} (${data.column}) VALUES (${data.newVal})`)
                    return
                }
                rows.forEach(r => {
                    connection.query(`UPDATE ${data.table} SET ${data.column}='${data.newVal}' WHERE ${data.findCol}='${data.findColVal}' AND ${data.find2Col}='${data.find2ColVal}'`)
                    switch (callback) {
                        case undefined:
                            break;
                        default:
                            callback(r)
                    }
                })

            })
        }
    };
};

module.exports.Firestore = (seAc, databaseURL) => {
	var admin = require('firebase-admin');
	const serviceAccount = seAc;

	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount),
		databaseURL
	});

	const db = admin.firestore();
	db.settings({ ignoreUndefinedProperties: true });
	return db;
};

module.exports.AddEvent = (Event, Handler) => {

    const events = ["channelCreate", "channelDelete", "channelPinsUpdate", "channelUpdate", "clientUserGuildSettingsUpdate", "clientUserSettingsUpdate", "debug", "disconnect", "emojiCreate", "emojiDelete", "emojiUpdate", "error", "guildBanAdd", "guildBanRemove", "guildCreate", "guildDelete", "guildMemberAdd", "guildMemberAvailable", "guildMemberRemove", "guildMembersChunk", "guildMemberSpeaking", "guildMemberUpdate", "guildUnavailable", 'guildUpdate', "messageDelete", "messageDeleteBulk", "messageReactionAdd", "messageReactionRemove", "messageReactionRemoveAll", "messageUpdate", "presenceUpdate", "reconnecting", "resume", "roleCreate", "roleDelete", "roleUpdate", "typingStart", "typingStop", "userNoteUpdate", "userUpdate", "voiceStateUpdate", "warn"]
    
    for(let i = 0;i < events.length;i++) {
        if(Event === events[i]) {
            Client.on(Event, Handler)
        }
    }
}

module.exports.QuickDB = require('./utils/QuickDB')
require('./utils/commandHandler')(Client);
