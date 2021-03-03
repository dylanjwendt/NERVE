import { getHello } from "../../src/controllers/hello";
import { Context } from "koa";

test("test hello", () => {
  expect("hello").toEqual("hello");
});
