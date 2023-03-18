import * as request from 'supertest';

describe('AppController (e2e)', () => {
  it('/ (GET)', async () => {
    const result = await request(app.getHttpServer()).get('/').expect(200);
    console.log(result);
    return result.expect('Hello Worlddddsdsdf!');
  });
});
