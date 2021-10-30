// import fetchMock from "jest-fetch-mock";
import { getLocalizer, getTemplateLocalizer } from "../src/Internationalization";
import type { LocalizerFunction, TemplateLocalizerFunction } from "../src/Internationalization";

global.fetch = jest.fn(() =>
  Promise.resolve({
    text: () => Promise.resolve(
`
test.simple=simple translation
test.oneparam=replace %1
test.escaped=\\%1 %1
test.multiparam=%1 %2%3
`
    ),
  }),
) as jest.Mock;

describe("localizer function", () => {
  let localize: LocalizerFunction;

  beforeAll(async () => {
    localize = await getLocalizer("test");
  });

  test("translates simple key", async () => {
      expect(localize("test.simple")).toEqual("simple translation");
  });

  test("replaces single parameter", () => {
    expect(localize("test.oneparam", "me")).toEqual("replace me");
  });

  test("replaces multiple parameters", () => {
    expect(localize("test.multiparam", "Hello", "World", "!")).toEqual("Hello World!");
  });
  
  test("replaces as much as it can left to right", () => {
    expect(localize("test.multiparam", "first")).toEqual("first %2%3");
  });

  test("ignores extra parameters", () => {
    expect(localize("test.multiparam", "Hello", "World", "!", "EXTRA PARAM")).toEqual("Hello World!");
  });

  test("does not replace escaped percents", () => {
    expect(localize("test.escaped", "replaced")).toEqual("\\%1 replaced");
  });
});

describe("template localizer function", () => {
  let tl: TemplateLocalizerFunction;

  beforeAll(async () => {
    tl = await getTemplateLocalizer("test");
  });

  test("translates simple key", async () => {
      expect(tl`test.simple`).toEqual("simple translation");
  });

  test("replaces single parameter", () => {
    const param = "me";
    expect(tl`test.oneparam ${param}`).toEqual("replace me");
  });

  test("replaces multiple parameters", () => {
    const p1 = "Hello";
    const p2 = "World";
    const p3 = "!";
    expect(tl`test.multiparam ${p1} ${p2} ${p3}`).toEqual("Hello World!");
  });

  test("replaces as much as it can left to right", () => {
    const param = "first";
    expect(tl`test.multiparam ${param}`).toEqual("first %2%3");
  });

  test("ignores extra strings and parameters", () => {
    const p1 = "Hello";
    const p2 = "World";
    const p3 = "!";
    const p4 = "extra";
    expect(tl`test.multiparam ${p1} EXTRA ${p2} STRINGS ${p3} BETWEEN PARAMETERS ${p4}`).toEqual("Hello World!");
  });

  test("does not replace escaped percents", () => {
    const param = "replaced";
    expect(tl`test.escaped ${param}`).toEqual("\\%1 replaced");
  });
});
