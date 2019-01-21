const request = require('supertest');
const { advanceTo, clear } = require('jest-date-mock');
const app = require('../../../src/app');
const User = require('../../../src/models/user');

const makeRequest = email => (
  request(app)
    .post('/auth/password/lost')
    .send({ email })
);

jest.mock('nodemailer', () => ({
  createTransport: () => ({
    sendMail: jest.fn().mockResolvedValue(),
  }),
}));

describe('POST /auth/password/lost', () => {
  const dateMock = new Date('2018-01-12 00:00:00 UTC');
  const dateNextDay = new Date(+dateMock);
  dateNextDay.setDate(dateMock.getDate() + 1);
  beforeEach(() => {
    advanceTo(dateMock);
  });

  afterEach(clear);

  it('should generate a expired token', async () => {
    await makeRequest('admin@admin.com')
      .expect((res) => {
        expect(res.body).toMatchObject({
          ok: true,
          message: 'Password reset success',
        });
      })
      .expect(200);
    const userObj = await User.query().where('email', 'admin@admin.com').first();
    expect(userObj.resetPasswordToken).toMatch(/^[a-f0-9]{40}$/);
    expect(userObj.resetPasswordExpires).toMatchObject(dateNextDay);
  });
  it('should generate a 404 status if an email is not found', async () => {
    await makeRequest('non_existent@user.com')
      .expect((res) => {
        expect(res.body).toMatchObject({
          ok: false,
          type: 'NotFound',
          message: 'User not found',
        });
      })
      .expect(404);
  });
  it('should generate a 400 status if an email is invalid', async () => {
    await makeRequest('invalid')
      .expect((res) => {
        expect(res.body).toMatchObject(expect.objectContaining({
          ok: false,
          message: 'There are validation errors',
          type: 'BodyValidationError',
        }));
        expect(res.body.errors).toMatchSnapshot('errors');
      })
      .expect(400);
  });
});
