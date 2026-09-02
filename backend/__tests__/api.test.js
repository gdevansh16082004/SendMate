const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');
const { User, Accounts } = require('../db');

describe('Authentication API Tests', () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sendmate-test');
  });

  afterAll(async () => {
    // Clean up and close connection
    await User.deleteMany({});
    await Accounts.deleteMany({});
    await mongoose.connection.close();
  });

  afterEach(async () => {
    // Clear data after each test
    await User.deleteMany({});
    await Accounts.deleteMany({});
  });

  describe('POST /api/v1/user/signup', () => {
    it('should create a new user with valid data', async () => {
      const userData = {
        username: 'test@example.com',
        password: 'Test@1234',
        firstName: 'Test',
        lastName: 'User'
      };

      const response = await request(app)
        .post('/api/v1/user/signup')
        .send(userData)
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('message', 'Signup successful');
    });

    it('should reject signup with weak password', async () => {
      const userData = {
        username: 'test@example.com',
        password: 'weak',
        firstName: 'Test',
        lastName: 'User'
      };

      const response = await request(app)
        .post('/api/v1/user/signup')
        .send(userData)
        .expect(411);

      expect(response.body).toHaveProperty('message');
    });

    it('should reject duplicate username', async () => {
      const userData = {
        username: 'duplicate@example.com',
        password: 'Test@1234',
        firstName: 'Test',
        lastName: 'User'
      };

      // First signup
      await request(app)
        .post('/api/v1/user/signup')
        .send(userData)
        .expect(200);

      // Duplicate signup
      const response = await request(app)
        .post('/api/v1/user/signup')
        .send(userData)
        .expect(411);

      expect(response.body.message).toContain('Email already taken');
    });

    it('should reject invalid email format', async () => {
      const userData = {
        username: 'not-an-email',
        password: 'Test@1234',
        firstName: 'Test',
        lastName: 'User'
      };

      const response = await request(app)
        .post('/api/v1/user/signup')
        .send(userData)
        .expect(411);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/v1/user/signin', () => {
    beforeEach(async () => {
      // Create a test user
      await request(app)
        .post('/api/v1/user/signup')
        .send({
          username: 'signin@example.com',
          password: 'Test@1234',
          firstName: 'Signin',
          lastName: 'Test'
        });
    });

    it('should sign in with correct credentials', async () => {
      const response = await request(app)
        .post('/api/v1/user/signin')
        .send({
          username: 'signin@example.com',
          password: 'Test@1234'
        })
        .expect(200);

      expect(response.body).toHaveProperty('token');
    });

    it('should reject signin with wrong password', async () => {
      const response = await request(app)
        .post('/api/v1/user/signin')
        .send({
          username: 'signin@example.com',
          password: 'WrongPass@123'
        })
        .expect(411);

      expect(response.body.message).toContain('Error while logging in');
    });

    it('should reject signin with non-existent user', async () => {
      const response = await request(app)
        .post('/api/v1/user/signin')
        .send({
          username: 'nonexistent@example.com',
          password: 'Test@1234'
        })
        .expect(411);

      expect(response.body.message).toContain('Error while logging in');
    });
  });

  describe('GET /api/v1/user/me', () => {
    let token;

    beforeEach(async () => {
      // Create user and get token
      const response = await request(app)
        .post('/api/v1/user/signup')
        .send({
          username: 'me@example.com',
          password: 'Test@1234',
          firstName: 'Me',
          lastName: 'Test'
        });
      token = response.body.token;
    });

    it('should return user info with valid token', async () => {
      const response = await request(app)
        .get('/api/v1/user/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.user).toHaveProperty('username', 'me@example.com');
      expect(response.body.user).toHaveProperty('firstName', 'Me');
      expect(response.body.user).toHaveProperty('balance');
    });

    it('should reject request without token', async () => {
      await request(app)
        .get('/api/v1/user/me')
        .expect(403);
    });

    it('should reject request with invalid token', async () => {
      await request(app)
        .get('/api/v1/user/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(403);
    });
  });
});

describe('Account API Tests', () => {
  let token;
  let userId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sendmate-test');

    // Create test user
    const response = await request(app)
      .post('/api/v1/user/signup')
      .send({
        username: 'account@example.com',
        password: 'Test@1234',
        firstName: 'Account',
        lastName: 'Test'
      });

    token = response.body.token;
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Accounts.deleteMany({});
    await mongoose.connection.close();
  });

  describe('GET /api/v1/account/balance', () => {
    it('should return account balance', async () => {
      const response = await request(app)
        .get('/api/v1/account/balance')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('balance');
      expect(typeof response.body.balance).toBe('number');
    });

    it('should reject without authentication', async () => {
      await request(app)
        .get('/api/v1/account/balance')
        .expect(403);
    });
  });
});
