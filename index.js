const { Telegraf } = require('telegraf');
const FormData = require('form-data');
const axios = require('axios');
const keepAlive = require('./keepAlive.js');
const gtts = require('node-gtts')('en');
const path = require('path'); //built-in
const fs = require('fs'); //built-in

const delayTime = 500;

// Create a new Telegraf bot instance
const TELEGRAM_BOT_TOKEN = '5870366018:AAGGCvmKaJ5CD4qC0eQ0psVZpgmD3FmdMyc'
const bot = new Telegraf(TELEGRAM_BOT_TOKEN, {
  session: true,
});

//API endpoint
const API_ENDPOINT = 'https://ocr-nanonets.p.rapidapi.com/';

// start command handler
bot.start((ctx) => {
  // get the user's first name
  const firstName = ctx.from.first_name;

  // greet the user with a message
  ctx.reply(`Hello, ${firstName}! I'm Zipso, an OCR-bot.🍀☘️🍁`);
  setTimeout(() => {
    ctx.reply('Send me a Photo or an Url.....🦖🦕🦚🐸🐲');
  }, delayTime);

});

// listen for the /new command
bot.command('new', (ctx) => {

  // create a new session for the user
  ctx.session = {};

  // send a message to confirm the new session

  ctx.reply('A new session has been created.');
  setTimeout(() => {
    ctx.reply('Send me a Photo or an Url.....🦖🦕🦚🐸🐲');
  }, delayTime);

});


// listen for new users joining the chat
bot.on('new_chat_members', (ctx) => {
  // get the new user's first name
  const firstName = ctx.message.new_chat_member.first_name;

  // send a welcome message to the new user
  ctx.reply(`Welcome, ${firstName}! I'm Zipso, an OCR-bot.🍀☘️🍁`);
});



//handle status command
bot.command('status', (ctx) => {
  ctx.reply('Click on the link to check service uptime status👉 https://scimathistlab.betteruptime.com/');
});


// Register the /speech command handler
bot.command('speech', (ctx) => {
  // Extract the text parameter from the command arguments
  const text = ctx.message.text.substring(8);
  if (!text) {
    return ctx.reply('Please provide some text to speak.');
  }
  
  // Generate speech from the text using node-gtts
  const filePath = path.join(__dirname, 'speech.mp3');
  gtts.save(filePath, text, function(err) {
    if (err) {
      console.log('Error:', err);
      ctx.reply('Something went wrong! 🥲😥🙄');
    } else {
      console.log('Speech saved successfully');
      // Reply with the audio file to the user
      ctx.replyWithAudio({
        source: filePath
      }).then(() => {
        // Delete the file after sending it
        fs.unlinkSync(filePath);
        console.log('File deleted successfully');
      }).catch((err) => {
        console.log('Error:', err);
      });
    }
  });
});

  
// Handle incoming messages  

bot.on('message', async (ctx) => {
  
  // Check if the message contains a photo
if (ctx.message.photo) {  
    const photo = ctx.message.photo[2];
    const fileId = photo.file_id;
   const file = await ctx.telegram.getFile(fileId);
   await ctx.reply('Thank you! The image will be processed now.🦩🦜🦚');
if (!file.file_path) {
  // try again after a short delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  const file = await ctx.telegram.getFile(fileId);
  await ctx.reply('Thank you! The image will be processed now.🦩🦜🦚');
  
  if (!file.file_path) {
    // file path is still undefined, handle the error
    console.error('File path is undefined');
    return;
  }
}
    const fileUrl = `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${file.file_path}`;
    console.log('img-file received:', fileId);
    console.log(fileUrl);

    // Create a FormData object and append the photo to it
    const data = new FormData();
    data.append('urls', fileUrl);

    // Set up options for the API request
    const options = {
      method: 'POST',
      url: API_ENDPOINT,
      headers: {
        'X-RapidAPI-Key': 'ff8953e2b2mshfbd85d43df50f19p1b0e1bjsn3a980e29ae31',
        'X-RapidAPI-Host': 'ocr-nanonets.p.rapidapi.com',
        ...data.getHeaders(),
      },
      data: data
    };

    try {
      // Make the API request and log the response
      const response = await axios.request(options);
      const rawText = response.data.results[0].page_data[0].raw_text;
      await ctx.reply(rawText);
      console.log(response.data);
    } catch (error) {
      console.error(error);
      ctx.reply('Something went wrong!')
    }
  
} else {
  
  if (ctx.message.text.startsWith('http')) {
      const urls = ctx.message.text;
      await ctx.reply('Thank you! The file will be processed now.🦩🦜🦚');
  console.log(urls);

    // Create a FormData object and append the photo to it
    const data = new FormData();
    data.append('urls', urls);

    // Set up options for the API request
    const options = {
      method: 'POST',
      url: API_ENDPOINT,
      headers: {
        'X-RapidAPI-Key': 'ff8953e2b2mshfbd85d43df50f19p1b0e1bjsn3a980e29ae31',
        'X-RapidAPI-Host': 'ocr-nanonets.p.rapidapi.com',
        ...data.getHeaders(),
      },
      data: data
    };

    try {
      // Make the API request and log the response
      const response = await axios.request(options);
      const rawText = response.data.results[0].page_data[0].raw_text;
      await ctx.reply(rawText);
      console.log(response.data);
    } catch (error) {
      console.error(error);
      ctx.reply('Something went wrong!')
    }  
    } else {
      await ctx.reply('Please send me a valid URL or a photo! 🐼🐻🐻‍❄️');
    }
    
  }
});



keepAlive();
// start the bot
bot.startPolling();

