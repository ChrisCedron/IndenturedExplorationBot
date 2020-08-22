const Discord	= require('discord.js');
const {prefix}	= require('./config.json');
const {token}	= require('./auth.json');
const fs		= require('fs');


/////////////////////// Function Definitions /////////////////////

function getCharFile(charName){
    try{
        charFile = require(`./chars/${fileName}`)
    } catch (error){
        console.error(error)
        throw error
    }

    return charFile
}

function replyToMessage(message, sendingChannel, messageAuthor){
     sendingChannel.send(message, {reply: messageAuthor})

}

function writeToFile(file, content){
    fs.writeFile(file, content,  err =>{
        if(err){
            throw err
        }
    })
}




//////////////////// Running Code ///////////////////////////


// Initialize Discord Bot
const bot = new Discord.Client({
   token: token,
   autorun: true
});

// Print Connection Data
bot.once('ready', function (evt) {
    console.log('Connected');
});

// log in
bot.login(token);

// process messages
bot.on('message', message => {
    var content = message.content 
    var sendingChannel = message.channel
    var messageAuthor = message.author

    // ignore any messages the bot sends
    if (messageAuthor.bot){return};
    if (content.startsWith( `${prefix}`)) {
        var args = content.substring(prefix.length).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        switch(cmd.toLowerCase()) {
            // !ping
            case 'ping':
                replyToMessage("!Pong", sendingChannel, messageAuthor)
            	break;
            
            case 'debt':
                switch(args[0]){
                    case 'add':
                    case 'incur':
                        if(args.length < 3){
                            replyToMessage(`!debt incur requires 2 arguments. Recieved ${args.length - 1}`, sendingChannel, messageAuthor)
                            break    
                        }

                        charName = args[2]
                        fileName = `${charName.toLowerCase()}.json`
                        additionalDebt = parseInt(+args[1], 10)

                        try{
                            charFile = getCharFile(charName) 
                        } catch (error){
                            console.error(error)
                            replyToMessage(`Error: Could not find character file for ${charName}`, sendingChannel, messageAuthor)
                            break
                        }

                        if(isNaN(additionalDebt)){
                            replyToMessage("Starting debt is not valid. Dont use seperators", sendingChannel, messageAuthor)
                            break
                        }
                        
                        // update the debt
                        charFile.debt = charFile.debt + additionalDebt

                        writeToFile(`chars/${fileName}`, JSON.stringify(charFile, null, 2))
                        replyToMessage(`${charFile.name} owes ${charFile.debt}`, sendingChannel, messageAuthor)
                        break;
                    
                    case 'pay':
                        if(args.length < 3){
                            replyToMessage(`!debt pay requires 2 arguments. Recieved ${args.length - 1}`, sendingChannel, messageAuthor)
                            break
                        }

                        charName = args[2]
                        fileName = `${charName.toLowerCase()}.json`
                        payment = parseInt(+args[1], 10)
                        
                        try{
                            charFile = getCharFile(charName)
                        } catch(error) {
                            replyToMessage(`Error: Could not find character file for ${charName}`, sendingChannel, messageAuthor)
                            break
                        }

                        if(isNaN(payment)){
                            replyToMessage("Starting debt is not valid. Dont use seperators", sendingChannel, messageAuthor)
                            break
                        }
                        
                        // update the debt
                        charFile.debt = charFile.debt - payment

                        writeToFile(`chars/${fileName}`, JSON.stringify(charFile, null, 2))
                        replyToMessage(`${charFile.name} owes ${charFile.debt}`, sendingChannel, messageAuthor)
                        break;
                    
                    case 'show':
                        charName = args[1]
                        fileName = `${charName.toLowerCase()}.json`
                        
                        try{
                            charFile = getCharFile(charName)
                        } catch(error){
                            replyToMessage(`Error: Could not find character file for ${charName}`, sendingChannel, messageAuthor)
                            break
                        }

                        replyToMessage(`${charFile.name} owes ${charFile.debt}`, sendingChannel, messageAuthor)
                        break;
                }
                break;

            case 'addchar':
                if(args.length < 2){
                    replyToMessage(`addChar requires 2 arguments. Recieved ${args.length}`, sendingChannel, messageAuthor)
                    break
                }

                charName = args[0]
                fileName = `${charName.toLowerCase()}.json`
                startingDebt = parseInt(args[1], 10)
    
                if(isNaN(startingDebt)){
                    replyToMessage("Starting debt is not valid. Dont use seperators", sendingChannel, messageAuthor)
                    break
                }

                initContent = new Object();
                initContent.name = charName
                initContent.debt = startingDebt
                //add more base content here

                writeToFile(`./chars/${fileName}`, JSON.stringify(initContent, null, 2)) 
                replyToMessage(`Character file for ${charName} created!`, sendingChannel, messageAuthor)

                break;
            
            default:
			    replyToMessage(`ERROR: Command Not Found: ${cmd}`, sendingChannel, messageAuthor)
         }
     }
});

