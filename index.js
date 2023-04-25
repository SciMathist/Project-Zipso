const { Telegraf } = require('telegraf');
const axios = require('axios');

// Set up the RapidAPI OCR API
const rapidapiKey = 'ff8953e2b2mshfbd85d43df50f19p1b0e1bjsn3a980e29ae31';
const rapidapiUrl = 'https://ocr-nanonets.p.rapidapi.com/';

// Create a new Telegraf bot instance
const TELEGRAM_BOT_TOKEN = '5870366018:AAGGCvmKaJ5CD4qC0eQ0psVZpgmD3FmdMyc'
const bot = new Telegraf(TELEGRAM_BOT_TOKEN);

// Register a photo message handler
bot.on('photo', async (ctx) => {
  try {
    // Get the photo file ID from the message
    const fileId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
    // Download the photo using the Telegram Bot API
    const photo = await ctx.telegram.getFile(fileId);
    // Send a message to let the user know the OCR is processing
    await ctx.reply('Recognizing text...');
    // Send the photo to the RapidAPI OCR API for processing
    const headers = {
      'X-RapidAPI-Host': 'ocr-nanonets.p.rapidapi.com',
      'X-RapidAPI-Key':rapidapiKey,
       'content-type': 'application/x-www-form-urlencoded'
    };
    const formData = {
      image: photo.fileLink,
      language: 'eng',
      output: 'text'
    };
    const response = await axios.post(rapidapiUrl, formData, { headers: headers });
    const result = response.data;
    const text = result.data.text;
    ctx.reply(text);
  } catch (err) {
    console.error(err);
    ctx.reply('An error occurred while processing the image.');
  }
});

// Customization....
bot.start((ctx) => {
  // Create a new session for the user
  ctx.session = {};

  // Send a welcome message
  ctx.reply('Welcome to the OCR bot! Please send me a photo to recognize text from.');
});

bot.command('new', (ctx) => {
  // Create a new session for the user
  ctx.session = {};

  // Send a welcome message
  ctx.reply('Welcome to the OCR bot! Please send me a photo to recognize text from.');
});

//checks if the incoming message from the user contains a photo by checking the photo field in the message object.
bot.on('message', (ctx) => {
  if (ctx.message.photo) {
    // Handle the photo
  } else {
    // Ask the user to send a photo
    ctx.reply('Please send me a photo!');
  }
});




// Start the bot
bot.startPolling();
