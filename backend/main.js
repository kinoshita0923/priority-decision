const { WebClient } = require('@slack/web-api');

// (async () => {
//     const token  = 'xoxb-3490140351639-3490190193735-yOQDLl1s5TbiXHmk1ZiaxKs9';
//     const channel = '#sample';
//     const text = 'これはテストです';
//     let date = new Date(2022, 4, 23, 22, 34, 0);
//     let unixTimestamp = Math.floor(date.getTime() / 1000);

//     const client = new WebClient(token);
//     const response = await client.chat.scheduleMessage(
//         {
//             'channel': channel,
//             'text': text,
//             'post_at': unixTimestamp
//         }
//     );

//     console.log(response.ok);
// })();


(async () => {
    const token  = 'xoxb-3490140351639-3490190193735-yOQDLl1s5TbiXHmk1ZiaxKs9';
    const channel = '#sample';
    const scheduled_message_id = ''
    const client = new WebClient(token);
    const response = client.chat.deleteScheduledMessage(
        {
            'channel': channel,
            'scheduled_message_id': 'Q03GCHK4VE2', 
        }
    );
})();