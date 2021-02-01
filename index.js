const Discord = require("discord.js");
const request = require("request");
// const config = require("./config.json");
const iconv = require("iconv-lite");

const client = new Discord.Client();
client.login(process.env.Discord_Token);

// ВИТАЛИЙ И НИКОЛАЙ АНТОНОВ <3<3<3<3<3<3
function getStatus(cb, options){    
    let result = "";
    request(options,(error,response,body)=>{                          
        result = iconv.decode (new Buffer.from(body, 'binary'), 'win1251');        
        result = result.replace(/\/n/gim,"").replace('{"content":"',"").replace(/..$/i,"");  
        
        if (result.includes("http")) getStatus(cb);
        else cb(result);       
    });    

}

function HTTPCat(cb,code){
    let result = "https://http.cat/" + code.toString();
    cb(result);
}

const PREFIX = "-bot";
const acceptableArgs = ['1','2','3','4','5','6','8','11','12','13','14','15','16','18']
client.on("message",(message)=>{    
    if (message.author.bot || !message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(' ');

    const command = args.shift().toLowerCase();

    if (command == '') {
        message.reply("Пропущена команда! Напишите -bot help для получения списка доступных команд!");
        return;
    }   
    else {
        switch(command) {
            case 'help':
                message.channel.send(process.env.HELP);
                break;
            case 'cat':
                HTTPCat((result)=>{
                    message.channel.send(result);
                })
                break;
            case 'get':
                if (args.length > 1) {
                    message.reply("Слишком много аргументов!");
                    return;
                }
                if (args.length == 0) {
                    message.reply("Пропущен аргумент! Напишите -bot help для получения списка доступных аргументов!");
                    return;
                }
                let argIsAccepted = false;
                for (let i = 0; i < acceptableArgs.length; i++) {
                    const element = acceptableArgs[i];
                    if (args[0] == element) argIsAccepted = true;
                }
                if (argIsAccepted){
                    console.log(process.env.SITE);
                    const options = {
                        url:`${process.env.SITE}${args[0]}`,        
                        method: 'GET',
                        encoding: 'binary'
                    }
                    getStatus(function(result){                       
                        message.channel.send(result);
                    },options)
                }
                else message.reply('Неправильный аргумент! Напишите -bot help для получения списка доступных аргументов');           
                break;
            default:
                message.reply('Да нет такой команды!!!!')
        }
    }
    
});
