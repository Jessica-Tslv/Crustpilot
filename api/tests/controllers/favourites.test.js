const app = require("../../app");
const request = require("supertest");
const bcrypt = require("bcrypt");
require("../mongodb_helper");
const User = require("../../models/user");
const Post = require("../../models/post");

async function getLoginToken() {
  const response = await request(app)
    .post("/tokens")
    .send({ email: "test-user@test.com", password: "password1234" });

  if (response.status !== 201) {
    console.error("Code: ", response.status);
    console.error("Response: ", response.body);
    throw new Error("loginHelper: server did not grant login");
  }

  return response.body.token;
}

const DEFAULT_SALT_ROUNDS = 10;

describe("/favorites", () => {
  beforeEach(async () => {
    const user = new User({
      email: "test-user@test.com",
      password: "password1234",
      profile: {
        firstName: "Test",
        lastName: "User",
        profilePic: "",
      },
    });

    const hashedPassword = await bcrypt.hash(
      user.password,
      DEFAULT_SALT_ROUNDS,
    );
    user.password = hashedPassword;
    await user.save();

    const testRestaurant = await Post.create({
      name: "Test Restaurant",
      message: "This test restaurant was amazing",
      ratings: [{ user: user._id, value: 3 }],
      location: "Planet Urath, York",
      image: "noImageUrlProvided",
      cuisine: "Expresso",
    });

    await User.findByIdAndUpdate(
      { _id: user._id },
      {
        $addToSet: {
          "profile.favouriteRestaurants": { $each: [testRestaurant.id] },
        },
      },
    );
  });

  afterEach(async () => {
    await User.deleteMany({});
    await Post.deleteMany({});
  });

  test("get all favourite restaurants for user", async () => {
    const jwtToken = await getLoginToken();

    const response = await request(app)
      .get("/favourites")
      .set("Authorization", `Bearer ${jwtToken}`);
    const body = response.body;
    const favouritesData = body.data.favouriteRestaurants[0];
    const queryResult = await Post.findOne({ name: "Test Restaurant" }).lean();
    const _id = queryResult._id;

    queryResult.averageRating = 3;
    delete queryResult.ratings;
    delete favouritesData.ratings;
    queryResult._id = _id.toString();

    expect(response.status).toEqual(200);
    console.log("query::", queryResult);
    console.log("resopnse::", favouritesData);
    expect(response.body.message).toEqual("OK");
    expect(favouritesData).toEqual(queryResult);
  });

  test("remove a restaurant from favourites", async () => {
    const jwtToken = await getLoginToken();

    const response = await request(app)
      .get("/favourites")
      .set("Authorization", `Bearer ${jwtToken}`);

    const body = response.body;
    const favouriteRestaurantsData = body.data.favouriteRestaurants[0];
    const restaurantId = favouriteRestaurantsData._id;
    console.log("restId", restaurantId);

    const removeResponse = await request(app)
      .patch(`/favourites/${restaurantId}`)
      .set("Authorization", `Bearer ${jwtToken}`);

    const { ok, message } = removeResponse.body;
    console.log("remove response", removeResponse.body);
    expect(ok);
    expect(message).toContain("Restaurant removed from favourites");
  });
});
