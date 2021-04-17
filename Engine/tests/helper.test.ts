import Helper from "../src/helper";

test("helper does hello world", () => {
    expect(Helper.getGreeting()).toBe("Hello World!");
});
