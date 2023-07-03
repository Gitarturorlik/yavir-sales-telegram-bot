
const TelegramApi = require('node-telegram-bot-api')

const {gameOptions, againOptions } = require('./options')

const token = '6314580960:AAF3YXjINMvjeLkji1NdAro1R2NXGOeSdx8'

const bot = new TelegramApi(token, { polling: true })

const chats = {}



const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Choose number from 0 to 9`)
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Guess number', gameOptions);
}

const start = () => {
    bot.setMyCommands([
        { command: '/start', description: 'First Welcome' },
        { command: '/info', description: 'Get user info' },
        { command: '/game', description: 'Game guess number' },
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/4d6/8ea/4d68eab6-b229-358b-8d46-e5da083d2f40/8.webp')
            return bot.sendMessage(chatId, `Welcome to Yavir Sales bot`);
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Your name ${msg.from.first_name} ${msg.from.username}`);
        }
        if (text === '/game') {
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, 'Incorrect command, try again :)')
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again')
        return startGame(chatId)
        if (data === chats[chatId]) {
            return await bot.sendMessage(chatId, `Congrats, u r guess ${chats[chatId]}`, againOptions)
        } else {
            return await bot.sendMessage(chatId, `Sorry, u r lost, bot guess the number ${chats[chatId]}`, againOptions)
        }
        bot.sendMessage(chatId, `Yor choose is ${data}`)
        console.log(msg)
    })
}

start()