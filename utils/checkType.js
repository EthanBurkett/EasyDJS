const colors = require('colors')

module.exports = (typeReceived, typeExpected) => {
    if(typeof typeReceived !== typeExpected) return console.log('Error:'.red+` Type error.\n`+ `Type Expected:`.red + ` ${typeExpected}`+`\nType Received:`.red + ` ${typeof typeReceived}`)
}