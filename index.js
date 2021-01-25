const Discord = require("discord.js");
const request = require("request");
const config = require("./config.json");
const iconv = require("iconv-lite");

const client = new Discord.Client();
client.login(config.BOT_TOKEN);

let anekdots = [];
const options = {
    url:"http://rzhunemogu.ru/RandJSON.aspx?CType=18",        
    method: 'GET',
    encoding: 'binary'
};


// ВИТАЛИЙ И НИКОЛАЙ АНТОНОВ <3<3<3<3<3<3
function getStatus(cb){    
    let result = "";
    request(options,(error,response,body)=>{                          
        result = iconv.decode (new Buffer.from(body, 'binary'), 'win1251');        
        result = result.replace(/\/n/gim,"").replace('{"content":"',"").replace(/..$/i,"");  
        
        if (result.includes("http")) getStatus(cb);
        else cb(result);       
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
