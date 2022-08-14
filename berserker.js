const { executionAsyncResource } = require('async_hooks');
const Discord = require('discord.js');
const ytdl = require('ytdl-core-discord');
const moment = require('moment');
const got = require('got');
const translate = require('@iamtraction/google-translate');
const axios = require('axios')
const ISO6391 = require('iso-639-1');
const { DiscordTogether } = require('discord-together');
var r = require("nraw");
const { join } = require('path');
const fs = require('fs');
const mcapi = require('mcapi');
require('dotenv').config()
const apitoken = process.env.weather
const { getLyrics, getSong, searchSong } = require('genius-lyrics-api')
const { konvert, konvertCountries } = require('konvert');
var Reddit = new r("Testbot v0.0.1 by Mobilpadde");
const market = require('steam-market-search').market;
const YouTube = require("youtube-sr").default;
const mongoose = require('mongoose')
const getopts = require('getopts');
const canvacord = require("canvacord");
const streamToBuffer = require('stream-to-buffer');
const ms = require("ms")
mongoose.connect(process.env.mongodb, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connection.on("open", async () => {
  console.log("MondoDB online")
})

const Guild = require('./models/guild');
const levels = require("./models/levels");
market.setRequestOptions({
  headers: {
    'Accept-Language': 'tr'
  },
  sort_dir: 'dsc'
});
const client = new Discord.Client();
const { OpusEncoder } = require('@discordjs/opus');
const encoder = new OpusEncoder(48000, 2);
client.discordTogether = new DiscordTogether(client);
const queue = new Map();
const disbut = require('discord-buttons');
require('discord-buttons')(client);
const { MessageButton, MessageActionRow } = require('discord-buttons')

client.on("ready", () => {
  console.log("I am online!")
  console.log(`Active on ${client.guilds.cache.size} servers!`)

})
console.log(process.version)
const sendError = async (message, error, title) => {
  let embed = new Discord.MessageEmbed().setColor('BLACK').setTitle(title);
  embed.setDescription(`\n\`\`\`${error}\`\`\``);

  return message.reply(embed);
}
client.prefix = async function (message) {
  let custom;
  const settings = await Guild.findOne({
    guildID: message.guild.id
  }).catch(err => console.log(err))

  if (settings) {
    custom = settings.prefix;
  } else {
    custom = "!";
  }
  return custom;
}
client.on("guildCreate", guild => {
  let jsembed = new Discord.MessageEmbed()
    .setAuthor("New Guild Joined!")
    .setThumbnail(guild.iconURL({ dynamic: true }))
    .setColor("#000000")
    .addField("Guild ", `${guild.name}  `, true)
    .addField("Guild id", `${guild.id}`, true)
    .addField("Total Members ", `${guild.memberCount}`, true)
    .setTimestamp();
  client.channels.cache.get(process.env.guildd).send(jsembed).catch((error) => {
    return;
  });
});
client.on('guildDelete', async (guild) => {
  Guild.findOne({ guildID: guild.id }, async (err, data) => {
    if (err) throw err;
    if (data) {
      Guild.findOneAndDelete({ guildID: guild.id }).catch((error) => {
        return;
      });
    }
  })
  if (!guild.memberCount) {
    return;
  }
  let jsembed = new Discord.MessageEmbed()
    .setAuthor("Removed from server!")
    .setThumbnail(guild.iconURL({ dynamic: true }))
    .setColor("#000000")
    .addField("Guild ", `${guild.name}  `, true)
    .addField("Guild id", `${guild.id}`, true)
    .addField("Total Members ", `${guild.memberCount}`, true)
    .setTimestamp();
  client.channels.cache.get(process.env.guildd).send(jsembed).catch((error) => {
    return;
  });

})
client.on('clickButton', async (button) => {
  try {
  button.reply.defer();
  message = button.message
  const user = await levels.findOne({ userID: button.clicker.user.id, guildID: "1" });
  if (!user) {
  } else {
    xp = 50
    user.xp += parseInt(xp, 10);
    user.level = 1
    user.lastUpdated = new Date();
    await user.save().catch(e => console.log(`Failed to append xp: ${e}`));
  }
  if (button.id == "skip") {
    const serverQueue3 = queue.get(button.guild.id);
    skip(message, serverQueue3);
    return;
  }
  if (button.id == "stop") {
    const serverQueue2 = queue.get(button.guild.id);
    stop(message, serverQueue2);
    return;
  }
  if (button.id == "pause") {
    const serverQueue8 = queue.get(button.guild.id);
    pause(message, serverQueue8)
    return;
  }
  if (button.id == "playnow") {
    const serverQueue11 = queue.get(button.guild.id);
    playnow(message, serverQueue11)
    return;

  }
  if (button.id == "delete") {
    const serverQueue10 = queue.get(button.guild.id);
    del(message, serverQueue10)
    return;

  }
  if (button.id == "lyrics") {
    const serverQueue6 = queue.get(message.guild.id);
    lyrics(message, serverQueue6)
    return;
  }
  if (button.id == "playlist") {
    const serverQueue5 = queue.get(button.guild.id);
    playlist(message, serverQueue5)
    return;
  }
  if (button.id == "shuffle") {
    const serverQueue12 = queue.get(button.guild.id);
    shuffle(message, serverQueue12)
    return;
  }
  if (button.id == "loop") {
    const serverQueue13 = queue.get(button.guild.id);
    loop(message, serverQueue13)
    return;
  }
} catch (error) {
  return;
}


  return;
});
client.on('voiceStateUpdate', (oldState, newState) => {
  var serverQueuelul = queue.get(newState.guild.id)
  if (!serverQueuelul){
    return;
  }
  if (oldState.member.id == process.env.botid && newState.channelID==null) {
    try{
    clearInterval(myVar2)
  } catch {
  }
  try{
    clearInterval(myVar)
  } catch {
  }
  queue.delete(newState.guild.id)
}
  if (oldState.member.id == process.env.botid  && newState.channelID!==null) {
    try {
    clearInterval(myVar)
  } catch {
  }
    var myVar2 = setInterval(check2, 30000)
    var lol = newState
    async function check2() {
      try {
        var serverQueuelul = await queue.get(newState.guild.id)
        var vc3 = await client.channels.fetch(lol.channelID).then(channel =>
          channel.members.size)
        var vc4 = await client.channels.fetch(lol.channelID)
        if (serverQueuelul == undefined) {
          clearInterval(myVar2)
          return;
        }
        if (vc3 < 2 && serverQueuelul !== undefined) {
          vc4.leave()
          clearInterval(myVar2)
          queue.delete(newState.guild.id)
          let thing = new Discord.MessageEmbed()
            .setTitle(`Voice channel is empty! Music stopped. Queue deleted!`, `\`Voice channel was empty for 60 seconds.\``)
            .setColor("BLACK")
            .setTimestamp();
            serverQueuelul.txtChannel.send(thing).catch((error) => {
            return;
          });
          return;
        }
        return;
      } catch {

      }


    }
  }
  // if (newState.channelID === null) console.log('user left channel', oldState.channelID,oldState.member.id);
  // else if (oldState.channelID === null) console.log('user joined channel', newState.channelID,oldState.member.id);
  // else console.log('user moved channels', oldState.channelID, newState.channelID,oldState.member.id);
});
async function pause(message, serverQueue8) {
  if (serverQueue8 == undefined) {
    return message.channel.send('Nothing playing right now!').catch((error) => {
      return;
    });
  }

  if (!message.member.voice.channel)
    return message.channel.send("You need to join the voice chat first").catch((error) => {
      return;
    });
  if (serverQueue8 && serverQueue8.playing) {
    serverQueue8.playing = false;
    try {
      serverQueue8.connection.dispatcher.pause()
    } catch (error) {
      return;
    }
    let xd = new Discord.MessageEmbed()
      .setDescription(`${serverQueue8.songs[0].title}`)
      .setThumbnail(serverQueue8.songs[0].img)
      .setColor("BLACK")
      .setTitle(` Music has been paused!`)
    return message.channel.send(xd).catch((error) => {
      return;
    });
  } else {
    serverQueue8.playing = true;
    serverQueue8.connection.dispatcher.resume();
    let xd = new Discord.MessageEmbed()
      .setDescription(`${serverQueue8.songs[0].title}`)
      .setThumbnail(serverQueue8.songs[0].img)
      .setColor("BLACK")
      .setTitle(` Music is resumed!`)
    return message.channel.send(xd).catch((error) => {
      return;
    });
  }
  return message.channel.send("The music is already stopped!").catch((error) => {
    return;
  });
}
async function stop(message, serverQueue2) {
  if (serverQueue2 == undefined) {
    return message.channel.send('Nothing playing right now!').catch((error) => {
      return;
    });
  }
  if (!message.member.voice.channel)
    return message.channel.send("You need to join the voice chat first!").catch((error) => {
      return;
    });
  if (serverQueue2 && !serverQueue2.playing) {
    serverQueue2.playing = true;
    await serverQueue2.connection.dispatcher.resume()
  }
  try {
    serverQueue2.songs = [];
    serverQueue2.connection.dispatcher.end();
  } catch (error) {
    return;
  }
}
function playnow(message, serverQueue11) {
  args = " ";
  if (!serverQueue11) {
    message.channel.send('Nothing playing right now!').catch((error) => {
      return;
    });
    if (serverQueue11.songs.length == 1) {
      return message.channel.send('There is no song to play!').catch((error) => {
        return;
      });
    }
  } else {
    if (args[0] && isNaN(args[0]))
      return message.channel.send(`You have to give number to skip! - Use ${prefix}playlist for the song list!`).catch((error) => {
        return;
      });
    if (args[0] == 1) {
      return message.channel.send("You can't skip to the current song!").catch((error) => {
        return;
      });
    }
    if (!args[0]) {
      args[0] = serverQueue11.songs.length
    }
    if (args[0] > serverQueue11.songs.length) {
      return message.channel.send("You can't give number bigger than the last playlist songs order!").catch((error) => {
        return;
      });
    }
    serverQueue11.playing = true;
    depo = serverQueue11.songs.slice(1, args[0] - 1);
    serverQueue11.songs = serverQueue11.songs.slice(args[0] - 2);
    serverQueue11.songs = serverQueue11.songs.concat(depo)
    try {
      serverQueue11.connection.dispatcher.end();
    } catch (error) {
      serverQueue11.voiceChannel.leave()
      message.client.queue.delete(message.guild.id);
      return message.channel.send(`:notes: The player has stopped and the queue has been cleared.: ${error}`, message.channel).catch((error) => {
        return;
      });
    }
  }
}

async function skip(message, serverQueue3) {
  if (serverQueue3 == undefined) {
    return message.channel.send('Nothing playing right now!').catch((error) => {
      return;
    });
  }

  if (!message.member.voice.channel)
    return message.channel.send("You need to join the voice chat first").catch((error) => {
      return;
    });
  if (!serverQueue3.songs[1]) {
    return message.channel.send("There is nothing to skip!").catch((error) => {
      return;
    });
  }
  if (serverQueue3 && !serverQueue3.playing) {
    serverQueue3.playing = true;
    await serverQueue3.connection.dispatcher.resume()
  }
  if (serverQueue3 && serverQueue3.loop == true) {
    serverQueue3.loop = !serverQueue3.loop;
    message.channel.send("Loop is disabled. Song skipped!").catch((error) => {
      return;
    });
  }
  try {
    serverQueue3.connection.dispatcher.end()
  } catch (error) {
    return;
  }
}
function del(message, serverQueue10) {
  args = " ";

  if (!serverQueue10) {
    message.channel.send('Nothing playing right now!').catch((error) => {
      return;
    });
    if (serverQueue10.songs.length == 1) {
      return message.channel.send('There is no song to delete!').catch((error) => {
        return;
      });
    }
  } else {
    if (args[0] && isNaN(args[0]))
      return message.channel.send(`You have to give number to skip! - Use ${prefix}playlist for the song list!`).catch((error) => {
        return;
      });
    if (args[0] == 1) {
      return message.channel.send("You can't skip to the current song!").catch((error) => {
        return;
      });
    }
    if (!args[0]) {
      args[0] = serverQueue10.songs.length
    }
    if (args[0] > serverQueue10.songs.length) {
      return message.channel.send("You can't give number bigger than the last playlist songs order!").catch((error) => {
        return;
      });
    }

    let thing = new Discord.MessageEmbed()
    const jup3 = serverQueue10.songs.length
    if (!args[0]) {
      if (jup3 == 1) {
        return message.channel.send("You can't delete currently playing song!").catch((error) => {
          return;
        });
      }
      args[0] = jup3
      thing.setTitle("Last Music deleted from queue!")
    } else {
      thing.setTitle("Music deleted from queue!")
    }
    if (args[0] >> jup3) {
      return message.channel.send("Use appropriate number! check the numbers with !playlist !").catch((error) => {
        return;
      });
    }
    if (args[0] == 1) {
      return message.channel.send("You can't delete currently playing song!").catch((error) => {
        return;
      });
    }
    const jup = serverQueue10.songs[jup3 - 1].title
    const jup2 = serverQueue10.songs[jup3 - 1].img
    serverQueue10.songs.splice(args[0] - 1, 1);
    thing.setThumbnail(jup2)
    thing.setDescription(`**${jup}**`)
    thing.setColor("#000000")
    thing.setTimestamp();
    return message.channel.send(thing).catch((error) => {
      return;
    });

  }
}
function playlist(message, serverQueue5) {
  if (!serverQueue5) return message.channel.send('Nothing playing right now!');
  var i = 1;
  aaa = serverQueue5.songs.map(song => `**${i++}.** ${song.title}`).join('\n')
  if (aaa.length >= 2000) {
    aaa = `${aaa.substr(0, 1900)}...`;
    bbb = aaa + `\n**Now playing:** ${serverQueue5.songs[0].title}`

    return message.channel.send(bbb).catch((error) => {
      return;
    });
  } else {
    var i = 1;
    return message.channel.send(`
**Song queue:**
${serverQueue5.songs.map(song => `**${i++}.** ${song.title}`).join('\n')}
**Now playing:** ${serverQueue5.songs[0].title}
`).catch((error) => {
      return;
    });
  }
}
function shuffle(message, serverQueue12) {
  if (!serverQueue12) {
    message.channel.send('Nothing playing right now!').catch((error) => {
      return;
    });
  } else {
    let songs = serverQueue12.songs;
    for (let i = songs.length - 1; i > 1; i--) {
      let j = 1 + Math.floor(Math.random() * i);
      [songs[i], songs[j]] = [songs[j], songs[i]];
    }
    serverQueue12.songs = songs;
    return message.channel.send("Queue shuffled!").catch((error) => {
      return;
    });

  }
}
function loop(message, serverQueue13) {
  if (!serverQueue13) {
    return message.channel.send('Nothing playing right now!').catch((error) => {
      return;
    });
  }
  if (!message.member.voice.channel)
    return message.channel.send("You need to join the voice chat first").catch((error) => {
      return;
    });
  serverQueue13.loop = !serverQueue13.loop;
  if (serverQueue13.loop == false) return message.channel.send("Loop is disabled!").catch((error) => {
    return;
  });
  if (serverQueue13.loop == true) return message.channel.send("Loop is enabled!").catch((error) => {
    return;
  });
}
async function lyrics(message, serverQueue6) {
  args = ""
  if (!args[0] && !serverQueue6) {
    return message.channel.send('There is nothing playing now!').catch((error) => {
      return;
    });
  }
  if (!args[0]) {
    lul31 = (`${serverQueue6.songs[0].title}`)
    lul32 = lul31.replace(/’/g, "");
    lul33 = lul32.replace(/lyric/g, "");
    lul34 = lul33.replace(/lyrics/g, "");
    lul35 = lul34.replace(/Lyrics/g, "");
    lul36 = lul35.replace(/Lyric/g, "");
    lul37 = lul36.replace(/video/g, "");
    lul38 = lul37.replace(/Video/g, "");
  } else {
    lul31 = args.join("")
    lul32 = lul31.replace(/’/g, "");
    lul33 = lul32.replace(/lyric/g, "");
    lul34 = lul33.replace(/lyrics/g, "");
    lul35 = lul34.replace(/Lyrics/g, "");
    lul36 = lul35.replace(/Lyric/g, "");
    lul37 = lul36.replace(/video/g, "");
    lul38 = lul37.replace(/Video/g, "");
  }
  const options = {
    apiKey: process.env.genius,
    title: `${lul38}`,
    artist: '',
    optimizeQuery: true
  };

  const a = await searchSong(options)
  if (a == null) {
    return message.channel.send('Nothing found').catch((error) => {
      return;
    });
  }
  const titleup = a[0].title.split("by")
  const titleauth = titleup[1];
  const titlename = titleup[0];
  const lyrics = await getSong(options)
  if (!lyrics) {
    message.channel.send('Cannot acces to the lyrics').catch((error) => {
      return;
    });
  } else {
    let lyricsEmbed = new Discord.MessageEmbed()
      .setAuthor(`${titleauth} | ${titlename} Lyrics`)
      .setThumbnail(a[0].albumArt)
      .setColor("#000000")
      .setDescription(lyrics.lyrics)
      .setTimestamp();
    if (lyricsEmbed.description.length >= 2048)
      lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
    return message.channel.send(lyricsEmbed).catch((error) => {
      return;
    });
  }

}
client.on("message", async (message) => {
  if (message.author.bot) return;
  const argsuu = message.content.trim().split(/ +/g)
  if (argsuu[0].includes("play") || argsuu[0].includes("stop") || argsuu[0].includes("skip") || argsuu[0].includes("lyrics") ||
    argsuu[0].includes("pause") || argsuu[0].includes("volume") || argsuu[0].includes("resume") || argsuu[0].includes("del") ||
    argsuu[0].includes("info") || argsuu[0].includes("ping") || argsuu[0].includes("uptime") || argsuu[0].includes("sug") ||
    argsuu[0].includes("remind") || argsuu[0].includes("trn") || argsuu[0].includes("weather") || argsuu[0].includes("invite") ||
    argsuu[0].includes("poll") || argsuu[0].includes("reddit") || argsuu[0].includes("csgo") || argsuu[0].includes("clear") ||
    argsuu[0].includes("ban") || argsuu[0].includes("kick") || argsuu[0].includes("t") || argsuu[0].includes("prefix") || argsuu[0].includes("slowmode") ||
    argsuu[0].includes("qr") || argsuu[0].includes("mcskin") || argsuu[0].includes("level") || argsuu[0].includes("leaderboard") || argsuu[0].includes("shuffle") ||
    argsuu[0].includes("loop") || argsuu[0].includes("ytogether")|| argsuu[0].includes("serverinfo")|| argsuu[0].includes("chess")
  ) {
  } else {
    return;
  }
  if (!message.guild) return;
  const settings = await Guild.findOne({
    guildID: message.guild.id
  })
  if (settings == null) {
    prefix = '!'
  } else {
    prefix = settings.prefix
  }
  if (message.content.startsWith(prefix)) {
    const user = await levels.findOne({ userID: message.author.id, guildID: "1" });
    if (!user) {
    } else {
      xp = 50
      user.xp += parseInt(xp, 10);
      user.level = 1
      user.lastUpdated = new Date();
      await user.save().catch(e => console.log(`Failed to append xp: ${e}`));
    }
    const args = message.content.slice(prefix.length).trim().split(/ +/g)
    const command = args.shift().toLowerCase();
    switch (command) {
      case 'play':
        const serverQueue = queue.get(message.guild.id);
        execute(message, serverQueue);
        break;
      case 'stop':
        const serverQueue2 = queue.get(message.guild.id);
        stop(message, serverQueue2);
        break;
      case 'skip':
        const serverQueue3 = queue.get(message.guild.id);
        skip(message, serverQueue3);
        break;
      case 'volume':
        const serverQueue4 = queue.get(message.guild.id);
        volume(message, serverQueue4)
        break;
      case 'ping':
        ping(message)
        break;
      case 'uptime':
        uptime(message)
        break;
      case 'sug':
        sug(message)
        break;
      case 'userinfo':
        userinfo(message)
        break;
      case 'serverinfo':
        serverinfo(message)
        break;
      case 'reddit':
        reddit(message)
        break;
      case 'redditus':
        redditus(message)
        break;
      case 'reddituser':
        reddituser(message)
        break;
      case 'playlist':
        const serverQueue5 = queue.get(message.guild.id);
        playlist(message, serverQueue5)
        break;
      case 'lyrics':
        const serverQueue6 = queue.get(message.guild.id);
        lyrics(message, serverQueue6)
        break;
      case 'clear':
        clear(message)
        break;
      case 'trn':
        trn(message)
        break;
      case 'weather':
        weather(message)
        break;
      case 'invite':
        invite(message)
        break;
      case 'csgo':
        csgo(message)
        break;
      case 'csgostats':
        csgostats(message)
        break;
      case 'skipto':
        const serverQueue7 = queue.get(message.guild.id);
        skipto(message, serverQueue7)
        break;
      case 'poll':
        poll(message)
        break;
      case 't':
        t(message)
        break;
      case 'pause':
        const serverQueue8 = queue.get(message.guild.id);
        pause(message, serverQueue8)
        break;
      case 'resume': ;
        const serverQueue9 = queue.get(message.guild.id);
        resume(message, serverQueue9)
        break;
      case 'del': ;
        const serverQueue10 = queue.get(message.guild.id);
        del(message, serverQueue10)
        break;
      case 'setprefix': ;
        setprefix(message)
        break;
      case 'resprefix': ;
        resprefix(message)
        break;
      case 'botinvite': ;
        botinvite(message)
        break;
      case 'ban': ;
        ban(message)
        break;
      case 'kick': ;
        kick(message)
        break;
      case 'slowmode': ;
        slowmode(message)
        break;
      case 'qrcreate': ;
        qrcreate(message)
        break;
      case 'qrdecode': ;
        qrdecode(message)
        break;
      case 'mcskin': ;
        mcskin(message)
        break;
      case 'levelreg': ;
        levelreg(message)
        break;
      case 'level': ;
        level(message)
        break;
      case 'leveldel': ;
        leveldel(message)
        break;
      case 'levelbg': ;
        levelbg(message)
        break;
      case 'leaderboard': ;
        leaderboard(message)
        break;
      case 'levelpr': ;
        levelpr(message)
        break;
      case 'playnow': ;
        const serverQueue11 = queue.get(message.guild.id);
        playnow(message, serverQueue11)
        break;
      case 'shuffle': ;
        const serverQueue12 = queue.get(message.guild.id);
        shuffle(message, serverQueue12)
        break;
      case 'loop': ;
        const serverQueue13 = queue.get(message.guild.id);
        loop(message, serverQueue13)
        break;
      case 'ytogether': ;
        ytogether(message)
        break;
      case 'chess': ;
      chess(message)
      break;
    }

    async function execute(message, serverQueue) {
      if (args.length == 0) {
        return message.channel.send("Provide something to search!").catch((error) => {
          return;
        });
      }
      let vc = message.member.voice.channel;
      if (!vc) {
        return message.channel.send("Please join a voice chat first!").catch((error) => {
          return;
        });
      } else {
        if (args[0] == 'playlist') {
          if (args[1] == undefined) {
            args[1] = "playlist öyle böyle voltranex"

          }
          var res = args[1].split("&")
          abu = res[1]
          abu2 = res[2]
          if (abu2 == 'start_radio=1') {
            return message.channel.send('Dont use the end of the youtube url start_radio=1 !').catch((error) => {
              return;
            });
          }
          if (!serverQueue) {
            if (args[1] == undefined) {
              args[1] = "playlist öyle böyle voltranex"
            }
            var res3 = args[1].split("=")
            abu2 = res3[1]
            if (args[0] == 'playlist' && abu2 !== undefined) {
              const queueConstructor = {
                txtChannel: message.channel,
                vChannel: vc,
                connection: null,
                songs: [],
                volume: 50,
                playing: true,
                loop: false
              };
              queue.set(message.guild.id, queueConstructor)
              var i;
              const list = await YouTube.getPlaylist(`${args[1]}`, { limit: 40 }).catch((error) => {
                return;
              });
              if (list == undefined) {
                return message.channel.send('Give valid playlist url!').catch((error) => {
                  return;
                });
              }
              console.log(list)
              let button4 = new MessageButton()
                .setLabel("Playlist")
                .setID("playlist")
                .setStyle("grey")
              let button5 = new MessageButton()
                .setLabel("Shuffle")
                .setID("shuffle")
                .setStyle("grey")
              let buttonRow = new MessageActionRow()
                .addComponent(button4)
                .addComponent(button5)
              let playlistv = new Discord.MessageEmbed()
                .setAuthor("Playlist added the queue!")
                .setThumbnail(list.thumbnail)
                .setTitle(`${list.title}`)
                .setURL(list.url)
                .setColor("#000000")
                .addField("Channel ", `${list.channel.name}`, true)
                .addField("Total Video ", `${list.videoCount}`, true)
                .setTimestamp();
              message.channel.send({
                component: buttonRow,
                embed: playlistv

              }).catch((error) => {
                return;
              });
              const serverQueue = await queue.get(message.guild.id);
              try {
              const songInfo = await ytdl.getInfo(`https://www.youtube.com/watch?v=${list.videos[0].id}`)
              
              let song3 = {
                title: songInfo.videoDetails.title,
                img: songInfo.player_response.videoDetails.thumbnail.thumbnails[0].url,
                url: songInfo.videoDetails.video_url,
                duration: songInfo.videoDetails.lengthSeconds,
                ago: songInfo.videoDetails.publishDate,
                likes: songInfo.videoDetails.likes,
                dislikes: songInfo.videoDetails.dislikes,
                channelname: songInfo.videoDetails.ownerChannelName,
                views: String(songInfo.videoDetails.viewCount).padStart(10, ' '),
              };
              serverQueue.songs[0] = song3
            } catch (err) {
            }
              if (list.videos.length < 40) {
                for (i = 1; i < list.videos.length; i++) {
                  if (list.videos[i].title == '[Deleted video]' || list.videos[i].title == '[Private video]') {
                  } else {
                    (async () => {
                      try {
                      const songInfo = await ytdl.getInfo(`https://www.youtube.com/watch?v=${list.videos[i].id}`)
                      let song2 = {
                        title: songInfo.videoDetails.title,
                        img: songInfo.player_response.videoDetails.thumbnail.thumbnails[0].url,
                        url: songInfo.videoDetails.video_url,
                        duration: songInfo.videoDetails.lengthSeconds,
                        ago: songInfo.videoDetails.publishDate,
                        likes: songInfo.videoDetails.likes,
                        dislikes: songInfo.videoDetails.dislikes,
                        channelname: songInfo.videoDetails.ownerChannelName,
                        views: String(songInfo.videoDetails.viewCount).padStart(10, ' '),
                      };
                      serverQueue.songs[serverQueue.songs.length] = song2
                    } catch (err) {
                    }

                    })();
                  }
                }
              } else {
                for (i = 1; i < 40; i++) {
                  if (list.videos[i].title == '[Deleted video]' || list.videos[i].title == '[Private video]') {
                  } else {
                    (async () => {
                      try {
                      const songInfo = await ytdl.getInfo(`https://www.youtube.com/watch?v=${list.videos[i].id}`)
                      let song2 = {
                        title: songInfo.videoDetails.title,
                        img: songInfo.player_response.videoDetails.thumbnail.thumbnails[0].url,
                        url: songInfo.videoDetails.video_url,
                        duration: songInfo.videoDetails.lengthSeconds,
                        ago: songInfo.videoDetails.publishDate,
                        likes: songInfo.videoDetails.likes,
                        dislikes: songInfo.videoDetails.dislikes,
                        channelname: songInfo.videoDetails.ownerChannelName,
                        views: String(songInfo.videoDetails.viewCount).padStart(10, ' '),
                      };
                      serverQueue.songs[serverQueue.songs.length] = song2
                    } catch (err) {
                    }

                    })();
                  }
                }
                if (list[0] == undefined) {
                  return message.channel.send(`Nothing found for **${args.join(" ")}** `).catch((error) => {
                    return;
                  });
                }

              }
              try {
                let connection = await vc.join();
                queueConstructor.connection = connection;
                play(message.guild, queueConstructor.songs[0]);
              } catch (err) {
                console.error(err);
                queue.delete(message.guild.id);
                return message.channel.send(`Unable to join the voice chat ${err}`).catch((error) => {
                  return;
                });
              }
            } else {
              const queueConstructor = {
                txtChannel: message.channel,
                vChannel: vc,
                connection: null,
                songs: [],
                volume: 50,
                playing: true,
                loop: false
              };
              queue.set(message.guild.id, queueConstructor)
              const list2 = await YouTube.search(`${args.join(" ")} playlist`, { limit: 2, type: "playlist" })
                .catch(console.error);
              if (list2[0] == undefined) {
                return message.channel.send(`Nothing found for **${args.join(" ")}** `).catch((error) => {
                  return;
                });
              }

              var i;
              const list = await YouTube.getPlaylist(`${list2[0].url}`, { limit: 40 }).catch((error) => {
                return;
              });
              let button4 = new MessageButton()
                .setLabel("Playlist")
                .setID("playlist")
                .setStyle("grey")
              let button5 = new MessageButton()
                .setLabel("Shuffle")
                .setID("shuffle")
                .setStyle("grey")
              let buttonRow = new MessageActionRow()
                .addComponent(button4)
                .addComponent(button5)

              let playlistv = new Discord.MessageEmbed()
                .setAuthor("Playlist added the queue!")
                .setThumbnail(list.thumbnail)
                .setTitle(`${list.title}`)
                .setURL(list.url)
                .setColor("#000000")
                .addField("Channel ", `${list.channel.name}`, true)
                .addField("Total Video ", `${list.videoCount}`, true)
                .setTimestamp();
              message.channel.send({
                component: buttonRow,
                embed: playlistv

              }).catch((error) => {
                return;
              });
              function myFunc(arg) {
                var i = 1;
                aaa = serverQueue.songs.map(song => `**${i++}.** ${song.title}`).join('\n')
                if (aaa.length >= 2000) {
                  aaa = `${aaa.substr(0, 1900)}...`;
                  bbb = aaa + `\n**Now playing:** ${serverQueue.songs[0].title}`

                  return message.channel.send(bbb).catch((error) => {
                    return;
                  });
                } else {
                  var i = 1;
                  return message.channel.send(`
        **New Song queue:**
        ${serverQueue.songs.map(song => `**${i++}.** ${song.title}`).join('\n')}
        **Now playing:** ${serverQueue.songs[0].title}
            `).catch((error) => {
                    return;
                  });
                }
              }
              if (list2 == undefined) {
                return message.channel.send('Give valid playlist url!').catch((error) => {
                  return;
                });
              }
              const serverQueue = await queue.get(message.guild.id);
              try {
              const songInfo = await ytdl.getInfo(`https://www.youtube.com/watch?v=${list.videos[0].id}`)
              let song3 = {
                title: songInfo.videoDetails.title,
                img: songInfo.player_response.videoDetails.thumbnail.thumbnails[0].url,
                url: songInfo.videoDetails.video_url,
                duration: songInfo.videoDetails.lengthSeconds,
                ago: songInfo.videoDetails.publishDate,
                likes: songInfo.videoDetails.likes,
                dislikes: songInfo.videoDetails.dislikes,
                channelname: songInfo.videoDetails.ownerChannelName,
                views: String(songInfo.videoDetails.viewCount).padStart(10, ' '),
              };
              serverQueue.songs[0] = song3
            } catch (err) {
            }
              if (list.videos.length < 40) {
                for (i = 1; i < list.videos.length; i++) {
                  if (list.videos[i].title == '[Deleted video]' || list.videos[i].title == '[Private video]') {
                  } else {
                    (async () => {
                      try {
                      const songInfo = await ytdl.getInfo(`https://www.youtube.com/watch?v=${list.videos[i].id}`)
                      let song2 = {
                        title: songInfo.videoDetails.title,
                        img: songInfo.player_response.videoDetails.thumbnail.thumbnails[0].url,
                        url: songInfo.videoDetails.video_url,
                        duration: songInfo.videoDetails.lengthSeconds,
                        ago: songInfo.videoDetails.publishDate,
                        likes: songInfo.videoDetails.likes,
                        dislikes: songInfo.videoDetails.dislikes,
                        channelname: songInfo.videoDetails.ownerChannelName,
                        views: String(songInfo.videoDetails.viewCount).padStart(10, ' '),
                      };
                      serverQueue.songs[serverQueue.songs.length] = song2
                    } catch (err) {
                    }

                    })();
                  }
                }
              } else {
                for (i = 1; i < 40; i++) {
                  if (list.videos[i].title == '[Deleted video]' || list.videos[i].title == '[Private video]') {
                  } else {
                    (async () => {
                      try {
                      const songInfo = await ytdl.getInfo(`https://www.youtube.com/watch?v=${list.videos[i].id}`).catch((error) => {
                        return;
                      });
                      let song2 = {
                        title: songInfo.videoDetails.title,
                        img: songInfo.player_response.videoDetails.thumbnail.thumbnails[0].url,
                        url: songInfo.videoDetails.video_url,
                        duration: songInfo.videoDetails.lengthSeconds,
                        ago: songInfo.videoDetails.publishDate,
                        likes: songInfo.videoDetails.likes,
                        dislikes: songInfo.videoDetails.dislikes,
                        channelname: songInfo.videoDetails.ownerChannelName,
                        views: String(songInfo.videoDetails.viewCount).padStart(10, ' '),
                      };
                      serverQueue.songs[serverQueue.songs.length] = song2
                    } catch (err) {
                    }
                    })();
                  }
                }

              }
              //setTimeout(myFunc, 4000, 'funky')
              try {
                let connection = await vc.join();
                queueConstructor.connection = connection;
                play(message.guild, queueConstructor.songs[0]);
              } catch (err) {
                console.error(err);
                queue.delete(message.guild.id);
                return message.channel.send(`Unable to join the voice chat ${err}`).catch((error) => {
                  return;
                });
              }

            }

          } else {
            var res3 = args[1].split("=")
            abu2 = res3[1]
            if (args[0] == 'playlist' && abu2 !== undefined) {
              var i;
              const list = await YouTube.getPlaylist(`${args[1]}`, { limit: 40 }).catch((error) => {
                return;
              });
              if (list == undefined) {
                return message.channel.send('Give valid playlist url!').catch((error) => {
                  return;
                });
              }
              if (list.videos.length < 40) {
                for (i = 0; i < list.videos.length; i++) {
                  if (list.videos[i].title == '[Deleted video]' || list.videos[i].title == '[Private video]') {
                  } else {
                    (async () => {
                      try {
                      const songInfo = await ytdl.getInfo(`https://www.youtube.com/watch?v=${list.videos[i].id}`)
                      let song2 = {
                        title: songInfo.videoDetails.title,
                        img: songInfo.player_response.videoDetails.thumbnail.thumbnails[0].url,
                        url: songInfo.videoDetails.video_url,
                        duration: songInfo.videoDetails.lengthSeconds,
                        ago: songInfo.videoDetails.publishDate,
                        likes: songInfo.videoDetails.likes,
                        dislikes: songInfo.videoDetails.dislikes,
                        channelname: songInfo.videoDetails.ownerChannelName,
                        views: String(songInfo.videoDetails.viewCount).padStart(10, ' '),
                      };
                      serverQueue.songs[serverQueue.songs.length] = song2
                    } catch (err) {
                    }

                    })();
                  }
                }
              } else {
                for (i = 0; i < 40; i++) {
                  if (list.videos[i].title == '[Deleted video]' || list.videos[i].title == '[Private video]') {
                  } else {
                    (async () => {
                      try {
                      const songInfo = await ytdl.getInfo(`https://www.youtube.com/watch?v=${list.videos[i].id}`)
                      let song2 = {
                        title: songInfo.videoDetails.title,
                        img: songInfo.player_response.videoDetails.thumbnail.thumbnails[0].url,
                        url: songInfo.videoDetails.video_url,
                        duration: songInfo.videoDetails.lengthSeconds,
                        ago: songInfo.videoDetails.publishDate,
                        likes: songInfo.videoDetails.likes,
                        dislikes: songInfo.videoDetails.dislikes,
                        channelname: songInfo.videoDetails.ownerChannelName,
                        views: String(songInfo.videoDetails.viewCount).padStart(10, ' '),
                      };
                      serverQueue.songs[serverQueue.songs.length] = song2
                    } catch (err) {
                    }

                    })();
                  }
                }

              }
              let button4 = new MessageButton()
                .setLabel("Playlist")
                .setID("playlist")
                .setStyle("grey")
              let button5 = new MessageButton()
                .setLabel("Shuffle")
                .setID("shuffle")
                .setStyle("grey")
              let buttonRow = new MessageActionRow()
                .addComponent(button4)
                .addComponent(button5)

              let playlistv = new Discord.MessageEmbed()
                .setAuthor("Playlist added the queue!")
                .setThumbnail(list.thumbnail)
                .setTitle(`${list.title}`)
                .setURL(list.url)
                .setColor("#000000")
                .addField("Channel ", `${list.channel.name}`, true)
                .addField("Total Video ", `${list.videoCount}`, true)
                .setTimestamp();
              message.channel.send({
                component: buttonRow,
                embed: playlistv

              }).catch((error) => {
                return;
              });


            } else {
              const list2 = await YouTube.search(`${args.join(" ")} playlist`, { limit: 2, type: "playlist" })
                .catch(console.error);
              if (list2[0] == undefined) {
                return message.channel.send(`Nothing found for **${args.join(" ")}** `).catch((error) => {
                  return;
                });
              }
              let button4 = new MessageButton()
                .setLabel("Playlist")
                .setID("playlist")
                .setStyle("grey")
              let button5 = new MessageButton()
                .setLabel("Shuffle")
                .setID("shuffle")
                .setStyle("grey")
              let buttonRow = new MessageActionRow()
                .addComponent(button4)
                .addComponent(button5)
              let playlistv = new Discord.MessageEmbed()
                .setAuthor("Playlist added the queue!")
                .setThumbnail(list2[0].thumbnail)
                .setTitle(`${list2[0].title}`)
                .setURL(list2[0].url)
                .setColor("#000000")
                .addField("Channel ", `${list2[0].channel.name}`, true)
                .addField("Total Video ", `${list2[0].videoCount}`, true)
                .setTimestamp();
              message.channel.send({
                component: buttonRow,
                embed: playlistv

              }).catch((error) => {
                return;
              });
              var i;
              const list = await YouTube.getPlaylist(`${list2[0].url}`, { limit: 40 }).catch((error) => {
                return;
              });
              function myFunc(arg) {
                var i = 1;
                aaa = serverQueue5.songs.map(song => `**${i++}.** ${song.title}`).join('\n')
                if (aaa.length >= 2000) {
                  aaa = `${aaa.substr(0, 1900)}...`;
                  bbb = aaa + `\n**Now playing:** ${serverQueue5.songs[0].title}`

                  return message.channel.send(bbb).catch((error) => {
                    return;
                  });
                } else {
                  var i = 1;
                  return message.channel.send(`
**New Song queue:**
${serverQueue5.songs.map(song => `**${i++}.** ${song.title}`).join('\n')}
**Now playing:** ${serverQueue5.songs[0].title}
    `).catch((error) => {
                    return;
                  });
                }
              }
              //setTimeout(myFunc, 4000, 'funky')
              if (list2 == undefined) {
                return message.channel.send('Give valid playlist url!').catch((error) => {
                  return;
                });
              }


              if (list.videos.length < 40) {
                for (i = 0; i < list.videos.length; i++) {
                  if (list.videos[i].title == '[Deleted video]' || list.videos[i].title == '[Private video]') {
                  } else {
                    (async () => {
                      try {
                      const songInfo = await ytdl.getInfo(`https://www.youtube.com/watch?v=${list.videos[i].id}`)
                      let song2 = {
                        title: songInfo.videoDetails.title,
                        img: songInfo.player_response.videoDetails.thumbnail.thumbnails[0].url,
                        url: songInfo.videoDetails.video_url,
                        duration: songInfo.videoDetails.lengthSeconds,
                        ago: songInfo.videoDetails.publishDate,
                        likes: songInfo.videoDetails.likes,
                        dislikes: songInfo.videoDetails.dislikes,
                        channelname: songInfo.videoDetails.ownerChannelName,
                        views: String(songInfo.videoDetails.viewCount).padStart(10, ' '),
                      };
                      serverQueue.songs[serverQueue.songs.length] = song2
                    } catch (err) {
                    }

                    })();
                  }
                }
              } else {
                for (i = 0; i < 40; i++) {
                  if (list.videos[i].title == '[Deleted video]' || list.videos[i].title == '[Private video]') {
                  } else {
                    (async () => {
                      try {
                      const songInfo = await ytdl.getInfo(`https://www.youtube.com/watch?v=${list.videos[i].id}`)
                      let song2 = {
                        title: songInfo.videoDetails.title,
                        img: songInfo.player_response.videoDetails.thumbnail.thumbnails[0].url,
                        url: songInfo.videoDetails.video_url,
                        duration: songInfo.videoDetails.lengthSeconds,
                        ago: songInfo.videoDetails.publishDate,
                        likes: songInfo.videoDetails.likes,
                        dislikes: songInfo.videoDetails.dislikes,
                        channelname: songInfo.videoDetails.ownerChannelName,
                        views: String(songInfo.videoDetails.viewCount).padStart(10, ' '),
                      };
                      serverQueue.songs[serverQueue.songs.length] = song2
                    } catch (err) {
                    }

                    })();
                  }
                }

              }


            }

          }

        } else {
          let result = await YouTube.search(`${args.join(" ")}`, { limit: 3 })
          if (result == 0) {
            return message.channel.send(`Nothing found for **${args.join(" ")}** !`).catch((error) => {
              return;
            });
          }
          if (result[0].title == 'http://www.youtube.com/playlist?list=PL25CFEF79A36277F6') {
            message.channel.send(`Playlist will be added!`).catch((error) => {
              return;
            });
          }
          const songInfo = await ytdl.getInfo(`https://www.youtube.com/watch?v=${result[0].id}`)
          let song = {
            title: songInfo.videoDetails.title,
            img: songInfo.player_response.videoDetails.thumbnail.thumbnails[0].url,
            url: songInfo.videoDetails.video_url,
            duration: songInfo.videoDetails.lengthSeconds,
            ago: songInfo.videoDetails.publishDate,
            likes: songInfo.videoDetails.likes,
            dislikes: songInfo.videoDetails.dislikes,
            channelname: songInfo.videoDetails.ownerChannelName,
            views: String(songInfo.videoDetails.viewCount).padStart(10, ' '),
          };
          if (!serverQueue) {
            const queueConstructor = {
              txtChannel: message.channel,
              vChannel: vc,
              connection: null,
              songs: [],
              volume: 50,
              playing: true,
              loop: false
            };
            queue.set(message.guild.id, queueConstructor);

            queueConstructor.songs.push(song);

            try {
              let connection = await vc.join();
              queueConstructor.connection = connection;
              play(message.guild, queueConstructor.songs[0]);
            } catch (err) {
              queue.delete(message.guild.id);
              return message.channel.send(`Unable to join the voice chat ${err}`).catch((error) => {
                return;
              });
            }
          } else {
            serverQueue.songs.push(song);
            serverQueue5 = serverQueue;
            serverQueue6 = serverQueue;
            serverQueue7 = serverQueue;
            serverQueue8 = serverQueue;
            serverQueue9 = serverQueue;
            serverQueue10 = serverQueue;
            serverQueue11 = serverQueue;
            serverQueue12 = serverQueue;
            serverQueue13 = serverQueue;

            if (args[0] == 'playlist') {
              console.log(args)
              var res = args[1].split("=")
              const list = await yts({ listId: `${res[1]}` })

              list.videos.forEach(function (video) {
                console.log(video.title)
                if (video.title == '[Deleted video]') {
                  console.log(1)
                } else {
                  (async () => {
                    const songInfo = await ytdl.getInfo(`https://www.youtube.com/watch?v=${video.videoId}`)
                    let song2 = {
                      title: songInfo.videoDetails.title,
                      img: songInfo.player_response.videoDetails.thumbnail.thumbnails[0].url,
                      url: songInfo.videoDetails.video_url,
                      duration: songInfo.videoDetails.lengthSeconds,
                      ago: songInfo.videoDetails.publishDate,
                      likes: songInfo.videoDetails.likes,
                      dislikes: songInfo.videoDetails.dislikes,
                      channelname: songInfo.videoDetails.ownerChannelName,
                      views: String(songInfo.videoDetails.viewCount).padStart(10, ' '),
                    };
                    serverQueue.songs[serverQueue.songs.length] = song2

                  })();
                }
              })
              message.channel.send('Fetching songs please wait it will take time as playlist long').catch((error) => {
                return;
              });
            }
            let button4 = new MessageButton()
              .setLabel("Play Last")
              .setID("playnow")
              .setStyle("grey")
            var lel = (song.duration / 60)
            var lul = Math.floor(lel)
            var lul2 = song.duration - (lul * 60)
            let button5 = new MessageButton()
              .setLabel("Delete Last")
              .setID("delete")
              .setStyle("grey")
            let button6 = new MessageButton()
              .setLabel("Playlist")
              .setID("playlist")
              .setStyle("grey")
            let buttonRow = new MessageActionRow()
              .addComponent(button4)
              .addComponent(button5)
              .addComponent(button6)



            lul3 = song.views.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            let thing = new Discord.MessageEmbed()
              .setAuthor("The song added to the queue")
              .setThumbnail(song.img)
              .setTitle(`${song.title}`)
              .setURL(song.url)
              .setColor("#000000")
              .addField("Channel ", `${song.channelname}`, true)
              .addField("Views ", `${lul3}`, true)
              .addField("Duration", `${lul}min ${lul2}sec`, true)
              .setTimestamp();
            message.channel.send({
              component: buttonRow,
              embed: thing

            }).catch((error) => {
              return;
            });
          }
        }
      }
    }
    async function play(guild, song) {
      const vc = message.member.voice.channel
      const serverQueue = queue.get(guild.id);
      // serverQueue.connection.on("disconnect", () => {
      //   try {
      //     clearInterval(myVar);

      //   } catch {

      //   }
      //   try {
      //     clearInterval(myVar2);
      //   } catch {

      //   }
      //   queue.delete(guild.id);
      // });
      if (serverQueue.songs.length == 1) {
        var myVar = setInterval(check, 30000);
      }
      async function check() {
        var serverQueuelul = await queue.get(guild.id)
        var vc3 = await client.channels.fetch(serverQueue.vChannel.id).then(channel =>
          channel.members.size)
        if (serverQueuelul == undefined) {
          clearInterval(myVar);
          return;
        }
        if (vc3 < 2 && serverQueuelul !== undefined) {
          clearInterval(myVar);
          serverQueue.vChannel.leave()
          queue.delete(guild.id)
          let thing = new Discord.MessageEmbed()
            .setTitle(`Voice channel is empty! Music stopped. Queue deleted!`, `\`Voice channel was empty for 60 seconds.\``)
            .setColor("BLACK")
            .setTimestamp();
          message.channel.send(thing).catch((error) => {
            return;
          });

        }

      }
      serverQueue5 = serverQueue;
      serverQueue6 = serverQueue;
      serverQueue7 = serverQueue;
      serverQueue8 = serverQueue;
      serverQueue9 = serverQueue;
      serverQueue10 = serverQueue;
      serverQueue11 = serverQueue;
      serverQueue12 = serverQueue;
      serverQueue13 = serverQueue;
      if (!song) {
        serverQueue.vChannel.leave();
        queue.delete(guild.id);
        return;
      }
      try {
      const dispatcher = serverQueue.connection
        .play(await ytdl(song.url), { type: 'opus' })
        .on('finish', () => {
          if (!serverQueue.loop) serverQueue.songs.shift()
          if (serverQueue.songs[0] == undefined) {
            serverQueue.songs.shift();
          }
          play(guild, serverQueue.songs[0]);
        })
      } catch (err) {
      }
      if (!song) {
        serverQueue.vChannel.leave();
        queue.delete(guild.id);
        return;
      }
      var lel = (song.duration / 60)
      var lul = Math.floor(lel)
      var lul2 = song.duration - (lul * 60)
      if (song.likes == null) {
        lul3 = song.views.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        lul4 = "-"
        lul5 = "-"
      } else {
        lul3 = song.views.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        lul4 = song.likes.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        lul5 = song.dislikes.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
      let button = new MessageButton()
        .setLabel("Skip")
        .setID("skip")
        .setStyle("grey")

      let button2 = new MessageButton()
        .setLabel("Stop")
        .setID("stop")
        .setStyle("red")
      let button3 = new MessageButton()
        .setLabel("Pause | Resume")
        .setID("pause")
        .setStyle("grey")
      let button6 = new MessageButton()
        .setLabel("Playlist")
        .setID("playlist")
        .setStyle("grey")
      let button7 = new MessageButton()
        .setLabel("Loop")
        .setID("loop")
        .setStyle("grey")
      let buttonRow = new MessageActionRow()
        .addComponent(button)
        .addComponent(button2)
        .addComponent(button3)
        .addComponent(button6)
        .addComponent(button7)
        try {
      let thing = new Discord.MessageEmbed()
        .setAuthor("Now playing")
        .setThumbnail(song.img)
        .setTitle(`${song.title}`)
        .setURL(song.url)
        .setColor("#000000")
        .addField("Channel ", `${song.channelname}`, true)
        .addField("Views ", `${lul3}`, true)
        .addField("Duration", `${lul}min ${lul2}sec`, true)
        .addField("Likes ", `${lul4}`, true)
        .addField("Dislikes ", `${lul5}`, true)
        .addField("Release date", ` ${moment(song.ago).format("DD-MM-YYYY")} | ${moment(song.ago).fromNow()}`, true)
        .setTimestamp();
      message.channel.send({
        component: buttonRow,
        embed: thing

      }).catch((error) => {
        return;
      });
    } catch (err) {
    }
      if (serverQueue.volume == 50) {
        serverQueue.connection.dispatcher.setVolumeLogarithmic(50 / 100)
      }
      if (serverQueue.volume != 50) {
        console.log("bu")
        serverQueue.connection.dispatcher.setVolumeLogarithmic(serverQueue.volume / 100)
      }
    }
    async function stop(message, serverQueue2) {
      if (serverQueue2 == undefined) {
        return message.channel.send('Nothing playing right now!').catch((error) => {
          return;
        });
      }
      if (!message.member.voice.channel)
        return message.channel.send("You need to join the voice chat first!").catch((error) => {
          return;
        });
      if (serverQueue2 && !serverQueue2.playing) {
        serverQueue2.playing = true;
        await serverQueue2.connection.dispatcher.resume()
      }
      try {
        serverQueue2.songs = [];
        serverQueue2.connection.dispatcher.end();
      } catch (error) {
        return;
      }
    }
    async function skip(message, serverQueue3) {
      if (serverQueue3 == undefined) {
        return message.channel.send('Nothing playing right now!').catch((error) => {
          return;
        });
      }

      if (!message.member.voice.channel)
        return message.channel.send("You need to join the voice chat first").catch((error) => {
          return;
        });
      if (!serverQueue3.songs[1]) {
        return message.channel.send("There is nothing to skip!").catch((error) => {
          return;
        });
      }
      if (serverQueue3 && !serverQueue3.playing) {
        serverQueue3.playing = true;
        await serverQueue3.connection.dispatcher.resume()
      }
      if (serverQueue3 && serverQueue3.loop == true) {
        serverQueue3.loop = !serverQueue3.loop;
        message.channel.send("Loop is disabled. Song skipped!").catch((error) => {
          return;
        });
      }
      try {
        serverQueue3.connection.dispatcher.end()
      } catch (error) {
        return;
      }
    }
    function volume(message, serverQueue4) {
      if (!serverQueue4) {
        message.channel.send('Nothing playing right now!').catch((error) => {
          return;
        });
      }
      if (!serverQueue4.volume) {
        serverQueue4.volume = 50;
      }
      if (!message.member.voice.channel)
        return message.channel.send("You need to join the voice chat first").catch((error) => {
          return;
        });
      if (!args[0]) return message.reply(`🔊 The current volume is: **${serverQueue4.volume}%**`).catch((error) => {
        return;
      });
      if (isNaN(args[0])) return message.reply("Please use a number to set volume.").catch((error) => {
        return;
      });
      if (Number(args[0]) > 100 || Number(args[0]) < 0)
        return message.reply("Please use a number between 0 - 100.").catch((error) => {
          return;
        });
      serverQueue4.volume = args[0];
      serverQueue4.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);
      return message.channel.send(`Volume set to: **${args[0]}%**`).catch((error) => {
        return;
      });
    }
    function ping(message) {
      message.reply(`Average ping to API: ${Math.round(message.client.ws.ping)} ms`).catch((error) => {
        return;
      });

    }
    function uptime(message) {
      let seconds = Math.floor(message.client.uptime / 1000);
      let minutes = Math.floor(seconds / 60);
      let hours = Math.floor(minutes / 60);
      let days = Math.floor(hours / 24);

      seconds %= 60;
      minutes %= 60;
      hours %= 24;

      return message
        .reply(`Uptime: \`${days} day(s),${hours} hours, ${minutes} minutes, ${seconds} seconds\``).catch((error) => {
          return;
        });


    }
    function sug(message) {
      if (!args[0]) {
        return message.reply('You cant send empty message.').catch((error) => {
          return;
        });
      }
      message.delete();
      a = message.author.username;
      b = message.author.discriminator;
      bc = message.channel;
      bc2 = message.guild;
      lul33 = args.join(" ");
      lul32 = lul33.replace(/,/g, " ");
      lul34 = lul32.charAt(0).toUpperCase() + lul32.slice(1);
      var dateTime = moment().utcOffset("+03:00").format("DD-MM-YYYY HH:mm")
      message.reply(`Message sent to the owner.`).catch((error) => {
        return;
      });
      client.users.fetch(process.env.ownerid).then(user => {
        user.send(`-------------------------\nTime:**${dateTime}**,Server:**${bc2}**,Channel:**${bc}**,User:**${a}#${b}**\n**Message**:${lul34}\n-------------------------`).catch((error) => {
          return;
        });
      });


    }
    function userinfo(message) {
      const flags = {
        DISCORD_EMPLOYEE: 'Discord Employee',
        DISCORD_PARTNER: 'Discord Partner',
        BUGHUNTER_LEVEL_1: 'Bug Hunter (Level 1)',
        BUGHUNTER_LEVEL_2: 'Bug Hunter (Level 2)',
        HYPESQUAD_EVENTS: 'HypeSquad Events',
        HOUSE_BRAVERY: 'House of Bravery',
        HOUSE_BRILLIANCE: 'House of Brilliance',
        HOUSE_BALANCE: 'House of Balance',
        EARLY_SUPPORTER: 'Early Supporter',
        TEAM_USER: 'Team User',
        SYSTEM: 'System',
        VERIFIED_BOT: 'Verified Bot',
        VERIFIED_DEVELOPER: 'Early Verified Developer'
      };
      try {
        const member = message.mentions.members.last() || message.member;
        const roles = member.roles.cache
          .sort((a, b) => b.position - a.position)
          .map(role => role.toString())
          .slice(0, -1);
        const userFlags = member.user.flags.toArray();
        const embed = new Discord.MessageEmbed()
          .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
          .setColor("#000000")
          .addField('**Berserker**', [
            `**- Username:** ${member.user.username}#${member.user.discriminator}`,
            `**- Tag:** ${member}`,
            `**- Nickname** ${member.nickname || 'None'}`,
            `**- ID:** ${member.id}`,
            `**- Flags:** ${userFlags.length ? userFlags.map(flag => flags[flag]).join(', ') : 'None'}`,
            `**- Avatar:** [Link to avatar](${member.user.displayAvatarURL({ dynamic: true })})`,
            `**- Time Created:** ${moment(member.user.createdTimestamp).format("DD-MM-YYYY")} | ${moment(member.user.createdTimestamp).fromNow()}`,
            `**- Game:** ${member.user.presence.game || 'Not playing a game.'}`,
            `\u200b`
          ])
          .addField('Member', [
            `**- Highest Role:** ${member.roles.highest.id === message.guild.id ? 'None' : member.roles.highest.name}`,
            `**- Server Join Date:** ${moment(member.joinedAt).format("DD-MM-YYYY")} - ${moment(member.joinedAt).fromNow()}`,
            `**- Hoist Role:** ${member.roles.hoist ? member.roles.hoist.name : 'None'}`,
            `**- Roles [${roles.length}]:** ${roles.length < 10 ? roles.join(', ') : roles.length > 10 ? this.client.utils.trimArray(roles) : 'None'}`,
            `\u200b`
          ])
          .setTimestamp();
        return message.channel.send(embed).catch((error) => {
          return;
        });
      } catch (err) {
        return;
      }
    }
    function serverinfo(message) {
      const filterLevels = {
        DISABLED: 'Off',
        MEMBERS_WITHOUT_ROLES: 'No Role',
        ALL_MEMBERS: 'Everyone'
      };

      const verificationLevels = {
        NONE: 'None',
        LOW: 'Low',
        MEDIUM: 'Medium',
        HIGH: '(╯°□°）╯︵ ┻━┻',
        VERY_HIGH: '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'
      };

      const regions = {
        brazil: 'Brazil',
        europe: 'Europe',
        hongkong: 'Hong Kong',
        india: 'India',
        japan: 'Japan',
        russia: 'Russia',
        singapore: 'Singapore',
        southafrica: 'South Africa',
        sydeny: 'Sydeny',
        'us-central': 'US Central',
        'us-east': 'US East',
        'us-west': 'US West',
        'us-south': 'US South'
      };
      try {
        const roles = message.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString());
        const members = message.guild.members.cache;
        const channels = message.guild.channels.cache;
        const emojis = message.guild.emojis.cache;
        const embed = new Discord.MessageEmbed()
          .setDescription(`**Guild information for ${message.guild.name}**`)
          .setColor('#000000')
          .setThumbnail(message.guild.iconURL({ dynamic: true }))
          .addField('General', [
            `**- Name:** ${message.guild.name}`,
            `**- ID:** ${message.guild.id}`,
            `**- Owner:** ${message.guild.owner.user.tag}`,
            // `**- Region:** ${regions[message.guild.region]}`,
            `**- Boost Tier:** ${message.guild.premiumTier ? `Tier ${message.guild.premiumTier}` : 'None'}`,
            `**- Explicit Filter:** ${filterLevels[message.guild.explicitContentFilter]}`,
            `**- Verification Level:** ${verificationLevels[message.guild.verificationLevel]}`,
            `**- Time Created:** ${moment(message.guild.createdTimestamp).format("DD-MM-YYYY")} | ${moment(message.guild.createdTimestamp).fromNow()}`,
            '\u200b'
          ])
          .addField('Statistics', [
            `**- Role Count:** ${roles.length}`,
            `**- Emoji Count:** ${emojis.size}`,
            `**- Regular Emoji Count:** ${emojis.filter(emoji => !emoji.animated).size}`,
            `**- Animated Emoji Count:** ${emojis.filter(emoji => emoji.animated).size}`,
            `**- Member Count:** ${message.guild.memberCount}`,
            `**- Text Channels:** ${channels.filter(channel => channel.type === 'text').size}`,
            `**- Voice Channels:** ${channels.filter(channel => channel.type === 'voice').size}`,
            `**- Boost Count:** ${message.guild.premiumSubscriptionCount || '0'}`,
            '\u200b'
          ])
          .setTimestamp();
        message.channel.send(embed).catch((error) => {
          return;
        });
      }
      catch (err) {
        return;
      }
    }
    async function reddit(message) {
      if (message.channel.nsfw === true) {
        nsfwtag = 1;
      } else {
        nsfwtag = 2;
      }
      let subreddits = [
        "memes",
        "aww"
      ];
      if (!args[0]) {
        subreddit = subreddits[Math.floor(Math.random() * (subreddits.length))];
      } else {
        subreddit = args[0];
      }
      const embed = new Discord.MessageEmbed()
      got(`https://reddit.com/r/${subreddit}/random/.json`).then(response => {
        let content = JSON.parse(response.body);
        let permalink = content[0].data.children[0].data.permalink;
        let nsfw = content[0].data.children[0].data.over_18;
        let memeUrl = `https://reddit.com${permalink}`;
        let memeImage = content[0].data.children[0].data.url;
        let memeTitle = content[0].data.children[0].data.title;
        let upvoteratio = content[0].data.children[0].data.upvote_ratio;
        let memeUpvotes = content[0].data.children[0].data.ups;
        lulre7 = memeUpvotes.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        let memeNumComments = content[0].data.children[0].data.num_comments;
        lulre8 = memeNumComments.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        let author = content[0].data.children[0].data.author;
        let lol = content[0].data.children[0].data.selftext;
        let lol3 = content[0].data.children[0].data.url_overridden_by_dest;
        const upvoteperc = upvoteratio * 100
        let date = content[0].data.children[0].data.created_utc;
        const dateup = `${moment.utc(date * 1000).format("DD-MM-YYYY")} - ${moment.utc(date * 1000).fromNow()}`
        embed.setTitle(`${memeTitle}`)
        embed.setURL(`${memeUrl}`)
        if (nsfw == true && nsfwtag != 1) {
          return message.channel.send('This post contains NSFW content please use it on NSFW marked channel').catch((error) => {
            return;
          });
        }
        allu = memeImage.slice(memeImage.length - 5)
        if (memeImage[8] == 'i' & allu != '.gifv') {
          embed.setImage(memeImage)
        }
        embed.setAuthor(`From r/${subreddit} - by u/${author}‎‎‎‎‏‏‎ ‎`)
        embed.setColor('#000000')
        embed.setFooter(`▲ ${lulre7} 💬 ${lulre8} | Upvote Rate: ${upvoteperc}% | ${dateup}`)
        if (!lol) {
          if (!lol3) {
            message.channel.send(embed).catch((error) => {
              return;
            });
          } else {
            if (memeImage[8] == 'i') {
              message.channel.send(embed).catch((error) => {
                return;
              });
            } else {
              message.channel.send(embed).catch((error) => {
                return;
              });
              message.channel.send(lol3).catch((error) => {
                return;
              });
            }
          }
          if (allu == '.gifv') {
            message.channel.send(lol3).catch((error) => {
              return;
            });
          }
        } else {
          if (!lol3) {
            message.channel.send(embed).catch((error) => {
              return;
            });
            message.channel.send(lol).catch((error) => {
              return;
            });
          } else {
            if (memeImage[8] == 'i') {
              message.channel.send(embed).catch((error) => {
                return;
              });
              message.channel.send(lol).catch((error) => {
                return;
              });
            } else {
              message.channel.send(embed).catch((error) => {
                return;
              });
              message.channel.send(lol).catch((error) => {
                return;
              });
              message.channel.send(lol3).catch((error) => {
                return;
              });
            }
          }

        }
      }).catch(e =>
        message.channel.send('Subreddit doest not exist please try again with valid subreddit.')).catch((error) => {
          return;
        });
    }
    async function reddituser(message) {
      if (!args[0]) {
        subreddit = 'voltranexafk';
      } else {
        subreddit = args[0];
      }
      const embed = new Discord.MessageEmbed()
      got(`https://reddit.com/user/${subreddit}/about.json`).then(response => {
        let content = JSON.parse(response.body);
        let akarma = content.data.awarder_karma;
        lulre9 = akarma.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        let aakarma = content.data.awardee_karma;
        lulre10 = aakarma.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        let linkarma = content.data.link_karma;
        lulre11 = linkarma.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        let commentkarma = content.data.comment_karma;
        lulre12 = commentkarma.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        let totalkarma = content.data.total_karma;
        lulre13 = totalkarma.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        let snowti = content.data.snoovatar_img;
        let nealaka = content.data.name;
        let date = content.data.created_utc;
        embed.setTitle(`u/${nealaka}`)
        if (!snowti) {
          embed.setThumbnail(content.data.icon_img.replace(/(amp;)/gi, ""))
        } else {
          embed.setThumbnail(snowti)
        }
        embed.setURL(`https://www.reddit.com/user/${subreddit}`)
        embed.setAuthor(`Berserker`)
        embed.addFields(
          { name: 'Post Karma', value: `${lulre11}`, inline: true },
          { name: 'Comment Karma', value: `${lulre12}`, inline: true },
          { name: 'Total Karma', value: `${lulre13}`, inline: true },
          { name: 'Awarder Karma', value: `${lulre9}`, inline: true },
          { name: 'Awardee Karma', value: `${lulre10}`, inline: true },
          { name: 'Verified', value: content.data.verified ? "Yes" : "No", inline: true },
          { name: 'Premium', value: content.data.is_gold ? "Yes" : "No", inline: true },
          { name: 'Reddit Staff ', value: content.data.is_employee ? "Yes" : "No", inline: true },
          { name: 'Cake Day', value: `${moment.utc(date * 1000).format('LT')} ${moment.utc(date * 1000).format('LL')}`, inline: true },
        )
        embed.setColor('#000000')
        embed.setTimestamp()
        message.channel.send(embed).catch((error) => {
          return;
        });

      }).catch(e => message.channel.send('User does not exist or hidden profile')).catch((error) => {
        return;
      });
    }
    async function redditus(message) {
      if (!args[0]) {
        userred = 'voltranexafk';
      } else {
        userred = args[0];
      }
      if (message.channel.nsfw === true) {
        nsfwtag = 1;
      } else {
        nsfwtag = 2;
      }
      rand = (Math.floor(Math.random() * (100)))
      try {
        await Reddit.user(`${userred}`).submitted().limit(rand + 1).exec(function (data) {
          testo = typeof (data.data)
          testo2 = data.data.children[rand]
          if (testo2 == undefined) {
            return;
          }
          if (testo == "undefined") {
            return message.channel.send('User doest not exist or hidden').catch((error) => {
              return;
            });
          }
          const embed = new Discord.MessageEmbed()
          let permalink = data.data.children[rand].data.permalink
          let memeUrl = `https://reddit.com${permalink}`;
          let nsfw = data.data.children[rand].data.over_18;
          let memeImage = data.data.children[rand].data.url;
          let memeTitle = data.data.children[rand].data.title;
          let upvoteratio = data.data.children[rand].data.upvote_ratio;
          let memeUpvotes = data.data.children[rand].data.ups;
          lulre7 = memeUpvotes.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          let memeNumComments = data.data.children[rand].data.num_comments;
          lulre8 = memeNumComments.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          let author = data.data.children[rand].data.author;
          let lol = data.data.children[rand].data.selftext;
          let lol3 = data.data.children[rand].data.url_overridden_by_dest;
          let lolsub = data.data.children[rand].data.subreddit;
          let date = data.data.children[rand].data.created_utc;
          const dateup = `${moment.utc(date * 1000).format("DD-MM-YYYY")} - ${moment.utc(date * 1000).fromNow()}`
          const upvoteperc = upvoteratio * 100
          if (nsfw == true && nsfwtag != 1) {
            return message.channel.send('This post contains NSFW content please use it on NSFW marked channel').catch((error) => {
              return;
            });
          }
          embed.setTitle(`${memeTitle}`)
          embed.setURL(`${memeUrl}`)
          allu = memeImage.slice(memeImage.length - 5)
          if (memeImage[8] == 'i' & allu != '.gifv') {
            embed.setImage(memeImage)
          }
          if (lolsub == 'u_VoltranexAFK') {
            embed.setAuthor(` u/${author}`)
          } else {
            embed.setAuthor(` u/${author} From r/${lolsub}`)
          }
          embed.setColor('#000000')
          embed.setFooter(`▲ ${lulre7} 💬 ${lulre8} Upvote Rate: ${upvoteperc}% | ${dateup}`)
          if (!lol) {
            if (!lol3) {
              message.channel.send(embed).catch((error) => {
                return;
              });
            } else {
              if (memeImage[8] == 'i') {
                message.channel.send(embed).catch((error) => {
                  return;
                });
              } else {
                message.channel.send(embed).catch((error) => {
                  return;
                });
                message.channel.send(lol3).catch((error) => {
                  return;
                });
              }
            }
            if (allu == '.gifv') {
              message.channel.send(lol3).catch((error) => {
                return;
              });
            }
          } else {
            if (!lol3) {
              message.channel.send(embed).catch((error) => {
                return;
              });
              message.channel.send(lol).catch((error) => {
                return;
              });
            } else {
              if (memeImage[8] == 'i') {
                message.channel.send(embed).catch((error) => {
                  return;
                });
                message.channel.send(lol).catch((error) => {
                  return;
                });
              } else {
                message.channel.send(embed).catch((error) => {
                  return;
                });
                message.channel.send(lol).catch((error) => {
                  return;
                });
                message.channel.send(lol3).catch((error) => {
                  return;
                });
              }
            }

          }
        })
      } catch (e) {
        return message.channel.send('Use the command slowly!').catch((error) => {
          return;
        });
      }
    }
    function playlist(message, serverQueue5) {
      if (!serverQueue5) return message.channel.send('Nothing playing right now!');
      var i = 1;
      aaa = serverQueue5.songs.map(song => `**${i++}.** ${song.title}`).join('\n')
      if (aaa.length >= 2000) {
        aaa = `${aaa.substr(0, 1900)}...`;
        bbb = aaa + `\n**Now playing:** ${serverQueue5.songs[0].title}`

        return message.channel.send(bbb).catch((error) => {
          return;
        });
      } else {
        var i = 1;
        return message.channel.send(`
**Song queue:**
${serverQueue5.songs.map(song => `**${i++}.** ${song.title}`).join('\n')}
**Now playing:** ${serverQueue5.songs[0].title}
		`).catch((error) => {
          return;
        });
      }
    }

    async function lyrics(message, serverQueue6) {
      if (!args[0] && !serverQueue6) {
        return message.channel.send('There is nothing playing now!').catch((error) => {
          return;
        });
      }
      if (!args[0]) {
        lul31 = (`${serverQueue6.songs[0].title}`)
        lul32 = lul31.replace(/’/g, "");
        lul33 = lul32.replace(/lyric/g, "");
        lul34 = lul33.replace(/lyrics/g, "");
        lul35 = lul34.replace(/Lyrics/g, "");
        lul36 = lul35.replace(/Lyric/g, "");
        lul37 = lul36.replace(/video/g, "");
        lul38 = lul37.replace(/Video/g, "");
      } else {
        lul31 = args.join("")
        lul32 = lul31.replace(/’/g, "");
        lul33 = lul32.replace(/lyric/g, "");
        lul34 = lul33.replace(/lyrics/g, "");
        lul35 = lul34.replace(/Lyrics/g, "");
        lul36 = lul35.replace(/Lyric/g, "");
        lul37 = lul36.replace(/video/g, "");
        lul38 = lul37.replace(/Video/g, "");
      }
      const options = {
        apiKey: process.env.genius,
        title: `${lul38}`,
        artist: '',
        optimizeQuery: true
      };

      const a = await searchSong(options)
      if (a == null) {
        return message.channel.send('Nothing found').catch((error) => {
          return;
        });
      }
      const titleup = a[0].title.split("by")
      const titleauth = titleup[1];
      const titlename = titleup[0];
      const lyrics = await getSong(options)
      if (!lyrics) {
        message.channel.send('Cannot acces to the lyrics').catch((error) => {
          return;
        });
      } else {
        let lyricsEmbed = new Discord.MessageEmbed()
          .setAuthor(`${titleauth} | ${titlename} Lyrics`)
          .setThumbnail(a[0].albumArt)
          .setColor("#000000")
          .setDescription(lyrics.lyrics)
          .setTimestamp();
        if (lyricsEmbed.description.length >= 2048)
          lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
        return message.channel.send(lyricsEmbed).catch((error) => {
          return;
        });
      }

    }
    async function clear(message) {
      lool2334 = 1
      if (!message.member.permissions.has("MANAGE_MESSAGES")) // sets the permission
        return message.reply(
          `You do not have permissions to clear messages. ` // returns this message to user with no perms
        ).catch((error) => {
          return;
        });
      abu = Number(args[0])
      lul = isNaN(abu)
      if (lul == true || args[0] > 100) {
        (async () => {
          deleteAmount = 1
          await message.channel.bulkDelete(deleteAmount, true).catch((error) => {
            return;
          });
        })();
        return message.reply('You have to give number between 1-100 \`This message will be deleted after 10 seconds.\`').then(msg => {
          msg.delete({ timeout: 10000 }).catch((error) => {
            return;
          });
        })
          .catch((error) => {
            return;
          });
      }
      let filter = m => m.author.id === message.author.id
      message.channel.send(`Are you sure to delete ${args[0]} messages? \`YES\` / \`NO\``).then(message => {
        message.channel.awaitMessages(filter, {
          max: 1,
          time: 30000,
          errors: ['time']
        })
          .then(message => {
            message = message.first()
            if (message.content.toUpperCase() == 'YES' || message.content.toUpperCase() == 'Y') {
              let deleteAmount;

              if (parseInt(args[0]) > 100 || parseInt(args[0]) == 100) {
                deleteAmount = 100;
              } else {
                deleteAmount1 = parseInt(args[0]);
                deleteAmount = deleteAmount1 + 3
              }
              (async () => {
                await message.channel.bulkDelete(deleteAmount, true).catch((error) => {

                  lool2334 = 0
                  return message.channel.send('Bot missing permission!\`This message will be deleted after 10 seconds.\`').then(msg => {
                    msg.delete({ timeout: 10000 }).catch((error) => {
                      return;
                    });
                  }).catch((error) => {
                    return;
                  });
                });
                if (lool2334 == 0) {
                  return;
                } else {
                  message.reply(`${args[0]} message deleted.\`This message will be deleted after 10 seconds.\``).then(msg => {
                    msg.delete({ timeout: 10000 }).catch((error) => {
                      return;
                    });
                  })
                    .catch((error) => {
                      return;
                    });
                }

              })();
            } else if (message.content.toUpperCase() == 'NO' || message.content.toUpperCase() == 'N') {
              (async () => {
                deleteAmount = 3
                await message.channel.bulkDelete(deleteAmount, true).catch((error) => {
                  return;
                });
              })();
              message.channel.send(`Terminated.\`This message will be deleted after 10 seconds.\``).then(msg => {
                msg.delete({ timeout: 10000 }).catch((error) => {
                  return;
                });
              })
                .catch((error) => {
                  return;
                });
            } else {
              (async () => {
                deleteAmount = 2
                await message.channel.bulkDelete(deleteAmount, true).catch((error) => {
                  return;
                });
              })();
              message.channel.send(`Terminated: Invalid Response.\`This message will be deleted after 10 seconds.\``).then(msg => {
                msg.delete({ timeout: 10000 }).catch((error) => {
                  return;
                });
              })
                .catch((error) => {
                  return;
                });
            }
          })
          .catch(collected => {
            (async () => {
              deleteAmount = 1
              await message.channel.bulkDelete(deleteAmount, true).catch((error) => {
                return;
              });
            })();
            message.channel.send('Timeout.\`This message will be deleted after 10 seconds.\`').then(msg => {
              msg.delete({ timeout: 10000 }).catch((error) => {
                return;
              });
            })
              .catch((error) => {
                return;
              });
          });
      }).catch((error) => {
        return;
      });

    }
    async function trn(message) {
      if (!args[0]) {
        return message.channel.send(`Use ${prefix}help for correct usage!`).catch((error) => {
          return;
        });
      }
      traf = args.join(" ")
      const argus = traf.slice(args[0].length)
      const argus2 = argus.replace(" ", "")

      translate(`${argus}`, { to: `${args[0]}` }).then(res => {
        translated = res.text
        const translated3 = translated.charAt(0).toUpperCase() + translated.slice(1)
        tranlatelang = res.from.language.iso
        translatelangup = ISO6391.getName(args[0])
        tranlatelanglangup = ISO6391.getName(tranlatelang)
        const traf2 = argus2.charAt(0).toUpperCase() + argus2.slice(1)
        if (traf2.length > 1024 || translated3.length > 1024) {
          message.channel.send(`**${tranlatelanglangup} to ${translatelangup} translate**\n\n ${translated} \n\n **----------------------------------**`).catch((error) => {
            return;
          });
        } else {
          const embed = new Discord.MessageEmbed()
            .setAuthor("Berserker Google Translate")
            .setColor("#000000")
            .setThumbnail('https://cdn.discordapp.com/attachments/789864720533291058/805051261299982336/4410197cf5de4fefe413b55860bb617d.png')
            .addField(`${tranlatelanglangup}`, [
              `${traf2}`,
              '\u200b'
            ])
            .addField(`${translatelangup}`, [
              `${translated3}`,
              '\u200b'

            ])
            .setTimestamp();
          message.channel.send(embed).catch((error) => {
            return;
          });

        }


      }).catch(err => {
        return message.channel.send(`**${args[0]}** is not suppported. Check codes here \n https://cloud.google.com/translate/docs/languages `)
      });
    }
    async function weather(message) {
      if (!args[0]) {
        args5 = 'Ankara';
      } else {
        var args1 = args[0].replace(/ü/g, "u");
        var args2 = args1.replace(/ğ/g, "g");
        var args3 = args2.replace(/ş/g, "s");
        var args4 = args3.replace(/ı/g, "i");
        var args5 = args4.replace(/ö/g, "o");
      }
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?q=${args5}&units=metric&appid=${apitoken}`
        )
        .then(response => {
          let apiData = response;
          let currentTemp = Math.ceil(apiData.data.main.temp)
          let maxTemp = apiData.data.main.temp_max;
          let minTemp = apiData.data.main.temp_min;
          let humidity = apiData.data.main.humidity;
          let wind = apiData.data.wind.speed;
          let author = message.author.username
          let profile = message.author.displayAvatarURL
          let icon = apiData.data.weather[0].icon
          let cityName = apiData.data.name
          let cityCode = apiData.data.id
          let city = cityName.split(" ")
          let country = apiData.data.sys.country
          let realfeel = apiData.data.main.feels_like
          let pressure = apiData.data.main.pressure;
          let cloudness = apiData.data.weather[0].description;
          const cloudness1 = cloudness.charAt(0).toUpperCase() + cloudness.slice(1)
          const exampleEmbed = (
            temp,
            maxTemp,
            minTemp,
            pressure,
            humidity,
            wind,
            cloudness,
            icon,
            author,
            profile,
            cityName,
            country
          ) =>
            new Discord.MessageEmbed()
              .setColor('#000000')
              .setAuthor("Berserker Weather")
              .setURL(`https://openweathermap.org/city/${cityCode}`)
              .setTitle(`There is ${temp}\u00B0 C in ${city[0]}, ${country}`)
              .addField(`Max - Min Temp`, `${maxTemp} | ${minTemp}\u00B0 C`, true)
              .addField(`Feelslike:`, `${realfeel}\u00B0 C`, true)
              .addField(`Humidity:`, `${humidity} %`, true)
              .addField(`Wind Speed:`, `${wind} m/s`, true)
              .addField(`Pressure:`, `${(pressure * 0.00098692316931427).toFixed(4)} Atm`, true)
              .addField(`Cloudiness:`, `${cloudness1}`, true)
              .setThumbnail(`http://openweathermap.org/img/w/${icon}.png`)
              .setTimestamp()

          message.channel.send(exampleEmbed(currentTemp, maxTemp, minTemp, pressure, humidity, wind, cloudness, icon, author, profile, cityName, country));
        }).catch(err => {
          //console.log(err)
          return message.channel.send('Enter valid city or use english characters only').catch((error) => {
            return;
          });
        })
    }
    function invite(message) {
      let time;
      let timeInfo;
      if (args[0] == 'permanent' || args[0] == 'perm') {
        if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('You must have the Administrator permission to make a permanent invite link!').catch((error) => {
          return;
        });
        time = 0
        timeInfo = 'is permanent!'
      } else {
        if (!message.member.hasPermission('CREATE_INSTANT_INVITE')) return message.channel.send('You must have the Create İnvite permission to make a invite link!').catch((error) => {
          return;
        });
        time = 86400
        timeInfo = 'will expire in 1 day!'
      }

      message.channel.createInvite({
        unique: true,
        maxAge: time
      })
        .then(invite => {
          const Embed = new Discord.MessageEmbed()
            .setTitle(`**Berserker**\nInvite Link for ${message.guild.name} Server `)
            .addField('İnvite link', `https://discord.gg/${invite.code}`)
            .setDescription("You can easily copy and send this link to invite somebody to server!")
            .setFooter(`This link ${timeInfo}`)
            .setColor("#000000")
            .setTimestamp()
          message.channel.send(Embed).catch((error) => {
            return;
          });
        })
        .catch((error) => {
          return message.channel.send("Missing permissions! Check Berserker's permission!").catch((error) => {
            return;
          });
          return;
        });
    }
    async function csgo(message) {
      traf = args.join(" ")
      if (!args[0]) {
        return message.channel.send(`Enter something to search`).catch((error) => {
          return;
        });
      }
      if (args[0] == 'usd' || args[0] == 'USD') {
        aa = [];
        bb = [];
        cc = [];
        traf2 = traf.replace(/usd/g, "");
        traf3 = traf2.replace(/USD/g, "");
        var u = 0;
        const son = await market.search(730, `${traf3}`)
        if (!son[0]) {
          return message.channel.send('Nothing found').catch((error) => {
            return;
          });
        }
        var i = son.length - 6;
        if (i < 0) {
          var i = 0;
        }
        while (i < son.length) {
          var sonuu = son[i].sale_price_text.replace(/,/g, "");
          var sonyy = son[i].sell_price_text.replace(/,/g, "");
          var sonuu2 = sonuu.replace("$", "")
          var sonyy2 = sonyy.replace("$", "")
          var loool2 = son[i].asset_description.market_hash_name.replace(/\s/g, '%20')
          var loool3 = loool2.replace(/[|]/g, '%7C')
          var loool4 = loool3.concat('/')
          aa[u] = sonuu2
          bb[u] = loool4
          cc[u] = sonyy2
          i++;
          u++
        }
        if (son.length == 6 || son.length > 6) {
          const Embed = new Discord.MessageEmbed()
            .setTitle(`Berserker CSGO Market search `)
            .setThumbnail(`https://community.akamai.steamstatic.com/economy/image/${son[son.length - 6].asset_description.icon_url}`)
            .addField(`${son[son.length - 6].hash_name}`, `Cheapest on market - **${cc[0]} $** | Average - **${aa[0]} $**\nhttps://steamcommunity.com/market/listings/730/${bb[0]}`)
            .addField(`${son[son.length - 5].hash_name}`, `Cheapest on market - **${cc[1]} $** | Average - **${aa[1]} $**\nhttps://steamcommunity.com/market/listings/730/${bb[1]}`)
            .addField(`${son[son.length - 4].hash_name}`, `Cheapest on market - **${cc[2]} $** | Average - **${aa[2]} $**\nhttps://steamcommunity.com/market/listings/730/${bb[2]}`)
            .addField(`${son[son.length - 3].hash_name}`, `Cheapest on market - **${cc[3]} $** | Average - **${aa[3]} $**\nhttps://steamcommunity.com/market/listings/730/${bb[3]}`)
            .addField(`${son[son.length - 2].hash_name}`, `Cheapest on market - **${cc[4]} $** | Average - **${aa[4]} $**\nhttps://steamcommunity.com/market/listings/730/${bb[4]}`)
            .addField(`${son[son.length - 1].hash_name}`, `Cheapest on market - **${cc[5]} $** | Average - **${aa[5]} $**\nhttps://steamcommunity.com/market/listings/730/${bb[5]}`)
            .setColor("#000000")
            .setTimestamp()
          message.channel.send(Embed).catch((error) => {
            return;
          });
        } else {
          const Embed = new Discord.MessageEmbed()
            .setTitle(`Berserker CSGO Market search `)
            .setThumbnail(`https://community.akamai.steamstatic.com/economy/image/${son[0].asset_description.icon_url}`)
            .addField(`${son[0].hash_name}`, `Cheapest on market - **${cc[0]} $** | Average - **${aa[0]} $**\nhttps://steamcommunity.com/market/listings/730/${bb[0]}`)
          if (son.length == 2 | son.length > 2) {
            Embed.addField(`${son[1].hash_name}`, `Cheapest on market - **${cc[1]} $** | Average - **${aa[1]} $**\nhttps://steamcommunity.com/market/listings/730/${bb[1]}`)
          }
          if (son.length == 3 | son.length > 3) {
            Embed.addField(`${son[2].hash_name}`, `Cheapest on market - **${cc[2]} $** | Average - **${aa[2]} $**\nhttps://steamcommunity.com/market/listings/730/${bb[2]}`)
          }
          if (son.length == 4 | son.length > 4) {
            Embed.addField(`${son[3].hash_name}`, `Cheapest on market - **${cc[3]} $** | Average - **${aa[3]} $**\nhttps://steamcommunity.com/market/listings/730/${bb[3]}`)
          }
          if (son.length == 5 | son.length > 5) {
            Embed.addField(`${son[4].hash_name}`, `Cheapest on market - **${cc[4]} $** | Average - **${aa[4]} $**\nhttps://steamcommunity.com/market/listings/730/${bb[4]}`)
          }
          message.channel.send(Embed).catch((error) => {
            return;
          });
        }

      } else {

        aa = [];
        bb = [];
        cc = [];
        var u = 0;
        const son = await market.search(730, `${traf}`)
        if (!son[0]) {
          return message.channel.send('Nothing found').catch((error) => {
            return;
          });
        }
        var i = son.length - 6;
        if (i < 0) {
          var i = 0;
        }
        while (i < son.length) {
          var sonuu = son[i].sale_price_text.replace(/,/g, "");
          var sonyy = son[i].sell_price_text.replace(/,/g, "");
          var sonuu2 = sonuu.replace("$", "")
          var sonyy2 = sonyy.replace("$", "")
          const lol1 = await konvert('USD', 'TRY', sonuu2)
          const lol2 = await konvert('USD', 'TRY', sonyy2)
          var loool2 = son[i].asset_description.market_hash_name.replace(/\s/g, '%20')
          var loool3 = loool2.replace(/[|]/g, '%7C')
          var loool4 = loool3.concat('/')
          aa[u] = lol1
          bb[u] = loool4
          cc[u] = lol2
          i++;
          u++
        }
        if (son.length == 6 || son.length > 6) {
          const Embed = new Discord.MessageEmbed()
            .setTitle(`Berserker CSGO Market search `)
            .setThumbnail(`https://community.akamai.steamstatic.com/economy/image/${son[son.length - 6].asset_description.icon_url}`)
            .addField(`${son[son.length - 6].name}`, `En ucuz - **${cc[0]} TL** | Ortalama - **${aa[0]} TL**\nhttps://steamcommunity.com/market/listings/730/${bb[0]}`)
            .addField(`${son[son.length - 5].name}`, `En ucuz - **${cc[1]} TL** | Ortalama - **${aa[1]} TL**\nhttps://steamcommunity.com/market/listings/730/${bb[1]}`)
            .addField(`${son[son.length - 4].name}`, `En ucuz - **${cc[2]} TL** | Ortalama - **${aa[2]} TL**\nhttps://steamcommunity.com/market/listings/730/${bb[2]}`)
            .addField(`${son[son.length - 3].name}`, `En ucuz - **${cc[3]} TL** | Ortalama - **${aa[3]} TL**\nhttps://steamcommunity.com/market/listings/730/${bb[3]}`)
            .addField(`${son[son.length - 2].name}`, `En ucuz - **${cc[4]} TL** | Ortalama - **${aa[4]} TL**\nhttps://steamcommunity.com/market/listings/730/${bb[4]}`)
            .addField(`${son[son.length - 1].name}`, `En ucuz - **${cc[5]} TL** | Ortalama - **${aa[5]} TL**\nhttps://steamcommunity.com/market/listings/730/${bb[5]}`)
            .setColor("#000000")
            .setTimestamp()
          message.channel.send(Embed).catch((error) => {
            return;
          });
        } else {
          const Embed = new Discord.MessageEmbed()
            .setTitle(`Berserker CSGO Market search `)
            .setThumbnail(`https://community.akamai.steamstatic.com/economy/image/${son[0].asset_description.icon_url}`)
            .addField(`${son[0].name}`, `En ucuz - **${cc[0]} TL** | Ortalama - **${aa[0]} TL**\nhttps://steamcommunity.com/market/listings/730/${bb[0]}`)
          if (son.length == 2 | son.length > 2) {
            Embed.addField(`${son[1].name}`, `En ucuz - **${cc[1]} TL** | Ortalama - **${aa[1]} TL**\nhttps://steamcommunity.com/market/listings/730/${bb[1]}`)
          }
          if (son.length == 3 | son.length > 3) {
            Embed.addField(`${son[2].name}`, `En ucuz - **${cc[2]} TL** | Ortalama - **${aa[2]} TL**\nhttps://steamcommunity.com/market/listings/730/${bb[2]}`)
          }
          if (son.length == 4 | son.length > 4) {
            Embed.addField(`${son[3].name}`, `En ucuz - **${cc[3]} TL** | Ortalama - **${aa[3]} TL**\nhttps://steamcommunity.com/market/listings/730/${bb[3]}`)
          }
          if (son.length == 5 | son.length > 5) {
            Embed.addField(`${son[4].name}`, `En ucuz - **${cc[4]} TL** | Ortalama - **${aa[4]} TL**\nhttps://steamcommunity.com/market/listings/730/${bb[4]}`)
          }
          message.channel.send(Embed).catch((error) => {
            return;
          });
        }

      }
    }
    async function csgostats(message) {
      control = 1
      check = typeof (args[0])
      if (check == "undefined") {
        return message.channel.send("Give Steam id or profile id to search!").catch((error) => {
          return;
        });
      }
      steamid = args[0]
      let response = await axios.get(
        `https://public-api.tracker.gg/v2/csgo/standard/profile/steam/${steamid}`,
        {
          headers: {
            "TRN-Api-Key": process.env.csgo
          }
        }
      ).catch(function (error) {
        control = 2
        return message.channel.send("Nothing found, make sure the profile is not private and you have entered a valid STEAMID.").catch((error) => {
          return;
        });
      })
      if (control == 2) {
        return;
      }
      let response2 = await axios.get(
        `https://public-api.tracker.gg/v2/csgo/standard/search?platform=steam&query=${steamid}`,
        {
          headers: {
            "TRN-Api-Key": process.env.csgo
          }
        }
      )
      let response3 = await axios.get(
        `https://public-api.tracker.gg/v2/csgo/standard/profile/steam/${steamid}/segments/weapon`,
        {
          headers: {
            "TRN-Api-Key": process.env.csgo
          }
        }
      )
      var dd = [];
      response3.data.data.forEach(data => {
        dd.push(data.stats.kills.value)
      })
      let i = dd.indexOf(Math.max(...dd));
      let response4 = await axios.get(
        `https://public-api.tracker.gg/v2/csgo/standard/profile/steam/${steamid}/segments/map`,
        {
          headers: {
            "TRN-Api-Key": process.env.csgo
          }
        }
      )
      var ll = [];
      response4.data.data.forEach(data => {
        ll.push(data.stats.rounds.value)
      })
      let c = ll.indexOf(Math.max(...ll));
      let thing = new Discord.MessageEmbed()
        .setAuthor("Berserker CSGO stats")
        .setThumbnail(response2.data.data[0].avatarUrl)
        .setTitle(`CSGO stats for ${response2.data.data[0].platformUserHandle}`)
        .setURL(`https://tracker.gg/csgo/profile/steam/${response2.data.data[0].platformUserId}/overview`)
        .addField("**Score**", `${response.data.data.segments[0].stats.score.displayValue} **|** Top ${(100 - response.data.data.segments[0].stats.score.percentile).toFixed(2)} %`, true)
        .addField("**Total Kills**", `${response.data.data.segments[0].stats.kills.displayValue} **|** Top ${(100 - response.data.data.segments[0].stats.kills.percentile).toFixed(2)} %`, true)
        .addField("\u200B", "\u200B", true)
        .addField("**Total Deaths**", `${response.data.data.segments[0].stats.deaths.displayValue} **|** Top ${(100 - response.data.data.segments[0].stats.deaths.percentile).toFixed(2)} %`, true)
        .addField("**K/D**", `${response.data.data.segments[0].stats.kd.displayValue} **|** Top ${(100 - response.data.data.segments[0].stats.kd.percentile).toFixed(2)} %`, true)
        .addField("\u200B", "\u200B", true)
        .addField("**Total Headshots**", `${response.data.data.segments[0].stats.headshots.displayValue} **|** Top ${(100 - response.data.data.segments[0].stats.headshots.percentile).toFixed(2)} %`, true)
        .addField("**Headshot %**", `${response.data.data.segments[0].stats.headshotPct.displayValue} **|** Top ${(100 - response.data.data.segments[0].stats.headshotPct.percentile).toFixed(2)} %`, true)
        .addField("\u200B", "\u200B", true)
        .addField("**Shots Accuracy**", `${response.data.data.segments[0].stats.shotsAccuracy.displayValue} **|** Top ${(100 - response.data.data.segments[0].stats.shotsAccuracy.percentile).toFixed(2)} %`, true)
        .addField("**Bombs Planted**", `${response.data.data.segments[0].stats.bombsPlanted.displayValue} **|** Top ${(100 - response.data.data.segments[0].stats.bombsPlanted.percentile).toFixed(2)} %`, true)
        .addField("\u200B", "\u200B", true)
        .addField("**Bombs Defused**", `${response.data.data.segments[0].stats.bombsDefused.displayValue} **|** Top ${(100 - response.data.data.segments[0].stats.bombsDefused.percentile).toFixed(2)} %`, true)
        .addField("**Total Money Earned**", `${response.data.data.segments[0].stats.moneyEarned.displayValue} **|** Top ${(100 - response.data.data.segments[0].stats.moneyEarned.percentile).toFixed(2)} %`, true)
        .addField("\u200B", "\u200B", true)
        .addField("**Total MVP**", `${response.data.data.segments[0].stats.mvp.displayValue} **|** Top ${(100 - response.data.data.segments[0].stats.mvp.percentile).toFixed(2)} %`, true)
        .addField("**Matches Played**", `${response.data.data.segments[0].stats.matchesPlayed.displayValue} **|** Top ${(100 - response.data.data.segments[0].stats.matchesPlayed.percentile).toFixed(2)} %`, true)
        .addField("\u200B", "\u200B", true)
        .addField("**Total Rounds**", `${response.data.data.segments[0].stats.roundsPlayed.displayValue} **|** Top ${(100 - response.data.data.segments[0].stats.roundsPlayed.percentile).toFixed(2)} %`, true)
        .addField("**Win %**", `${response.data.data.segments[0].stats.wlPercentage.displayValue} **|** Top ${(100 - response.data.data.segments[0].stats.wlPercentage.percentile).toFixed(2)} %`, true)
        .addField("\u200B", "\u200B", true)
        .addField("**Favorite Weapon **", `${response3.data.data[i].metadata.name} **|** Kills ${response3.data.data[i].stats.kills.displayValue} `, true)
        .addField("**Favorite Map **", `${response4.data.data[c].metadata.name} **|** Rounds ${response4.data.data[c].stats.rounds.displayValue} `, true)
        .addField("\u200B", "\u200B", true)
        .addField("**Steam Profile **", `https://steamcommunity.com/profiles/${response2.data.data[0].platformUserId} `)
        .setColor("#000000")
        .setTimestamp();
      return message.channel.send(thing).catch((error) => {
        return;
      });
    }
    function skipto(message, serverQueue7) {
      if (!serverQueue7) {
        message.channel.send('Nothing playing right now!').catch((error) => {
          return;
        });
      } else {
        if (!args.length || isNaN(args[0]))
          return message.channel.send('You have to give number to skip! - Use !playlist for the song list!').catch((error) => {
            return;
          });
        if (args[0] == 1) {
          return message.channel.send("You can't skip to the current song!").catch((error) => {
            return;
          });
        }
        if (args[0] > serverQueue7.songs.length) {
          return message.channel.send("You can't give number bigger than the last playlist songs order!").catch((error) => {
            return;
          });
        }
        serverQueue7.playing = true;
        if (serverQueue7 && serverQueue7.loop == true) {
          serverQueue7.loop = !serverQueue7.loop;
          message.channel.send("Loop is disabled. Song skipped!").catch((error) => {
            return;
          });
        }
        serverQueue7.songs = serverQueue7.songs.slice(args[0] - 2);
        try {
          serverQueue7.connection.dispatcher.end();
        } catch (error) {
          serverQueue7.voiceChannel.leave()
          message.client.queue.delete(message.guild.id);
          return sendError(`:notes: The player has stopped and the queue has been cleared.: ${error}`, message.channel).catch((error) => {
            return;
          });
        }
        message.channel.send(`**${args[0] - 1}** songs skipped! by  ${message.author}`).catch((error) => {
          return;
        });
      }
    }
    async function poll(message) {
      let lao = message.channel.permissionsFor(process.env.botid).has("ADD_REACTIONS", false);
      if (lao == false) {
        return message.channel.send("I can't add reactions! Missing permissions! Check permission and try again").catch((error) => {
          return;
        });
      }
      const addReactions = (message, reactions) => {
        message.react(reactions[0])
        reactions.shift()
        if (reactions.length > 0) {
          setTimeout(() => addReactions(message, reactions), 750)
        }
      }
      const filter = (reaction, user) => {
        return usedEmojis.includes(reaction.emoji.name) && !user.bot
      };
      const embedBuilder = (title, author) => {
        return new Discord.MessageEmbed()
          .setTitle(`Berserker Poll \n\n Poll for **${title}**`)
          .setFooter(`Poll created by ${author}`)
          .setTimestamp();
      }
      const embedBuilder2 = (title, author) => {
        return new Discord.MessageEmbed()
          .setTitle(`Results of Poll **${title}**`)
          .setFooter(`Poll created by ${author}`)
          .setTimestamp();
      }
      options = []
      var i;
      for (i = 1; i < args.length - 1; i++) {
        const args1 = args[i].charAt(0).toUpperCase() + args[i].slice(1)
        options[i - 1] = args1
      }
      abu = Number(args[args.length - 1])
      lul = isNaN(abu)
      if (lul == true) {
        return message.channel.send(`Invalid usage | ${prefix}help for correct usage`).catch((error) => {
          return;
        });
      }
      const defEmojiList = [
        '\u0031\u20E3',
        '\u0032\u20E3',
        '\u0033\u20E3',
        '\u0034\u20E3',
        '\u0035\u20E3',
        '\u0036\u20E3',
        '\u0037\u20E3',
        '\u0038\u20E3',
        '\u0039\u20E3',
        '\uD83D\uDD1F'
      ];
      timeout = args[args.length - 1]
      const options2 = {
        dispose: true,
        time: timeout * 1000
      };
      if (!message && !message.channel) return message.reply('Channel is inaccessible.').catch((error) => {
        return;
      });
      title = args[0]
      emojiList = defEmojiList.slice()
      forceEndPollEmoji = '\u2705'
      if (!title) return message.reply('Poll title is not given.').catch((error) => {
        return;
      });
      if (!options) return message.reply('Poll options are not given.').catch((error) => {
        return;
      });
      if (options.length < 2) return message.reply('Please provide more than one choice.').catch((error) => {
        return;
      });
      if (options.length > emojiList.length) return message.reply(`Please provide ${emojiList.length} or less choices.`).catch((error) => {
        return;
      });
      let text = `To vote, react using the correspoding emojis.\nThe voting will end in **${timeout} seconds**.\nPoll creater can end the poll **forcefully** by reacting to ${forceEndPollEmoji} emoji.\nIf you voted without taking back the emoji your **last vote** will be counted.\n\n`;
      const emojiInfo = {};
      for (const option of options) {
        const emoji = emojiList.splice(0, 1);
        emojiInfo[emoji] = { option: option, votes: 0 };
        text += `${emoji} : \`${option}\`\n\n`;
      }
      const usedEmojis = Object.keys(emojiInfo);
      usedEmojis.push(forceEndPollEmoji);
      ck = 0
      const poll = await message.channel.send(embedBuilder(title, message.author.tag).setDescription(text)).catch((error) => {
        ck = 3
      });
      if (ck == 3) {
        return;
      }
      for (const emoji of usedEmojis) poll.react(emoji).catch((error) => {
      });
      if (ck == 4) {
        message.channel.send("Unable to react to embed. Check Permissions!")
        return;
      }
      const reactionCollector = poll.createReactionCollector(filter, options2);
      const voterInfo = new Map();
      reactionCollector.on('collect', (reaction, user) => {
        if (usedEmojis.includes(reaction.emoji.name)) {
          if (reaction.emoji.name === forceEndPollEmoji && message.author.id === user.id) {
            return reactionCollector.stop();
          }
          if (!voterInfo.has(user.id)) voterInfo.set(user.id, { emoji: reaction.emoji.name });
          const votedEmoji = voterInfo.get(user.id).emoji;
          if (votedEmoji !== reaction.emoji.name && reaction.emoji.name !== forceEndPollEmoji && votedEmoji !== forceEndPollEmoji) {
            emojiInfo[votedEmoji].votes -= 1;
            voterInfo.set(user.id, { emoji: reaction.emoji.name });
          }
          if (reaction.emoji.name === forceEndPollEmoji) {
          } else {
            emojiInfo[reaction.emoji.name].votes += 1;
          }
        }
      });

      reactionCollector.on('remove', (reaction, user) => {
        try {
          const votedEmoji = voterInfo.get(user.id).emoji;

          if (usedEmojis.includes(reaction.emoji.name) && votedEmoji == reaction.emoji.name && reaction.emoji.name !== forceEndPollEmoji) {
            voterInfo.delete(user.id);
            emojiInfo[reaction.emoji.name].votes -= 1;
          }
        } catch (err) {
          return;
        }
      });
      reactionCollector.on('end', () => {
        var i = 0;
        const a = []
        const a2 = []
        const b = []
        const bb = []
        text = '';
        for (const emoji in emojiInfo) {
          text += `**${emojiInfo[emoji].option}** | **${emojiInfo[emoji].votes} vote** \n\n`;
          a[i] = emojiInfo[emoji].option
          b[i] = emojiInfo[emoji].votes
          bb[i] = emojiInfo[emoji].votes
          i = i + 1;
        }
        for (var lul312 = 0; lul312 < b.length; lul312++) {
          if (b.indexOf(b[lul312]) !== b.lastIndexOf(b[lul312])) {
            equal = 1
          }
        }
        equal = 0
        var ip = bb.indexOf(Math.max(...bb))
        bb.splice(ip, 1)
        var ip2 = bb.indexOf(Math.max(...bb))
        if (b[ip] == 0) {
          text += `There is no vote!\n\n`
        } else {
          if (b[ip] == bb[ip2]) {
            text += `Tie no winner. Tie of **${a[ip]}** | **${a[ip2 + 1]}** with **${b[ip]}** votes!\n\n `
          } else {
            text += `The winner is **${a[ip]}** with **${b[ip]}** votes!\n\n`
          }
        }
        //poll.delete();
        message.channel.send(embedBuilder2(title, message.author.tag).setDescription(text)).catch((error) => {
          return;
        });
      });



    }
    function t(message) {
      (async () => {
        deleteAmount = 1
        await message.channel.bulkDelete(deleteAmount, true).catch((error) => {
          return;
        });
      })();
      var dateTime = moment().utcOffset("+03:00").format("DD-MM-YYYY HH:mm")
      if (!args[0]) {
        return message.channel.send(`<-----------------------------------------------------           ${dateTime}            ------------------------------------------------------>`).catch((error) => {
          return;
        });
      } else {
        args2 = args.join(" ")
        const lul = '<---------------------------------------------------------------------------------------------------------------------------------------------->'
        const lull = '<---------------------------------------------------------------------------------------------------------------------------------------------->'
        const c = args2.length
        const d = Math.floor(args2.length / 2)
        const lul2 = lul.slice(0, 61 - d)
        const lul3 = lull.slice(lull.length - 61 + d, lull.length)
        lul4 = lul2 + `           ` + `${args2}` + `           ` + lul3
        if (lul4.length > 142) {
          lul5 = `${lul4.substr(0, 136)}>`
          return message.channel.send(`${lul5}\n<----------------------------------------------------           ${dateTime}            ----------------------------------------------------->`).catch((error) => {
            return;
          });
        } else {
          return message.channel.send(`${lul4}\n<----------------------------------------------------           ${dateTime}            ----------------------------------------------------->`).catch((error) => {
            return;
          });
        }
      }
    }
    async function pause(message, serverQueue8) {
      const ayu = await client.emojis.cache.get("818534544197156946").toString();
      const ayu2 = await client.emojis.cache.get("818536056088690738").toString();
      if (serverQueue8 == undefined) {
        return message.channel.send('Nothing playing right now!').catch((error) => {
          return;
        });
      }

      if (!message.member.voice.channel)
        return message.channel.send("You need to join the voice chat first").catch((error) => {
          return;
        });
      if (serverQueue8 && serverQueue8.playing) {
        serverQueue8.playing = false;
        try {
          await serverQueue8.connection.dispatcher.pause()
        } catch (error) {
          return;
        }
        let xd = new Discord.MessageEmbed()
          .setDescription(`${serverQueue8.songs[0].title}`)
          .setThumbnail(serverQueue8.songs[0].img)
          .setColor("BLACK")
          .setTitle(`${ayu2} Music has been paused!`)
        return message.channel.send(xd).catch((error) => {
          return;
        });
      } else {
        try {
        serverQueue8.playing = true;
        await serverQueue8.connection.dispatcher.resume();
      } catch (error) {
        return;
      }
        let xd = new Discord.MessageEmbed()
          .setDescription(`${serverQueue8.songs[0].title}`)
          .setThumbnail(serverQueue8.songs[0].img)
          .setColor("BLACK")
          .setTitle(`${ayu} Music is resumed!`)
        return message.channel.send(xd).catch((error) => {
          return;
        });
      }
      return message.channel.send("The music is already stopped!").catch((error) => {
        return;
      });
    }
    async function resume(message, serverQueue9) {
      const ayu = await client.emojis.cache.get("818534544197156946").toString();
      if (serverQueue9 == undefined) {
        return message.channel.send('Nothing playing right now!').catch((error) => {
          return;
        });
      }

      if (!message.member.voice.channel)
        return message.channel.send("You need to join the voice chat first").catch((error) => {
          return;
        });
      if (serverQueue9.playing == true) {
        return message.channel.send("Music is already playing!").catch((error) => {
          return;
        });
      }
      try {
      serverQueue9.playing = true;
      await serverQueue9.connection.dispatcher.resume();
    } catch (error) {
      return;
    }
      let xd = new Discord.MessageEmbed()
        .setDescription(`${serverQueue8.songs[0].title}`)
        .setThumbnail(serverQueue8.songs[0].img)
        .setColor("BLACK")
        .setTitle(`${ayu} Music is resumed!`)
       return message.channel.send(xd).catch((error) => {
        return;
      });
      return message.channel.send("The music is already stopped!").catch((error) => {
        return;
      });
    }
    function del(message, serverQueue10) {
      if (serverQueue10 == undefined) {
        return message.channel.send('Nothing playing right now!').catch((error) => {
          return;
        });
      }
      if (!message.member.voice.channel)
        return message.channel.send("You need to join the voice chat first").catch((error) => {
          return;
        });
      if (isNaN(args[0]) && args[0] !== undefined) return message.reply("Please use a number to delete song from queue!").catch((error) => {
        return;
      });
      let thing = new Discord.MessageEmbed()
      const jup3 = serverQueue10.songs.length
      if (!args[0]) {
        if (jup3 == 1) {
          return message.channel.send("You can't delete currently playing song!").catch((error) => {
            return;
          });
        }
        args[0] = jup3
        thing.setTitle("Last Music deleted from queue!")
      } else {
        thing.setTitle("Music deleted from queue!")
      }
      if (args[0] >> jup3) {
        return message.channel.send("Use appropriate number! check the numbers with !playlist !").catch((error) => {
          return;
        });
      }
      if (args[0] == 1) {
        return message.channel.send("You can't delete currently playing song!").catch((error) => {
          return;
        });
      }
      const jup = serverQueue10.songs[args[0] - 1].title
      const jup2 = serverQueue10.songs[args[0] - 1].img
      serverQueue10.songs.splice(args[0] - 1, 1);
      thing.setThumbnail(jup2)
      thing.setDescription(`**${jup}**`)
      thing.setColor("#000000")
      thing.setTimestamp();
      return message.channel.send(thing).catch((error) => {
        return;
      });

    }
    async function setprefix(message) {
      if (!message.member.hasPermission('MANAGE_GUILD')) {
        return message.channel.send('You do not have permission to use this command!').then(m => m.delete({ timeout: 10000 }));
      };
      if (!args[0] || args[0].length > 3) {
        return message.channel.send("Invalid usage! Maximum 3 characters!").catch((error) => {
          return;
        });
      }
      const settings = await Guild.findOne({
        guildID: message.guild.id
      }, (err, guild) => {
        if (err) console.error(err)
        if (!guild) {
          const newGuild = new Guild({
            _id: mongoose.Types.ObjectId(),
            guildID: message.guild.id,
            guildName: message.guild.name,
            prefix: args[0]
          })

          newGuild.save()
            .then()
            .catch(err => console.error(err));
        }
      });
      if (!args[0]) {
        return message.channel.send(`You must specify a prefix to set for this server! Your current server prefix is \`${settings.prefix}\``).then(m => m.delete({ timeout: 10000 }));
      } else {
        try {
          await settings.updateOne({
            prefix: args[0]
          });
        }
        catch (err) {

        }
      }


      return message.channel.send(`Your server prefix has been updated to \`${args[0]}\``).catch((error) => {
        return;
      });


    }
    async function resprefix(message) {
      if (!message.member.hasPermission('MANAGE_GUILD')) {
        return message.channel.send('You do not have permission to use this command!').catch((error) => {
          return;
        });
      };
      await Guild.findOneAndDelete({ guildID: message.guild.id })
      message.channel.send(`The prefix has been reset to !`).catch((error) => {
        return;
      });

    }
    async function botinvite(message) {
      message.channel.send(`Here is  the invite link for **Berserker** \n https://discord.com/oauth2/authorize?client_id=785607160243552348&scope=bot&permissions=271608919`).catch((error) => {
        return;
      });

    }
    async function ban(message) {
      if (message.member.hasPermission("BAN_MEMBERS")) {
        if (message.author == message.mentions.users.first()) {
          return message.reply('You cant ban yourself!').catch((error) => {
            return;
          });
        }
        const user = message.mentions.users.first();
        a = message.author.username;
        bc2 = message.guild;
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + ' ' + time;
        // If we have a user mentioned
        if (user) {
          // Now we get the member from the user
          const member = message.guild.members.resolve(user);
          // If the member is in the guild
          if (member) {
            member
              .ban({
                reason: 'Admin',
              })
              .then(() => {
                member.send(`You are banned from **${bc2}** by **${a}**:Ban time:**${dateTime}**\n https://tenor.com/view/banned-and-you-are-banned-explosion-yoshi-hammer-gif-17493177 `).catch((error) => {
                  return;
                });
                message.channel.send(`**${user.tag}** banned by **${message.author}**.\n https://giphy.com/gifs/ban-banned-salt-bae-Vh2c84FAPVyvvjZJNM`).catch((error) => {
                  return;
                });
              })
              .catch(err => {
                return message.channel.send('I was unable to ban the member').catch((error) => {
                  return;
                });

              });
          } else {
            // The mentioned user isn't in this guild
            message.channel.send("That user isn't in this guild!").catch((error) => {
              return;
            });
          }
        } else {
          // Otherwise, if no user was mentioned
          message.channel.send("You didn't mention the user to ban!").catch((error) => {
            return;
          });
        }
      }
      else {
        message.channel.send("You dont have permission!").catch((error) => {
          return;
        });
      }

    }
    async function kick(message) {
      if (message.member.hasPermission("KICK_MEMBERS")) {
        // Assuming we mention someone in the message, this will return the user
        // Read more about mentions over at https://discord.js.org/#/docs/main/master/class/MessageMentions
        const user = message.mentions.users.first();
        if (message.author == message.mentions.users.first()) {
          return message.reply('You cant kick yourself!').catch((error) => {
            return;
          });
        }
        // If we have a user mentioned
        if (user) {
          // Now we get the member from the user
          const member = message.guild.members.resolve(user);
          // If the member is in the guild
          if (member) {
            /**
             * Kick the member
             * Make sure you run this on a member, not a user!
             * There are big differences between a user and a member
             */
            member
              .kick('Optional reason that will display in the audit logs')
              .then(() => {
                // We let the message author know we were able to kick the person
                message.channel.send(`**${user.tag}** kicked by **${message.author}**.`).catch((error) => {
                  return;
                });
              })
              .catch(err => {
                // An error happened
                // This is generally due to the bot not being able to kick the member,
                // either due to missing permissions or role hierarchy
                message.channel.send('I was unable to kick the member').catch((error) => {
                  return;
                });
                // Log the error
              });
          } else {
            // The mentioned user isn't in this guild
            message.channel.send("That user isn't in this guild!").catch((error) => {
              return;
            });
          }
          // Otherwise, if no user was mentioned
        } else {
          message.channel.send("You didn't mention the user to kick!").catch((error) => {
            return;
          });
        }
      } else {
        message.channel.send("You dont have permission!").catch((error) => {
          return;
        });
      }

    }
    function slowmode(message) {
      let lao = message.channel.permissionsFor(process.env.botid).has("MANAGE_CHANNELS", false);
      if (lao == false) {
        return message.channel.send("Missing permission. Check Berserker's permissions.").catch((error) => {
          return;
        });
      }
      var reminderMsg1 = args[0]
      reminderMsg = reminderMsg1 + " lel"
      if (reminderMsg == "") {
        message.reply(`Type ${prefix}help to learn how set slowmode!`).catch((error) => {
          return;
        });
      } else if (reminderMsg.search(/[0-7]+(s|m|h|d){1}/) >= 0) {
        var time = reminderMsg.substring(0, reminderMsg.search(" ")).toLowerCase();
        var outputMsg = reminderMsg.substring(reminderMsg.search(" ") + 1, reminderMsg.end);
        var actualTime = 0;
        var magnitudes = time.split(/s|d|m|h/).filter(word => word != "");
        var typesOfTime = time.split(/[0-7]+/).filter(word => word != "");
        if ((magnitudes.length == typesOfTime.length) && (-1 == time.search(/a|b|c|e|f|g|i|j|k|l|n|o|p|q|r|t|u|v|w|x|y|z/))) {
          for (i = 0; i < magnitudes.length; i++) {
            switch (typesOfTime[i]) {
              case 's':
                actualTime += magnitudes[i] * 1;
                break;
              case 'm':
                actualTime += magnitudes[i] * 60;
                break;
              case 'h':
                actualTime += magnitudes[i] * 3600;
                break;
              case 'd':
                actualTime += magnitudes[i] * 86400;
                break;
              default:
              // nothing
            }
          }
        } else {
          message.reply('You formatted the time incorrectly it should only have numbers and the letters s, m, h and d and it should look like: \'4d20h30s\' or \'2h30m\' ').catch((error) => {
            return;
          });
        }
      }
      let user = actualTime
      let reason = actualTime
      if (!message.member.hasPermission("MANAGE_CHANNELS") || !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(`You don't have permission to slowmode the channel`).catch((error) => {
        return;
      });
      if (!message.member.hasPermission("MANAGE_CHANNELS") || !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(`You don't have permission to slowmode the channel`).catch((error) => {
        return;
      });
      //if (reason > 21600) return message.channel.send("Slowmode must be lower than 21600 seconds.")
      if (!args[0]) {
        message.channel.setRateLimitPerUser("0").catch((error) => {
          return message.channel.send("Missin permissions, check Berserker's permissions!").catch((error) => {
            return;
          });
        });
        return message.channel.send("Slowmode is removed!").catch((error) => {
          return;
        });
      }
      //if(isNaN(args[0])) return message.channel.send("Slowmode must be the number!")
      if (!actualTime) {
        return message.reply('You formatted the time incorrectly it should only have numbers and the letters s, m, h and it should look like: \'5h20s\' or \'1h30m\' ').catch((error) => {
          return;
        });
      } else {
        if (actualTime < 21600) {
          message.channel.setRateLimitPerUser(actualTime).catch((error) => {
            return message.channel.send("Slowmode must be lower than 6 hours!").catch((error) => {
              return;
            });
          });
          message.reply(`Slowmode of this channel set ${args[0]}!`).catch((error) => {
            return message.reply('You formatted the time incorrectly it should only have numbers and the letters s, m, h and it should look like: \'5h20s\' or \'1h30m\' ').catch((error) => {
              return;
            });
          });
        } else {
          return message.channel.send("Slowmode must be lower than 6 hours!").catch((error) => {
            return;
          });
        }


      }

    }
    async function qrcreate(message) {
      if (!args[0]) return sendError(message, 'You must specify text to become a qrcode', 'Invalid Syntax').catch((error) => {
        return;
      });

      const options = getopts(args, {
        alias: {
          size: 's'
        }
      });

      const res = await axios.get(
        `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
          options['_'].join(' ')
        )}&size=${typeof options.size === 'number' && options.size
          ? `${options.size}x${options.size}`
          : '150x150'}`,
        { responseType: 'stream' }
      );
      return message.channel.send(
        new Discord.MessageEmbed()
          .setColor('BLACK')
          .attachFiles([
            {
              name: 'qrcode.png',
              attachment: streamToBuffer(res.data, function (err, buff) {
                return buff;
              })
            }
          ])
          .setImage('attachment://qrcode.png')
          .setTitle(options['_'].join(' '))
          .setTimestamp()
      );
    }
    async function qrdecode(message) {
      let url = (message.attachments).array()[0]?.url || args[0]?.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g)
      if (!url)
        return sendError(message, 'You must provide a qrcode to decode.', 'Invalid Syntax').catch((error) => {
          return;
        });

      const r = await axios(`https://api.qrserver.com/v1/read-qr-code/?fileurl=${encodeURIComponent(url)}`)
      const embed = new Discord.MessageEmbed().setColor('BLACK').setImage(Array.isArray(url) ? url[0] : url).setTitle(r.data[0].symbol[0].data).setTimestamp().setAuthor("Berserker QrDecode")

      if (r.data[0].symbol[0].error != null) return sendError(message, 'There was an error decoding the qrcode.', 'Error')

      return message.channel.send(embed).catch((error) => {
        return;
      });
    }
    async function mcskin(message) {
      let embed1 = new Discord.MessageEmbed()
        .setTitle('Error!')
        .setDescription(`**Required Arguments** \n \`\`\`-mcuser <username> \`\`\``)
        .setColor('BLACK')
      bbbd = args.join(" ")
      if (!args[0]) return message.channel.send(embed1)
      var separateWord = bbbd.toLowerCase().split(' ');
      for (var i = 0; i < separateWord.length; i++) {
        separateWord[i] = separateWord[i].charAt(0).toUpperCase() +
          separateWord[i].substring(1);
      }
      bbdsr = separateWord.join(' ');
      try {
        let uuid = await mcapi.usernameToUUID(`${args.join(" ")}`)
        let embed = new Discord.MessageEmbed()
          .setAuthor(`Berserker Minecraft Skins`)
          .addField("Name:", `[${bbdsr}](https://namemc.com/profile/${uuid})`, true)
          .addField("Download link", `[Download](https://minotar.net/download/${args.join(" ")})`, true)
          .setImage(`https://minecraftskinstealer.com/api/v1/skin/render/fullbody/${args.join(" ")}/700`)
          .setColor('BLACK')
          .setThumbnail(`https://mc-heads.net/head/${uuid}`)
        message.channel.send(embed).catch((error) => {
          return;
        });
      } catch (e) {
        let embed2 = new Discord.MessageEmbed()
          .setDescription('The specified user was not found!')
        message.channel.send(embed2).catch((error) => {
          return;
        });
      }

    }
    async function levelreg(message) {
      const user = await levels.findOne({
        userID: message.author.id
      }, (err, user) => {
        if (err) console.error(err)
        if (!user) {
          const newUser = new levels({
            userID: message.author.id,
            guildID: "1",
            xp: 0,
            level: 1,
            lastUpdated: new Date(),
            background: "Background",
            priv: "private"
          })

          newUser.save()
            .then()
            .catch(err => console.error(err));
        }
      });
      if (user) {
        return message.channel.send(`User already registered to the database!`).catch((error) => {
          return;
        });
      }
      return message.channel.send("User registered to the database.").catch((error) => {
        return;
      });
    }
    async function level(message) {
      const user = await levels.findOne({ userID: message.author.id, guildID: "1" });
      if (!user) {
        return message.channel.send(`User does not registered to the database. Use **${prefix}levelreg** to register! `).catch((error) => {
          return;
        });
      }
      var users2 = await levels.find({ guildID: "1" }).sort([['xp', 'descending']]).exec();
      kuyl = users2.findIndex(i => i.guildID === "1" && i.userID === message.author.id) + 1
      for (i = 1; i < 100; i++) {
        kca=Math.pow(1.33, i);
        var lvlt=user.xp/(125*kca)
        if (lvlt< 1){
          break;
        } 

      }
      usero1 = user.xp / 800
      const target = message.author
      usero = Math.floor(usero1);
      const reqxp = Math.round(125*kca-user.xp)
      message.channel.send(`> **${target.tag}** is currently level **${i}** with **${user.xp}** xp. **${reqxp}** xp required for level **${i+1}!**.`).catch((error) => {
        return;
      });
      let img = message.author.displayAvatarURL({ dynamic: false, format: 'png' });

      const rank = new canvacord.Rank()
      if (user.background == "Background") {
      } else {
        rank.setBackground("IMAGE", user.background)
      }
      rank.setAvatar(img)
      rank.setCurrentXP(user.xp)
      rank.setRequiredXP(Math.round(125*kca))
      rank.setStatus("online")
      rank.setLevel(i)
      rank.setRank(kuyl)
      rank.setProgressBar("#FFFFFF", "COLOR")
      rank.setUsername(message.author.username)
      rank.setDiscriminator(message.author.discriminator);
      rank.build()
        .then(data => {
          const attachment = new Discord.MessageAttachment(data, "RankCard.png");
          message.channel.send(attachment).catch((error) => {
            return;
          });
        }).catch((error) => {
          message.channel.send(`Background image is not working.Check your link and **${prefix}levelbg** to delete or fix it!`).catch((error) => {
            return;
          });
          return;
          const rank = new canvacord.Rank()
            .setAvatar(img)
            .setCurrentXP(user.xp)
            .setRequiredXP((usero + 2) * 800)
            .setStatus("online")
            .setLevel(usero + 1)
            .setRank(38, "kurwa", false)
            .setProgressBar("#FFFFFF", "COLOR")
            .setUsername(message.author.username)
            .setDiscriminator(message.author.discriminator);
          rank.build()
            .then(data => {
              const attachment = new Discord.MessageAttachment(data, "RankCard.png");
              message.channel.send(attachment).catch((error) => {
                return;
              });
            });
        });
    }
    async function leveldel(message) {
      const user = await levels.findOne({ userID: message.author.id, guildID: "1" });
      if (!user) {
        return message.channel.send(`User does not registered to the database. Use **${prefix}levelreg** to register! `).catch((error) => {
          return;
        });
      } else {
        await levels.findOneAndDelete({ userID: message.author.id, guildID: "1" }).catch(e => console.log(`Failed to delete user: ${e}`));
        return message.channel.send("User deleted from database.").catch((error) => {
          return;
        });
      }
    }
    async function levelbg(message) {
      const user = await levels.findOne({ userID: message.author.id, guildID: "1" });
      if (!user) {
        return message.channel.send(`User does not registered to the database. Use **${prefix}levelreg** to register! `).catch((error) => {
          return;
        });
      } else {
        if (!args[0]) {
          user.background = "Background"
          user.lastUpdated = new Date();
          await user.save().catch(e => console.log(`Failed to append xp: ${e}`));
          return message.channel.send("Background reseted to default!").catch((error) => {
            return;
          });
        } else {
          user.background = args[0]
          user.lastUpdated = new Date();
          await user.save().catch(e => console.log(`Failed to append xp: ${e}`));
          return message.channel.send("Background set!").catch((error) => {
            return;
          });
        }
      }
    }
    async function leaderboard(message) {
      var users = await levels.find({ guildID: "1" }).sort([['xp', 'descending']]).exec();
      kuyl = users.findIndex(i => i.guildID === "1" && i.userID === message.author.id) + 1
      const a = await levels.collection.countDocuments()
      kyl = users.slice(0, 5);
      const computedArray = [];
      fetchUsers = true
      const userup = await levels.findOne({ userID: message.author.id, guildID: "1" });
      if (fetchUsers) {
        for (const key of kyl) {
          for (i = 1; i < 100; i++) {
            kca=Math.pow(1.33, i);
            var lvlt=key.xp/(125*kca)
            if (lvlt< 1){
              break;
            } 
    
          }
          if (key.priv == "private") {
            if (key.userID == message.author.id) {
              const user = await client.users.fetch(key.userID) || { username: "Anonymous", discriminator: "0000" };
              const user2 = user.discriminator + " (Open just for you) "
              computedArray.push({
                guildID: key.guildID,
                userID: key.userID,
                xp: key.xp,
                level: i,
                position: (kyl.findIndex(i => i.guildID === key.guildID && i.userID === key.userID) + 1),
                username: user.username,
                discriminator: user2
              });
            } else {
              const user = { username: "Anonymous", discriminator: "0000" };
              computedArray.push({
                guildID: key.guildID,
                userID: key.userID,
                xp: key.xp,
                level: i,
                position: (kyl.findIndex(i => i.guildID === key.guildID && i.userID === key.userID) + 1),
                username: user.username,
                discriminator: user.discriminator
              });

            }
          } else {
            const user = await client.users.fetch(key.userID) || { username: "Anonymous", discriminator: "0000" };
            computedArray.push({
              guildID: key.guildID,
              userID: key.userID,
              xp: key.xp,
              level: i,
              position: (kyl.findIndex(i => i.guildID === key.guildID && i.userID === key.userID) + 1),
              username: user.username,
              discriminator: user.discriminator
            });
          }


        }
      } else {
        users.map(key => computedArray.push({
          guildID: key.guildID,
          userID: key.userID,
          xp: key.xp,
          level: key.level,
          position: (kyl.findIndex(i => i.guildID === key.guildID && i.userID === key.userID) + 1),
          username: client.users.cache.get(key.userID) ? client.users.cache.get(key.userID).username : "Anonymous",
          discriminator: client.users.cache.get(key.userID) ? client.users.cache.get(key.userID).discriminator : "0000"
        }));
      }
      const lb = computedArray.map(e => `${e.position}. **${e.username}**#**${e.discriminator}**\nLevel: **${e.level}**\nXP: **${e.xp.toLocaleString()}**`); // We map the outputs.
      return message.channel.send(`**Berserker Level System Leaderboard**:\n\nAll profiles hidden due to **Privacy**. **${prefix}levelpr** to open for everbody!\n \n${lb.join("\n\n")}\n \n **${message.author.username}#${message.author.discriminator}** Your Rank is currently **${kuyl}**  among **${a}** users !`).catch((error) => {
        return;
      });
    }
    async function levelpr(message) {
      const user = await levels.findOne({ userID: message.author.id, guildID: "1" });
      if (!user) {
        return message.channel.send(`User does not registered to the database. Use **${prefix}levelreg** to register! `).catch((error) => {
          return;
        });
      } else {
        if (args[0] == "private") {
          user.priv = "private"
          user.lastUpdated = new Date();
          await user.save().catch(e => console.log(`Failed to append xp: ${e}`));
          return message.channel.send("Your profile on the Leaderboard set to the Anonymous").catch((error) => {
            return;
          });
        } else {
          user.priv = "open"
          user.lastUpdated = new Date();
          await user.save().catch(e => console.log(`Failed to append xp: ${e}`));
          return message.channel.send("Privacy setting set to the open for everbody!").catch((error) => {
            return;
          });
        }
      }
    }
    function playnow(message, serverQueue11) {
      if (!serverQueue11) {
        message.channel.send('Nothing playing right now!').catch((error) => {
          return;
        });
      } else {
        if (args[0] && isNaN(args[0]))
          return message.channel.send(`You have to give number to skip! - Use ${prefix}playlist for the song list!`).catch((error) => {
            return;
          });
        if (args[0] == 1) {
          return message.channel.send("You can't skip to the current song!").catch((error) => {
            return;
          });
        }
        if (!args[0]) {
          args[0] = serverQueue11.songs.length
        }
        if (args[0] > serverQueue11.songs.length) {
          return message.channel.send("You can't give number bigger than the last playlist songs order!").catch((error) => {
            return;
          });
        }
        serverQueue11.playing = true;
        depo = serverQueue11.songs.slice(1, args[0] - 1);
        serverQueue11.songs = serverQueue11.songs.slice(args[0] - 2);
        serverQueue11.songs = serverQueue11.songs.concat(depo)
        try {
          serverQueue11.connection.dispatcher.end();
        } catch (error) {
          serverQueue11.voiceChannel.leave()
          message.client.queue.delete(message.guild.id);
          return message.channel.send(`:notes: The player has stopped and the queue has been cleared.: ${error}`, message.channel).catch((error) => {
            return;
          });
        }
        message.channel.send(`**${args[0] - 1}** songs added to the end of the queue.`).catch((error) => {
          return;
        });
      }
    }
    function shuffle(message, serverQueue12) {
      if (!serverQueue12) {
        message.channel.send('Nothing playing right now!').catch((error) => {
          return;
        });
      } else {
        let songs = serverQueue12.songs;
        for (let i = songs.length - 1; i > 1; i--) {
          let j = 1 + Math.floor(Math.random() * i);
          [songs[i], songs[j]] = [songs[j], songs[i]];
        }
        serverQueue12.songs = songs;
        return message.channel.send("Queue shuffled!").catch((error) => {
          return;
        });

      }
    }
    function loop(message, serverQueue13) {
      if (!serverQueue13) {
        return message.channel.send('Nothing playing right now!').catch((error) => {
          return;
        });
      }
      if (!message.member.voice.channel)
        return message.channel.send("You need to join the voice chat first").catch((error) => {
          return;
        });
      serverQueue13.loop = !serverQueue13.loop;
      if (serverQueue13.loop == false) return message.channel.send("Loop is disabled!").catch((error) => {
        return;
      });
      if (serverQueue13.loop == true) return message.channel.send("Loop is enabled!").catch((error) => {
        return;
      });
    }
    function ytogether(message) {
      let channel = message.member.voice.channel;
      if (!channel) return message.channel.send("You have to be in a voice channel to use this command!")
      const creator=`${message.member.user.username}#${message.member.user.discriminator}`
      client.discordTogether.createTogetherCode(message.member.voice.channelID, 'youtube').then(async invite => {
        const e = new Discord.MessageEmbed()
        .setAuthor("Youtube Together Application")
        .setDescription(`You can click and start a Youtube Together Application on Discord! \n[Click Here to start the session](${invite.code})`)
        .setThumbnail("https://www.yazilimara.com/wp-content/uploads/2020/12/Youtube-google-coktu.jpg")
        .addField(`Creator`,creator, true)
        .addField(`Voice Channel`,message.member.voice.channel.name, true)
        .addField(`Text Channel`,message.channel.name, true)
        .setColor("BLACK")
        .setTimestamp()
      message.channel.send(e).catch((error) => {
        return;
      });

    });
    }
    function chess(message) {
      let channel = message.member.voice.channel;
      if (!channel) return message.channel.send("You have to be in a voice channel to use this command!")
      const creator=`${message.member.user.username}#${message.member.user.discriminator}`
      client.discordTogether.createTogetherCode(message.member.voice.channelID, 'chess').then(async invite => {
        const e = new Discord.MessageEmbed()
        .setAuthor("Chess Application")
        .setDescription(`You can click and start a Chess Application on Discord! \n[Click Here to start the session](${invite.code})`)
        .setThumbnail("https://images.chesscomfiles.com/uploads/v1/user/107758976.04f47277.1200x1200o.419048414974.jpeg")
        .addField(`Creator`,creator, true)
        .addField(`Voice Channel`,message.member.voice.channel.name, true)
        .addField(`Text Channel`,message.channel.name, true)
        .setColor("BLACK")
        .setTimestamp()
      message.channel.send(e).catch((error) => {
        return;
      });

    });
    }
    
  }
})
client.once("ready", () => {
  client.user.setActivity("Restart Completed", { type: 'WATCHING' });
  a = 2
  setInterval(() => {
    if (a == 2) {
      lul = (client.guilds.cache.reduce((a, g) => a + g.memberCount, 0))
      lul3 = lul.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      client.user.setActivity(`help | ${lul3} users`, { type: 'LISTENING' });
      a = 1;
    } else {
      lul2 = client.guilds.cache.size
      lul4 = lul2.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      client.user.setActivity(`help | ${lul4} servers`, { type: 'LISTENING' });
      a = 2;

    }
  }, 15000);

});
client.on('message', message => {
  if (message.author.bot) return;
  const argsuu = message.content.trim().split(/ +/g)
  if (argsuu[0].includes("help")) {
  } else {
    return;
  }
  if (!message.guild) return;
  (async () => {
    const prefix = await client.prefix(message)
    aaadqw = `${prefix}help`
    aaadqw2 = `${prefix}prefix`
    if (message.content == 'help' || message.content == aaadqw) {
      const embed = new Discord.MessageEmbed()
        .setAuthor(`Berserker`)
        .setColor('#000000')
        .setThumbnail('https://cdn.discordapp.com/attachments/805093138112315422/806144691770359858/1612270252771.png')
        .setDescription(`Works with **49** different commands`)
        .setTitle(`Prefix on this server is  \`${prefix}\``)
        .addField(`-Prefix \`2 Commands\``, [
          `** ${prefix}setprefix ** Sets custom prefix for this server (max 3 characters)`,
          `** ${prefix}resprefix ** Resets prefix to **!**`,
        ])
        .addField(`-Music \`14 Commands\``, [
          `** ${prefix}play ** [youtube:url] or song name`,
          `** ${prefix}play playlist ** [youtube playlist:url or playlist name]`,
          `** ${prefix}skip:** Skips the current song`,
          `** ${prefix}skipto** [number] skips to given song order! for song order ${prefix}playlist `,
          `** ${prefix}stop** Bot stops playing`,
          `** ${prefix}volume** current volume | [0-100] sets bots volume`,
          `** ${prefix}playlist ** Current playing song and songs on the playlist`,
          `** ${prefix}pause ** pauses the music | if music is paused re-using !pause will resume the music`,
          `** ${prefix}resume ** resumes the music`,
          `** ${prefix}del ** [number] or  last added song - deletes given song of !playlist`,
          `** ${prefix}lyrics ** lyrics of the currently playing song | [song] lyrics for song`,
          `** ${prefix}playnow ** [number] plays the given song without skipping the songs`,
          `** ${prefix}shuffle ** shuffles playlist`,
          `** ${prefix}loop ** plays the currently playing song on the loop`,
          //'\u200b'
        ])
        .addField(`-Bot \`16 Commands\``, [
          `** ${prefix}userinfo:** [@user] or direct command gives information about user`,
          `** ${prefix}serverinfo ** gives information about server`,
          `** ${prefix}ping ** Latency to API`,
          `** ${prefix}uptime** Bots uptime time`,
          `** ${prefix}sug** [message] -direct message to bot owner for possible bug or suggestions`,
          `** ${prefix}remind ** (d,h,m,s) [message] - reminds message after desired time`,
          `** ${prefix}reminders ** Shows current reminders`,
          `** ${prefix}trn ** {code of language like "en" for English } [Translation text] Translates from any language to desired language for languages https://cloud.google.com/translate/docs/languages `,
          `** ${prefix}weather ** [city] weather info of the city `,
          `** ${prefix}invite ** generates invite link for server (create invite perm requried) | [perm] permanent invite link(admin only) `,
          `** ${prefix}botinvite ** invite link to invite **Berserker** to your server `,
          `** ${prefix}poll ** [poll title] [options(a b c)] [time in seconds] opens multiple choice poll `,
          `** ${prefix}qrcreate ** Creating qr code `,
          `** ${prefix}qrdecode ** Decoding qr code `,
          `** ${prefix}ytogether** Creating Youtube Together session on Discord! `,
        ])
        .addField(`-Reddit \`3 Commands\``, [
          `** ${prefix}reddit** [subreddit] - random posts from given subreddit `,
          `** ${prefix}redditus** [user] - random posts from given reddit user `,
          `** ${prefix}reddituser ** [user] - Reddit User information `,
        ])
        .addField(`-Gaming  \`4 Commands\``, [
          `** ${prefix}csgo ** {usd} [item name] market price list on USD `,
          `** ${prefix}csgo ** [item name] market price list on TRY `,
          `** ${prefix}csgostats ** [steamid or profileid] csgo stats of player `,
          `** ${prefix}mcskin ** [mc-nickname] minecraft skins of the player `,
        ])
        .addField(`-Moderation \`4 Commands\``, [
          `** ${prefix}clear ** [amount] clears amount of messages[manage messages perm or Admin only]`,
          `** ${prefix}ban ** [@mentioned] bans user from server[ban perm or admin only]`,
          `** ${prefix}kick ** [@mentioned] kick user from server[kick perm or admin only]`,
          `** ${prefix}slowmode ** time ( like 1h20s) - set slowmode to the channel Re-suing slowmode will be removed [manage channels perm or admin only]`,
        ])
        .addField(`-Level \`6 Commands\``, [
          `**Note: ** Berserker Registering system is not seperate for every server. It is the same for the user for any server! You can gain xp by using bot.`,
          `** ${prefix}levelreg ** Registering user to the database`,
          `** ${prefix}level ** Current level and xp`,
          `** ${prefix}leveldel ** Deleting the user from database`,
          `** ${prefix}levelbg [link] ** Sets custom image background to the level system | ${prefix}levelbg to reset to the default`,
          `** ${prefix}leaderboard ** Leaderboard of the level system`,
          `** ${prefix}levelpr ** [private] - Users leaderboard private settings. Default is Anonymous, you can open it with this command`,
          '\u200b'
        ])
        .setFooter(`Developed by Voltranex#8012`)
        .setTimestamp()
      message.channel.send(embed).catch((error) => {
        return;
      });
    } else if (message.content == 'prefix' || message.content == aaadqw2) {
      return message.channel.send(`Prefix on this server is : \`${prefix}\``)
    }
  })();
});
var reminders = [];

