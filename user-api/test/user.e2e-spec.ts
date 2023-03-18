import * as request from 'supertest';

describe('User', () => {
  const url = 'http://localhost:3000/api/';

  let result = {};

  it(`POST /api/users On the request store the user entry in db. After the creation, send an email and rabbit event. Both can be dummy sending (no consumer needed).`, () => {
    return request(url)
      .post('users')
      .type('multipart/form-data')
      .field('name', 'some name')
      .field('email', 'some@gmail.com')
      .attach('avatar', 'images/my-pcture.jpg')
      .expect(201)
      .then((res) => {
        result = res.body;
      });
  });

  it(`GET /api/user/{userId} Retrieves data from api/users/{userId} and returns a user in JSON representation.`, () => {
    return request(url)
      .get(`user/${result['_id']}`)
      .expect(200)
      .expect(result)
      .timeout(1000)
      .then((res) => {
        console.log(res.body);
      });
  });

  it(`GET /api/user/{avatar}/avatar Retrives data by avatar`, () => {
    return request(url)
      .get(`user/${result['avatar']}/avatar`)
      .expect(200)
      .timeout(1000)
      .then((res) => {
        console.log(res.body);
      });
  });

  it(`GET /api/user/{avatarHash}/avatar Retrives data by avatarHash`, () => {
    return request(url)
      .get(`user/${result['avatarHash']}/avatar`)
      .expect(200)
      .timeout(1000)
      .then((res) => {
        console.log(res.body);
      });
  });

  it(`DELETE /api/user/{userId}/avatar Removes the file from the FileSystem storage. Removes the stored entry from db.
  `, () => {
    return request(url)
      .delete(`user/${result['_id']}`)
      .expect(200)
      .timeout(1000)
      .then((res) => {
        console.log(res.body);
      });
  });
});
