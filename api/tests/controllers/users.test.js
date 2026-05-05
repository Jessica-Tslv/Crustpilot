const request = require("supertest");
const { generateToken } = require("../../lib/token");
const  bcrypt  = require("bcrypt")


const app = require("../../app");
const User = require("../../models/user");

require("../mongodb_helper");

describe("/users", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe("POST, when email and password are provided", () => {
    test("the response code is 201", async () => {
      const response = await request(app)
        .post("/users")
        .send({
          profile: {
            firstName: "Poppy",
            lastName: "Test-User",
          },
          email: "poppy@email.com",
          password: "password1234",
        });

      expect(response.statusCode).toBe(201);
    });

    test("a user is created", async () => {
      await request(app)
        .post("/users")
        .send({
          profile: {
            firstName: "Scar",
            lastName: "Constt",
          },
          email: "scarconstt@email.com",
          password: "password1234",
        });

      const users = await User.find();
      const newUser = users[users.length - 1];
      expect(newUser.email).toEqual("scarconstt@email.com");
    });
  });

  describe("POST, when password is missing", () => {
    test("response code is 400 and response body has error message", async () => {
      const response = await request(app)
        .post("/users")
        .send({ email: "skye@email.com" });

      expect(response.body.message).toEqual("Please provide password");
      expect(response.statusCode).toBe(400);
    });

    test("does not create a user", async () => {
      await request(app).post("/users").send({ email: "skye@email.com" });

      const users = await User.find();
      expect(users.length).toEqual(0);
    });
  });

  describe("POST, when email is missing", () => {
    test("response code is 400 and response body has error message", async () => {
      const response = await request(app)
        .post("/users")
        .send({ password: "1234" });

      expect(response.body.message).toEqual("Please provide email");
      expect(response.statusCode).toBe(400);
    });

    test("does not create a user", async () => {
      await request(app).post("/users").send({ password: "1234" });

      const users = await User.find();
      expect(users.length).toEqual(0);
    });
  });

  //patch - user edits
  describe("PATCH, when user edits email ", () => {

    test("the response code is 200", async () => {

      const user = new User({
      email: "test-user@test.com",
      password: "password1234",
      profile: {
        firstName: "Test",
        lastName: "User",
        bio: 'testbio'
      },
    });
    await user.save();
    const token = generateToken(user._id);
    const response = await request(app)
      .patch(`/users/${user._id}`)
      .set("Authorization", `Bearer ${token}`) // Pass the token here
      .send({
        email: "updated@test.com"
  });
      expect(response.statusCode).toBe(200);
      expect(response.body.user.email).toBe("updated@test.com");
    });
  });
  describe("PATCH, when user edits first name ", () => {

    test("the response code is 200", async () => {

      const user = new User({
      email: "test-user@test.com",
      password: "password1234",
      profile: {
        firstName: "Test",
        lastName: "User",
        bio: 'testbio'
      },
    });
    await user.save();
    const token = generateToken(user._id);
    const response = await request(app)
      .patch(`/users/${user._id}`)
      .set("Authorization", `Bearer ${token}`) // Pass the token here
      .send({ profile: {
        firstName: "Jimmy"}
  });
      expect(response.statusCode).toBe(200);
      expect(response.body.user.profile.firstName).toBe("Jimmy");
    });
  });
  //patch - user password
 describe("PATCH, when user edits password with correct input  ", () => {

    test("the response code is 200", async () => {

      const hashedPassword = await bcrypt.hash("password1234", 10);

      const user = new User({
      email: "test-user@test.com",
      password: hashedPassword,
        profile: {
        firstName: "Test",
        lastName: "User",
        bio: 'testbio'
      },
    });
    await user.save();
    const token = generateToken(user._id);
    const response = await request(app)
      .patch(`/users/pass/${user._id}`)
      .set("Authorization", `Bearer ${token}`) // Pass the token here
      .send({
        new_password: "newPassword",
        current_password: "password1234",
      
        
  });
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Password updated successfully");
      expect(response.body.ok).toBe(true);


      // 4. Verification: Check the DB to see if it actually changed
    const updatedUser = await User.findById(user._id);
    const isNewMatch = await bcrypt.compare("newPassword", updatedUser.password);
    expect(isNewMatch).toBe(true);
    });

    
  });
 describe("PATCH, when user edits password with correct current password but insufficient new password  ", () => {

    test("the response code is 400", async () => {

      const hashedPassword = await bcrypt.hash("password1234", 10);

      const user = new User({
      email: "test-user@test.com",
      password: hashedPassword,
        profile: {
        firstName: "Test",
        lastName: "User",
        bio: 'testbio'
      },
    });
    await user.save();
    const token = generateToken(user._id);
    const response = await request(app)
      .patch(`/users/pass/${user._id}`)
      .set("Authorization", `Bearer ${token}`) // Pass the token here
      .send({
        new_password: "short",
        current_password: "password1234",
      
        
  });
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe("New password is too short (min 8 characters)");
      expect(response.body.ok).not.toBe(true);


      // 4. Verification: Check the DB to see if it is the same
      const UserPostTest = await User.findById(user._id);
      const isStillMatch = await bcrypt.compare("password1234", UserPostTest.password);
      expect(isStillMatch).toBe(true);
    });
    
  });
 describe("PATCH, when user edits password with incorrect current password but a sufficient new password  ", () => {

    test("the response code is 401", async () => {

      const hashedPassword = await bcrypt.hash("password1234", 10);

      const user = new User({
      email: "test-user@test.com",
      password: hashedPassword,
        profile: {
        firstName: "Test",
        lastName: "User",
        bio: 'testbio'
      },
    });
    await user.save();
    const token = generateToken(user._id);
    const response = await request(app)
      .patch(`/users/pass/${user._id}`)
      .set("Authorization", `Bearer ${token}`) // Pass the token here
      .send({
        new_password: "newpassword",
        current_password: "wrongwrongwrong",
      
        
  });
      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe("Current password incorrect");
      expect(response.body.ok).not.toBe(true);


      // 4. Verification: Check the DB to see if it is the same
      const UserPostTest = await User.findById(user._id);
      const isStillMatch = await bcrypt.compare("password1234", UserPostTest.password);
      expect(isStillMatch).toBe(true);
    });
    
  });









});


