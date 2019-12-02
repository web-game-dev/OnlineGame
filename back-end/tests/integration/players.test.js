const request = require('supertest');
const mongoose = require('mongoose');
const { Player } = require('../../models/player');
const { User } = require('../../models/user');
const config = require('config');
const  tokenDecode = require('../../util/tokenDecode');

process.env.NODE_ENV='test';
let server;

describe('/player', () => {

  beforeEach(() => {
    server = require('../../../index');
  });
  afterEach(async() => {
    await Player.remove({});
    await server.close();
  });

  const player = {
    health: 100,
    exp: 100,
    level: 2,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  const user = {
    name: 'test',
    email: 'test@hotmail.com',
    password: 'password'
  };

  const token = user.generateAuthToken();
  
  const req = {
    session: {
      token: token,
      loggedin: true,
      secret: config.get('sessionSecret'),
      name: user.name,
      email: user.email,
    }
  };

  async function createPlayer(req) {
    const result = await request(server).set('req', req).post('/player/create')
      .catch(err => {
        console.log(err);
      });
    return result.status;
  };

  describe('/player/create', () => {
    it('should return status code 200 if token is valid', async() => {
      const status = await createPlayer(req);
      expect(status).toBe(200);
    });

    it('should return status code 200 if player is invalid', async() => {
      const status = await createPlayer(req);
      expect(status).toBe(200);
    });
  });

  describe('/player/get', () => {
    it('should return status code 200 if player is found in database', async() => {
      await createPlayer(req);
      const result = await request(server).set('req', req).post('/player/get');
      const status = result.status;
      expect(status).toBe(200);
    });
  
    it('should return status code 404 if player is not found in database', async() => {
      await createPlayer(req);
      req.token = 'invalid token';
      const result = await request(server).set('req', req).post('/player/get');
      const status = result.status;
      expect(status).toBe(404);
    });
  });

  describe('/player/update', () => {
    it('should return status code 200 if player has valid field properties', async() => {
      const result = await request(server).set('req', req).post('/player/update').send(player);
      expect(result.status).toBe(200);
    });
  
    it('should return status code 400 if player does not have health property', async() => {
      player.health = '';
      const result = await request(server).set('req', req).post('/player/update').send(player);
      expect(result.status).toBe(400);
    });

    it('should return status code 400 if player does not have exp property', async() => {
      player.exp = '';
      const result = await request(server).set('req', req).post('/player/update').send(player);
      expect(result.status).toBe(400);
    });

    it('should return status code 400 if player does not have level property', async() => {
      player.level = '';
      const result = await request(server).set('req', req).post('/player/update').send(player);
      expect(result.status).toBe(400);
    });

    it('should return status code 400 if player does not have userId property', async() => {
      player.userId = '';
      const result = await request(server).set('req', req).post('/player/update').send(player);
      expect(result.status).toBe(400);
    });

    it('should return status code 404 if player is not found', async() => {
      req.token = 'invalid token'
      const result = await request(server).set('req', req).post('/player/update').send(player);
      expect(result.status).toBe(404);
    });
  });
});