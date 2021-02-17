const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

let subscribers = {};

const subscribe = (ctx) => {
    return new Promise((resolve) => {
        const id = Math.random();
        subscribers[id] = ctx;
        ctx.res.on("close", function() {
            resolve();
            delete subscribers[id];
        });
    })
}

router.get('/subscribe', async (ctx) => {
    await subscribe(ctx);
});

router.post('/publish', async (ctx) => {

    const message = ctx.request?.body?.message;

    if (message) {
        for (let id in subscribers) {
            subscribers[id].status = 200;
            subscribers[id].res.end(message);
        }
        subscribers = {};
        ctx.status = 200;
        ctx.res.end();
    }
});

app.use(router.routes());

module.exports = app;
