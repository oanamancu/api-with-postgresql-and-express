import supertest from "supertest";
import app from "../../server";


const request = supertest(app);

describe("User Handler", () => {

    let token:string;
    const userId = 3;

    it('create should add a user', async () => {
        const payload = {
            "firstName" : "one",
            "lastName" : "one",
            "password": "one"
        };
        const response = await request.post('/users').send(payload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');
        token = response.body;
        expect(response.status).toBe(201);
    });

    it('index should return a list of users', async () => {
        const response = await request.get('/users')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`);
        expect(response.body.length).toBe(1);
        expect(response.status).toBe(200);
    });

    it('show should return the correct user', async () => {
        const response = await request.get(`/users/${userId}`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body['firstname']).toEqual('one');
        expect(response.body['lastname']).toEqual('one');
        expect(response.body['id']).toEqual(userId);
      });
    
      it('authenticate method should return user if successful', async () => {
        const payload = {
            "firstName" : "one",
            "lastName" : "one",
            "password": "one"
        };
        const response = await request.post(`/users/authenticate/${userId}`).send(payload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');
        expect(response.status).toBe(200);
      });
    
      it('update method should return updated user', async () => {
        const payload = {
            "firstName" : "two",
            "lastName" : "two",
            "password": "two",
            "id": userId
        };

        const response = await request.put(`/users/${userId}`).send(payload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body['firstname']).toEqual('two');
        expect(response.body['lastname']).toEqual('two');
        expect(response.body.id).toBe(userId);
      });
    
      it('delete should remove the user', async () => {
        const response = await request.delete(`/users/${userId}`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        const users = await request.get('/users')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
        expect(users.body.length).toBe(0);
      }); 

})