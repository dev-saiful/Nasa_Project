const request = require("supertest");
const app = require("../../app");

describe('Test GET /launches', ()=>{
    test('It should respond with 200 success', async ()=>{
        const response = await request(app)
        .get("/launches")
        .expect("Content-Type", /json/)
        .expect(200);
    });
});

describe('Test POST /launch', ()=>{

    const completeData = {
        mission : "Osaka EER",
        rocket : "SSR Newton-4",
        launchDate : "July 30, 2023",
        target : "osmaka f",
    }
    const launchDataWithoutDate = {
        mission : "Osaka EER",
        rocket : "SSR Newton-4",
        target : "osmaka f",
    }
   
    const launchDataWithInavlidDate = {
        mission : "Osaka EER",
        rocket : "SSR Newton-4",
        launchDate : "datamata",
        target : "osmaka f",
    }


    test('It should respond with 201 created', async ()=>{
        const response = await request(app)
        .post("/launches")
        .send(completeData)
        .expect("Content-Type", /json/)
        .expect(201);

        const requestDate = new Date(completeData.launchDate).valueOf();
        const responseDate = new Date(response.body.launchDate).valueOf();
        expect(responseDate).toBe(requestDate);

       expect(response.body).toMatchObject(launchDataWithoutDate);
    });


    test('It should  catch missing properties', async ()=>{
        const response = await request(app)
        .post("/launches")
        .send(launchDataWithoutDate)
        .expect("Content-Type", /json/)
        .expect(400);

        expect(response.body).toStrictEqual({
            error : "Missing required launch property",
        });
    });

    test('It should catch invalid dates', async ()=>{
        const response = await request(app)
        .post("/launches")
        .send(launchDataWithInavlidDate)
        .expect("Content-Type", /json/)
        .expect(400);

        expect(response.body).toStrictEqual({
            error : "Invalid launch date",
        });
    });
});
