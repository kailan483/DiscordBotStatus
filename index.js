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
    let argIsAccepted = false;
    for (let i = 0; i < acceptableArgs.length; i++) {
        const element = acceptableArgs[i];
        if (code == element) argIsAccepted = true;
    }
    if (argIsAccepted){
        let result = "https://http.cat/" + code;
        cb(result);
    }
    else cb("Отсутствует HTTP-код(кот)");
}

const PREFIX = "-bot";
const acceptableArgs = ['1','2','3','4','5','6','8','11','12','13','14','15','16','18']
const codeList = ['100','101','102',
'200','201','202','204','206','207',
'300','301','302','303','304','305','307',
'400','401','402','403','404','405','406','408','409','410','411','412','413',
'414','415','416','417','418','420','421','422','423','424','425','426','429','431','444','450','451','499',
'500','501','502','503','504','506','507','508','509','509','510','511','599']

function printArray(cb,array){
    let message = "";
    for (let index = 0; index < array.length; index++) {
        const element = array[index];
        message += element.toString() + "\r\n";
    }
    cb(message);
}
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
            case 'code-list':
                printArray((result)=>{
                    message.channel.send(result);
                },codeList);
                break;
            case 'httpcat':
                if (args.length > 1) {
                    message.reply("Слишком много аргументов!");
                    return;
                }
                if (args.length == 0) {
                    message.reply("Пропущен аргумент! Напишите -bot help для получения списка доступных аргументов!");
                    return;
                }
                HTTPCat((result)=>{
                    message.channel.send(result);
                },args[0]);
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
