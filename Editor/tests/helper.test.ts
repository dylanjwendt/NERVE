import { Helper } from '../src/helper'
const helper = new Helper()

test('helper does hello world', () => {
  expect(helper.getGreeting()).toBe('Hello World!')
})
