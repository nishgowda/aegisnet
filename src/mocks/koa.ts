import koa from 'koa';
import AegisNet from '../index1';
import Router from '@koa/router';

const app = new koa();
const router = new Router();
const aegis = new AegisNet()
app.use(aegis.koa({server: 'koa'}))

  
router.get('/api/koa', (ctx, _) => {
    ctx.body = 'Hello world';
})

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(4000, () => "Listening")