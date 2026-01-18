import Elysia, { t } from "elysia";

export const messageModel = new Elysia().model({
  "message.body": t.Object({
    sender: t.String({ maxLength: 100 }),
    text: t.String({ maxLength: 1000 }),
  }),
});
