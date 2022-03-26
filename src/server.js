import { createServer } from 'http';
import { Readable } from 'stream';
import { randomUUID } from 'crypto';

function* run() {
    for (let index = 0; index <= 99; index++) {
        const data = {
            id: randomUUID(),
            name: `Item ${index}`
        }

        yield data;
    }
}

async function handler(request, response) {
    const readable = new Readable({
        read() {
            for (const data of run()) {
                console.log('sending', data);
                this.push(JSON.stringify(data) + '\n');
            }

            this.push(null); // indica que terminou o stream
        }
    });

    readable.pipe(response);
}

createServer(handler)
    .listen(3000)
    .on('listening', () => console.log('Listening on port 3000'));