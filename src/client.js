import axios from 'axios';
import { Transform, Writable } from 'stream';

const url = 'http://localhost:3000';

async function consume() {
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    });

    return response.data;
}

const stream = await consume();

const transformer = new Transform({
    // transform não pode ser async
    transform(chunk, encoding, callback) {
        const item = JSON.parse(chunk.toString());
        const itemNumber = /\d+/.exec(item.name)[0];

        callback(null, JSON.stringify({number: itemNumber}));
    }
});

const writer = new Writable({
    write(chunk, encoding, callback) {
        console.log(chunk.toString());
        callback();
    }
});

stream
    .pipe(transformer)
    .pipe(writer);