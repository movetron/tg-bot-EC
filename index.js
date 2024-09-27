require('dotenv').config() //библиотека которая позволяет получать доступ к переменной окружения //config - позволяет получать доступ к переменной которой мы создали и использовать ключ
const {Bot, GrammyError, HttpError, Keyboard, InlineKeyboard, } = require('grammy'); //импортируем классы и сущности
const {hydrate} = require('@grammyjs/hydrate')

const bot = new Bot(process.env.BOT_API_KEY)
bot.use(hydrate())


// bot.on([':media', ':url'], async (ctx) =>{
//     await ctx.reply('Получил ссылку')
// })
// bot.on('.msg').filter((ctx) =>{
//     return ctx.from.id = 12312312
// }, async (ctx) =>{
//     await ctx.reply('Привет админ')
// })
//фильтация по типу сообщения
//:text
//:photo
//:voice
//:entities:url - :особенные сущности:ссылки или ::url
//::mention - упоминание

// bot.on('message: text', async (ctx) =>{
//     await ctx.reply('Надо подумать...')
// })

// shortcuts
//вместо message можно написать msg - заменяет message и channel post
//edit заменяет edided massage и edided channel post
//:media заменяет фото и видео
bot.api.setMyCommands([
    {
        command: 'start',
        description: 'Запуск бота',
    },
    {
        command: 'menu',
        description: 'Получить меню',
    }
    // {
    //     command: 'mode',
    //     description: 'Оценить настроение',
    // },
    // {
    //     command: 'share',
    //     description: 'Поделиться данными',
    // },
    // {
    //     command: 'inline_keyboard',
    //     description: 'Инлайн клавиатура',
    // }
])
// если в setMyCommands написать команду camelCase(sayHello) и это будет в command, то если написать в боте /sayHello?, то будет ошибка - ошибка из за самого телеграмма, а не grammy.
// bot.command(['say_hello', 'hello', 'say_hi'], async (ctx) => {
//     await ctx.reply('Hello')
// })
//библиотека nodemon, которая при сохранении изменений файлов будет автоматически запускать бота

//последовательность
// bot.on('msg', async (ctx) => {
//     await ctx.reply('123')
// })

//если перед командой написать другую команду(message) и написать в боте сообщение start, то сам текст в старте не вызовится(start никогда не  дойдёт до этого обработчика)  
// bot.on('msg', async (ctx) => {
//     await ctx.reply('123')
// })
// bot.on('msg', async (ctx) => {
//     console.log(ctx.msg)//объект сообщения
//     console.log(ctx.from)//информация об отправители сообщения(id, username, язык и т.д.)
//     console.log(ctx.me)//объект информации о самом боте
// })

//tg-spoiler - скрытый текст
bot.command('start', async (ctx) => {
    // await ctx.react('🦄')//реакция на сообщение пользователя
    await ctx.reply('Привет\\! Я бот с терминами и вопросами на экзамен по дисциплине Архитектура ЭВМ\\. Страница в вк\\: [ссылка](https://vk.com/movitihood)', {
    // await ctx.reply('Привет! Я бот с терминами и вопросами на экзамен по дисциплине Архитектура ЭВМ. <span class="tg-spoiler">Страница в вк:</span> <a href="https://vk.com/movitihood">ссылка</a>', {
        reply_parameters: {message_id: ctx.msg.message_id},//бот отвечает именно на сообщение(reply)
        // parse_mode: 'HTML'//форматирование сообщения, расспарсил сообщение
        parse_mode: 'MarkdownV2', //ставим звёздчки по бокам - жирный шрифт, нижнее подчёркивание  по бокам - курсив
        disable_web_page_preview: true//без превью ссылки
    })
    
})
const menuKeyboard = new InlineKeyboard()
    .text('Узнать статус заказа', 'order-status')
    .text('Обратиться в поддержку', 'support')
