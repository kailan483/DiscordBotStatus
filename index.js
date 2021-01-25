const Discord = require("discord.js");
const request = require("request");
const config = require("./config.json");
const cheerio = require('cheerio');
const iconv = require("iconv-lite");
const { get } = require("request");

const client = new Discord.Client();
client.login(config.BOT_TOKEN);

let anekdots = [];
const options = {
    url:"http://rzhunemogu.ru/RandJSON.aspx?CType=5",        
    method: 'GET',
    encoding: 'binary'
};


// ВИТАЛИЙ И НИКОЛАЙ АНТОНОВ <3<3<3<3<3<3
function getStatus(cb){    
    let result = "";
    request(options,(error,response,body)=>{                          
        result = iconv.decode (new Buffer.from(body, 'binary'), 'win1251');        
        result = result.replace(/\/n/gim,"").replace('{"content":"',"").replace(/..$/i,"");                
        cb(result);       
    });    

}

const PREFIX = "-status";
client.on("message",(message)=>{    
    if (message.author.bot) return;
    if (!message.content.startsWith(PREFIX)) return;    
    getStatus(function(result){
        message.channel.send(result);
    })
});
