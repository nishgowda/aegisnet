// Note these files are meant to test aegisnet for koa in development
import koa from "koa";
import { AegisNet } from "..";
import Router from "@koa/router";

const app = new koa();
const router = new Router();
const aegis = new AegisNet();
app.use(aegis.koa());

router.get("/api/koa", (ctx, _) => {
  ctx.body = "Hello world";
});

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(4000, () => "Listening");