function msToTime(duration) {
  var milliseconds = parseInt((duration % 1000) / 100),
    seconds = parseInt((duration / 1000) % 60),
    minutes = parseInt((duration / (1000 * 60)) % 60),
    hours = parseInt((duration / (1000 * 60 * 60)) % 24);
  days = parseInt((duration / (1000 * 60 * 60 * 24)) % 365);

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  if (days !== 0)
    return days + " days " + hours + ":" + minutes + ":" + seconds + "." + milliseconds;
  else
    return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}
client.on('message', (msg) => {
  const argsuu = msg.content.trim().split(/ +/g)
  if (argsuu[0].includes("remind")
  ) {
  } else {
    return;
  }
  (async () => {
    const prefix = await client.prefix(msg)
    if (!msg.guild) return;
    if (msg.content === `${prefix}reminders`) {
      if (reminders.length === 0) {
        msg.channel.send("There are no reminders for you right now!").catch((error) => {
          return;
        });
      } else {
        var txt = "";
        var list = reminders.forEach(function (value, index, array) {
          var d = new Date();
          if (value.author.id == msg.author.id && value.guildid == msg.guild.id) {
            txt = txt + "-" + value.remindermsg + " (reminding in " + msToTime(value.starttime + value.timetowait - d.getTime()) + ")\n";
          }
        });
        if (!txt) {
          msg.channel.send("There are no reminders for you right now!").catch((error) => {
            return;
          });
        } else {
          msg.channel.send("Here are your reminders in this server! \n" + txt).catch((error) => {
            return;
          });
        }
      }
    }

    if (msg.content.startsWith(`${prefix}remind`)) {
      var reminderMsg = msg.content.substr(8, msg.end);

      if (reminderMsg == "") {
        msg.reply(`Type ${prefix}help to learn how to remind`).catch((error) => {
          return;
        });
      } else if (reminderMsg.search(/[0-9]+(s|m|h|d){1}/) >= 0) {
        var time = reminderMsg.substring(0, reminderMsg.search(" ")).toLowerCase();
        var outputMsg = reminderMsg.substring(reminderMsg.search(" ") + 1, reminderMsg.end);
        var actualTime = 0;

        var magnitudes = time.split(/s|d|m|h/).filter(word => word != "");
        var typesOfTime = time.split(/[0-9]+/).filter(word => word != "");

        if ((magnitudes.length == typesOfTime.length) && (-1 == time.search(/a|b|c|e|f|g|i|j|k|l|n|o|p|q|r|t|u|v|w|x|y|z/))) {
          for (i = 0; i < magnitudes.length; i++) {
            switch (typesOfTime[i]) {
              case 's':
                actualTime += magnitudes[i] * 1000;
                break;
              case 'm':
                actualTime += magnitudes[i] * 60000;
                break;
              case 'h':
                actualTime += magnitudes[i] * 3600000;
                break;
              case 'd':
                actualTime += magnitudes[i] * 86400000;
                break;
              default:
              // nothing
            }
          }

          msg.channel.send(`${msg.author}, your reminder has been set for ` + msToTime(actualTime)).catch((error) => {
            return;
          });
          var d = new Date();
          var reminder = { author: msg.author, remindermsg: outputMsg, starttime: d.getTime(), timetowait: actualTime, guildid: msg.guild.id };
          reminders.push(reminder);
          reminders.sort(function (a, b) { return (a.starttime + a.timetowait) - (b.starttime + b.timetowait) });

          setTimeout(function () {
            ;
            reminders.shift();
            msg.channel.send(`Hey ${msg.author}, This is a reminder to ` + outputMsg, {
              tts: false
            }).catch((error) => {
              return;
            });
          }, actualTime);
        } else {
          msg.reply('You formatted the time incorrectly it should only have numbers and the letters s, m, h and d and it should look like: \'4d20h30s\' or \'2h30m\' ').catch((error) => {
            return;
          });
        }
      }
    }
  })();
});

client.on('message', message => {
  if (message.author.bot) return;
  try {
    user = message.mentions.users.first().id
  } catch (err) {
    return;
  }
  if (user == process.env.botid) {
    (async () => {

      const settings = await Guild.findOne({
        guildID: message.guild.id
      })
      if (!settings) {
        return message.channel.send("There is no customized prefix at this server. Standart prefix is \`!\`")
      } else {
        return message.channel.send(`Prefix is \`${settings.prefix}\` at this server!`)
      }
    })();

  }


});

client.login(process.env.dctoken)
