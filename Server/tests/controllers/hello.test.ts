import { createMockContext } from '@shopify/jest-koa-mocks';
import { getHello } from '../../src/controllers/hello';

describe('Hello Controller', () => {
  test('hello controller returns hello', async () => {
    const ctx = createMockContext();
    await getHello(ctx);
    expect(ctx.body).toContain('Hello World');
  });
});
