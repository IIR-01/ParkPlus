const request = require('supertest');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const app = require('../app');
const User = require('../models/User');
const LostChildReport = require('../models/LostChildReport');

const VISITOR = {
  name: 'Test Visitor (23201545)',
  email: 'test.visitor.lostchild.23201545@parkplus.test',
  password: 'TestPass123!',
  role: 'visitor',
};

const STAFF = {
  name: 'Test Staff (23201545)',
  email: 'test.staff.lostchild.23201545@parkplus.test',
  password: 'TestPass123!',
  role: 'staff',
};

const ADMIN = {
  name: 'Test Admin (23201545)',
  email: 'test.admin.lostchild.23201545@parkplus.test',
  password: 'TestPass123!',
  role: 'admin',
};

let visitorToken = '';
let staffToken = '';
let adminToken = '';
let createdReportId = '';

describe('Feature: Lost-Child Alert System (Student ID: 23201545)', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);

    await User.deleteMany({ email: { $in: [VISITOR.email, STAFF.email, ADMIN.email] } });
    await LostChildReport.deleteMany({
      description: { $regex: '^\\[TEST 23201545\\]' },
    });

    await request(app).post('/api/auth/register').send(VISITOR);
    await request(app).post('/api/auth/register').send(STAFF);
    await request(app).post('/api/auth/register').send(ADMIN);

    const visitorLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: VISITOR.email, password: VISITOR.password });
    visitorToken = visitorLogin.body.token;

    const staffLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: STAFF.email, password: STAFF.password });
    staffToken = staffLogin.body.token;

    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: ADMIN.email, password: ADMIN.password });
    adminToken = adminLogin.body.token;
  });

  afterAll(async () => {
    await LostChildReport.deleteMany({
      description: { $regex: '^\\[TEST 23201545\\]' },
    });
    await User.deleteMany({ email: { $in: [VISITOR.email, STAFF.email, ADMIN.email] } });
    await mongoose.connection.close();
  });



  it('Test 1 — should create a new lost-child report (201)', async () => {
    const res = await request(app)
      .post('/api/lostchild/report')
      .set('Authorization', `Bearer ${visitorToken}`)
      .send({
        description: '[TEST 23201545] 6-year-old boy, red shirt',
        lastSeenZone: 'Food Court',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.report).toHaveProperty('_id');
    expect(res.body.report.status).toEqual('open');

    createdReportId = res.body.report._id;
  });

  it('Test 2 — should retrieve the active (open) report list (200)', async () => {
    const res = await request(app)
      .get('/api/lostchild/active')
      .set('Authorization', `Bearer ${staffToken}`);

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);

    const found = res.body.find((r) => r._id === createdReportId);
    expect(found).toBeDefined();
    expect(found.status).toEqual('open');
  });



  it('Test 3 — should return 400 if lastSeenZone is missing (Validation Error)', async () => {
    const res = await request(app)
      .post('/api/lostchild/report')
      .set('Authorization', `Bearer ${visitorToken}`)
      .send({ description: '[TEST 23201545] missing zone field' });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message');
  });

  it('Test 4 — should return 404 when marking a non-existent report as found', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();

    const res = await request(app)
      .patch(`/api/lostchild/${fakeId}/found`)
      .set('Authorization', `Bearer ${staffToken}`);

    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toMatch(/not found/i);
  });



  it('Test 5 — should return 401 Unauthorized with no token', async () => {
    const res = await request(app).get('/api/lostchild/active');
    expect(res.statusCode).toEqual(401);
  });

  it('Test 6 — should return 403 Forbidden when a visitor (wrong role) accesses a staff-only route', async () => {
    const res = await request(app)
      .get('/api/lostchild/active')
      .set('Authorization', `Bearer ${visitorToken}`);

    expect(res.statusCode).toEqual(403);
  });



  it('Test 7 — admin should retrieve the full report history (200)', async () => {
    const res = await request(app)
      .get('/api/lostchild/history')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('Test 8 — should return 403 when staff (non-admin) tries to access history', async () => {
    const res = await request(app)
      .get('/api/lostchild/history')
      .set('Authorization', `Bearer ${staffToken}`);

    expect(res.statusCode).toEqual(403);
  });


  it('Test 9 — should mark the report as found, then block marking it found twice', async () => {
    const firstAttempt = await request(app)
      .patch(`/api/lostchild/${createdReportId}/found`)
      .set('Authorization', `Bearer ${staffToken}`);

    expect(firstAttempt.statusCode).toEqual(200);
    expect(firstAttempt.body.report.status).toEqual('found');

    const secondAttempt = await request(app)
      .patch(`/api/lostchild/${createdReportId}/found`)
      .set('Authorization', `Bearer ${staffToken}`);

    expect(secondAttempt.statusCode).toEqual(400);
    expect(secondAttempt.body.message).toMatch(/already marked as found/i);
  });
});