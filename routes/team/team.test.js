const request = require('supertest');
const app = require('../../app')
const db = require('../../config/database')

// TO RUN TESTS HEALTY, database tables should be cleared. In these tests real database has been used. But the Test database should be used!

describe('TEAM TESTS', () => {

    let token = '';
    beforeAll(async () => {

        await db.sync({ force: true })

        await request(app).post('/auth/signup').send(
            {
                username: 'test',
                password: 'test',
                email: "test",
            }
        );
        await request(app).post('/auth/signup').send(
            {
                username: 'test1',
                password: 'test1',
                email: "test1",
            }
        );
        const response = await request(app).post('/auth/signin').send(
            {
                username: 'test',
                password: 'test'
            }
        );
        token = response.body.token;

    });

    describe('POST /team/create', () => {

        test('createItem should response with 201', async () => {
            const team = {
                "name": "234",
                "description": "description"
            }

            const response = await request(app).post('/team/create').set('Authorization', `Bearer ${token}`).send(team);
            expect(response.status).toBe(201);

        });

        test('getTeamById with existed team should response with 200', async () => {

            const response = await request(app).get('/team/1').set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(200);

        });
    });

    describe('GET /team/:id', () => {

        test('getTeamById with exist team should response with 200', async () => {
            const response = await request(app).get('/team/1').set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(200);
        });

        test('getTeamById with non exist team should response with 404', async () => {
            const response = await request(app).get('/team/999').set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(404);
        });
    });
    describe('POST /team/addMember', () => {

        test('addMember with its creator should response with 201', async () => {
            const subscription = {
                "userId": 2,
                "teamId": 1,
                "role": "member"
            }
            const response = await request(app).post('/team/addMember').set('Authorization', `Bearer ${token}`).send(subscription);
            expect(response.status).toBe(201);

        });

        test('addMember with not exist teamId should response with 404', async () => {
            const subscription = {
                userId: 2,
                teamId: 9999,
                role: "member"
            }
            const response = await request(app).post('/team/addMember').set('Authorization', `Bearer ${token}`).send(subscription);
            expect(response.status).toBe(404);

        });

        test('addMember with not exist userId should response with 404', async () => {
            const subscription = {
                userId: 9999,
                teamId: 1,
                role: "member"
            }
            const response = await request(app).post('/team/addMember').set('Authorization', `Bearer ${token}`).send(subscription);
            expect(response.status).toBe(404);

        });
    });

    describe('GET /team', () => {

        test('team should return all teams that is subscribed by user, should response with 200 and should return an array of object', async () => {
            const remove = {
                "userId": 2,
                "teamId": 1,
            }
            const response = await request(app).get('/team').set('Authorization', `Bearer ${token}`).send(remove);
            expect(response.status).toBe(200);
            expect(typeof response.body).toBe('object');
        });

        test('removing yourself if you are the owner should response with 400', async () => {
            const remove = {
                "userId": 1,
                "teamId": 1,
            }
            const response = await request(app).post('/team/removeMember').set('Authorization', `Bearer ${token}`).send(remove);
            expect(response.status).toBe(400);

        });
    });

    describe('POST /team/removeMember', () => {

        test('removeMember with its creator should response with 200', async () => {
            const remove = {
                "userId": 2,
                "teamId": 1,
            }
            const response = await request(app).post('/team/removeMember').set('Authorization', `Bearer ${token}`).send(remove);
            expect(response.status).toBe(200);
        });

        test('removing yourself if you are the owner should response with 400', async () => {
            const remove = {
                "userId": 1,
                "teamId": 1,
            }
            const response = await request(app).post('/team/removeMember').set('Authorization', `Bearer ${token}`).send(remove);
            expect(response.status).toBe(400);

        });
    });

    describe('POST /team/remove', () => {

        test('removeTeam with its creator should response with 200', async () => {
            const userTeams = await request(app).get('/team').set('Authorization', `Bearer ${token}`);

            const team = {
                teamId: userTeams.body[0].id,
            }
            const response = await request(app).post('/team/remove').set('Authorization', `Bearer ${token}`).send(team);
            expect(response.status).toBe(200);

        });
    });


});