const backKeyboard = new InlineKeyboard().text('< Назад в меню', 'back')
bot.command('menu', async (ctx) =>{
    await ctx.reply('Выбери пункт меню', {
        reply_markup: menuKeyboard
    })
})
bot.callbackQuery('order-status', async (ctx) =>{
    await ctx.callbackQuery.message.editText('Статус заказа: в пути', {
        reply_markup: backKeyboard
    })
    //или болле длинный варинат
    // await ctx.api.editMessageText(ctx.chat.id, ctx.update.callback_query.message.message_id, 'Статус заказа: в пути', {
    //     reply_markup: backKeyboard
    // })

    await ctx.answerCallbackQuery()//чтобы долго не висела загрузка
})
bot.callbackQuery('support', async (ctx) =>{
    await ctx.callbackQuery.message.editText('Напишите ваш запрос', {
        reply_markup: backKeyboard
    })
    await ctx.answerCallbackQuery()
})
//назад в меню
bot.callbackQuery('back', async (ctx) =>{
    await ctx.callbackQuery.message.editText('Выбери пункт меню', {
        reply_markup: menuKeyboard
    })
    await ctx.answerCallbackQuery()
})
// const heaes = (text) =>{
//     bot.hears(/пинг/i, async(ctx) =>{
//         await ctx.reply(text)
//     })
// } 
//ответ на определённый текст
bot.hears(/пинг/i, async(ctx) =>{
    await ctx.reply('понг')
})
bot.hears('id', async(ctx) =>{
    await ctx.reply(`ваш id: ${ctx.from.id}`)
})
//клавиатура
bot.command('mode', async (ctx) =>{
    // const moodKeyboard = new Keyboard().text('Хорошо').row().text('Норм').row().text('Плохо').resized()//resized() - для того чтобы на телефонах кнопки были по размеру // .oneTime() - клавитура после ответа пропадёт

    //та же клавиатура но из массива строк
    const moodLabels = ['Хорошо', 'Норм', 'Плохо']
    const rows = moodLabels.map((label) =>{
        return[
            Keyboard.text(label)
        ]
    })
    const moodKeyboard2 = Keyboard.from(rows).resized()
    await ctx.reply('Как настроение', {
        reply_markup: moodKeyboard2
    })
})

bot.command('share', async (ctx) =>{
    const shareKeyboard = new Keyboard().requestLocation('Геолокация').requestContact('Контакт').requestPoll('Опрос').placeholder('Укажите данные').resized()
    await ctx.reply('Чем хочешь поделиться?', {
        reply_markup: shareKeyboard
    })
})
bot.command('inline_keyboard', async (ctx) =>{
    // const inlineKeyboard = new InlineKeyboard()//1 - label кнопки(отоброжены для пользователя), button-1 - пользователь не увидет(это нужно разработчику)
    // .text('1', 'button-1')
    // .text('2', 'button-2')
    // .text('3', 'button-3')
   //.row
   const inlineKeyboard2 = new InlineKeyboard().url('перейти по ссылке', 'https://vk.com/movitihood')
    await ctx.reply('Нажмите кнопку', {
        reply_markup: inlineKeyboard2
    })
})
//ответы на выбранные цифры(*1)
// bot.callbackQuery(['button-1', 'button-2', 'button-3'], async (ctx)=>{
//     await ctx.answerCallbackQuery('Вы сделали выбор')//чтобы загрузка быстро проподало 
//     await ctx.reply('Правильный ответ ✅')
// })

//или. На любое нажатие кнопки наш бот будет отвечать единым образом. Однако у этого внутри этого обработчика мы можем получать данные из кнопки, которую нажал пользователь(с)
//Когда нужно обработать много разных вариантов callbackQuery с разными данными. Если мы хотим написать единый обратчик на множ-во кнопок внутри которого мы бедум разделять каким то образом, ТО УДОБНО ИСПОЛЬЗОВАТЬ ЭТОТ МЕТОД(*2)
//Если хотим по отдельносьт реагировать на каждую кнопку или реагировать на группу кнопок, то предыдущей метод будет удобен(*1)

//переписать решение чтобы оно использовало bot.callbackQuery, т.е. чтобы мы нажимали на кнопку и получали ответ и дальше прелоад этой кнопки, то есть callbackQuery.data этой кнопки
// Подсказка: как и bot.hears, так и bot.callbackQuery может принимать первыми аргументов не только строку
//(*2)
// bot.on('callback_query:data', async (ctx) => {
//     await ctx.answerCallbackQuery()//чтобы загрузка быстро проподало 
//     await ctx.reply(`Вы нажали на кнопку ${ctx.callbackQuery.data}`)
// })
bot.callbackQuery(/button-[1-3]/, async (ctx) => {
    await ctx.answerCallbackQuery()//чтобы загрузка быстро проподало 
    await ctx.reply(`Вы нажали на кнопку ${ctx.callbackQuery.data}`)
})
  


bot.on(':contact', async (ctx) =>{
    await ctx.reply('Спасибо за контакт')
})

bot.hears('Хорошо', async(ctx) =>{
    await ctx.reply('Я рад слышать', {
        reply_markup: {remove_keyboard: true}//убираем клавиатуру вручную
    })
})

//встроенный тип клавиатуры


bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}`);
    const e = err.error;

    if (e instanceof GrammyError) {
        console.error("Error in request", e.description);
    } else if (e instanceof HttpError) {
        console.error("Could not contact Telegram", e);
    } else {
        console.error("Unknow error", e);
    }
})
//ответ на команды. bot.command -команда это любая последовательность знаков без пробелов после слэша(/) /help и т.д.
//чтобы обработчик мог на них отвечать нужно добавить ему обработчик command соответствующей команды и передать первыми аргументом строку с названием команды и тут уже без слэша(/), просто start
//второй аргумент это функция callback которая будет вызвана если бот получит такую команду. Callback автоматически принимает объект context(ctx), который мы используем для отправки контента
bot.start();