process.env.DB_NAME = "test";

const app = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");
const mongoose = require("mongoose");

chai.should();
chai.use(chaiHttp);

describe("Auth portion of API", () => {
  /**
   * Test SignUp (PUT /auth/signup)
   */
  describe("PUT /auth/signup", () => {
    it("Recieve signup success message", (done) => {
      const cred = {
        email: "test@test.com",
        name: "matt",
        password: "password",
      };
      chai
        .request(app)
        .put("/auth/signup")
        .send(cred)
        .end((err, res) => {
          console.log(res.body);
          res.should.have.status(201);
          res.body.should.have.property("message").eq("Signup successful");
          done();
        });
    });
  });
});
after((done) => {
  // Clear the db and exit the app
  mongoose.connection.db.dropCollection("users").then(() => {
    console.log("db cleared");
    app.serverClose();
    done();
  });
});
