const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");

dotenv.config();
const User = require("./models/user");
const Post = require("./models/post");

async function favouriteRestaurantForUser(userId, postIds) {
  if (!Array.isArray(postIds)) {
    throw new Error(
      `Expected array of postIds, got ${typeof postIds}`
    );
  }

  if (postIds.length == 0) {
    console.log("Received empty array of postIds");
    return;
  }

  await User.findByIdAndUpdate(
    { _id: userId },
    { $addToSet: { "profile.favouriteRestaurants": { $each: postIds } } },
    { new: true },
  );
}

function generateRatings(userIds, bias = "normal") {
  const count = Math.floor(Math.random() * 11) + 20;
  const ratings = [];

  function getRatingValue() {
    if (bias === "high") {
      return Math.random() < 0.7
        ? Math.floor(Math.random() * 2) + 4
        : Math.floor(Math.random() * 3) + 1;
    }

    if (bias === "low") {
      return Math.random() < 0.7
        ? Math.floor(Math.random() * 2) + 1
        : Math.floor(Math.random() * 3) + 3;
    }

    return Math.floor(Math.random() * 5) + 1;
  }

  for (let i = 0; i < count; i++) {
    const randomUser = userIds[Math.floor(Math.random() * userIds.length)];

    ratings.push({
      user: randomUser,
      value: getRatingValue(),
    });
  }

  return ratings;
}

function buildPosts(userIds) {
  const basePosts = [
    ["Dishoom", "Incredible Bombay-style breakfast and chai.", "Indian", "Covent Garden, London", "https://images.unsplash.com/photo-1555396273-367ea4eb4db5"],
    ["Flat Iron", "Simple steakhouse, excellent beef.", "American", "Soho, London", "https://images.unsplash.com/photo-1600891964599-f61ba0e24092"],
    ["Padella", "Best pasta in London.", "Italian", "Borough Market, London", "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/12/ef/f8/b4/morning-buzz.jpg?w=900&h=500&s=1"],
    ["Nando’s", "Classic peri-peri chicken.", "Carribean", "Croydon, London", "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d"],
    ["Burger & Lobster", "Premium burgers and lobster.", "American", "Mayfair, London", "https://images.unsplash.com/photo-1550547660-d9450f859349"],
    ["Wagamama", "Fresh ramen and noodles.", "Japanese", "London Bridge", "https://images.unsplash.com/photo-1585032226651-759b368d7246"],
    ["Five Guys", "Loaded burgers and fries.", "American", "Oxford Circus", "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0c/b8/b6/49/photo0jpg.jpg?w=700&h=400&s=1"],
    ["Pizza Pilgrims", "Neapolitan pizza done right.", "Italian", "Soho", "https://www.datocms-assets.com/94903/1677591087-brighton_pizzaeating_pizzapilgrims-02.jpg?auto=format&w=1200"],
    ["The Ivy", "Upscale British dining.", "British", "Central London", "https://images.unsplash.com/photo-1414235077428-338989a2e8c0"],
    ["Honest Burgers", "Great burgers and rosemary fries.", "American", "Camden", "https://images.unsplash.com/photo-1550547660-d9450f859349"],
    ["Rosa’s Thai", "Authentic Thai food.", "Thai", "Soho", "https://yorkshirefoodguide.co.uk/app/uploads/2019/04/Rosas-3.jpg"],
    ["Shake Shack", "Famous shakes and burgers.", "American", "Covent Garden", "https://shakeshack.com/sites/default/files/styles/locations_mobile/public/location-about-02.jpg?itok=E6VOpWRc"],
    ["Franco Manca", "Sourdough pizza heaven.", "Italian", "Various London", "https://www.francomanca.co.uk/wp-content/uploads/2023/06/A7405234.jpg"],
    ["Dishoom Shoreditch", "Even better vibes at night.", "Indian", "Shoreditch", "https://images.unsplash.com/photo-1555396273-367ea4eb4db5"],
    ["Bao", "Taiwanese buns and street food.", "Asian", "Soho", "https://images.unsplash.com/photo-1553621042-f6e147245754"],
    ["Duck & Waffle", "Sky-high dining experience.", "British", "Liverpool Street", "https://images.unsplash.com/photo-1414235077428-338989a2e8c0"],
    ["Hoppers", "Sri Lankan flavours.", "Asian", "Soho", "https://images.unsplash.com/photo-1553621042-f6e147245754"],
    ["Gordon Ramsay Steak", "Luxury steakhouse.", "British", "Chelsea", "https://www.foodandwine.com/thmb/-LdOm9c7EL_eBOQSw2mQXU2W4Gc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Gordon-Ramsay-Tips-For-Cooking-Steak-FT-BLOG0125-bdf5c49699394a4fb0426ee6f38214f4.jpg"],
    ["Taco Bell", "Fast Mexican food.", "Mexican", "London", "https://www.allrecipes.com/thmb/5vfVjThzZsweDidPCuRLZLVTut4=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/ar-taste-test-taco-bell-unique-1-4x3-94016192e88a428f925c209fe29081a3.jpg"],
    ["Chipotle", "Custom burritos and bowls.", "Mexican", "London", "https://www.foodandwine.com/thmb/QXDYxMEv6QhCAdShwdQ1HssBZ8w=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/chipotle-chicken-tacos-FT-RECIPE0625-a0700230d0c249d8b62306ae2033f850.jpeg"],
  ];

  return basePosts.map(([name, message, cuisine, location, image]) => {
    const randomAuthor = userIds[Math.floor(Math.random() * userIds.length)];

    let bias = "normal";

    if (
      name.toLowerCase().includes("ivy") ||
      name.toLowerCase().includes("wagamama") ||
      name.toLowerCase().includes("dishoom") ||
      name.toLowerCase().includes("padella")
    ) {
      bias = "high";
    }

    if (name.toLowerCase().includes("taco bell")) {
      bias = "low";
    }

    return {
      name,
      message,
      cuisine,
      location,
      image,
      author: randomAuthor,
      ratings: generateRatings(userIds, bias),
    };
  });
}

async function createUser(firstName, lastName, email, password) {
  if (!email.includes("@")) {
    throw new Error("Email must contain '@'");
  }

  if (!password || password.trim().length === 0) {
    throw new Error("Password required for " + email);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return await User.create({
    email,
    password: hashedPassword,
    profile: {
      firstName,
      lastName,
    },
  });
}

async function seedPostData(userIds) {
  try {
    await Post.deleteMany({});
    console.log("Old posts cleared");

    const posts = buildPosts(userIds);
    const inserted = await Post.insertMany(posts);

    return inserted.map((p) => p._id);
  } catch (err) {
    console.error("Seeding error:", err);
  }
}

async function seedDatabase(test_db) {
  let db_connection = test_db
    ? process.env.MONGODB_TEST_URL
    : process.env.MONGODB_URL;

  if (!db_connection) {
    throw new Error("Database connection string missing");
  }

  await mongoose.connect(db_connection);

  await User.deleteMany({});

  const user_1 = await createUser("Dario", "Walter", "dario@gmail.com", "password1234");
  const user_2 = await createUser("Bill", "Evans", "bill@gmail.com", "password1234");
  const user_3 = await createUser("Florida", "Nadia", "nadia@gmail.com", "password1234");
  const user_4 = await createUser("Jeremy", "Wills", "jeremey@gmail.com", "password1234");
  const user_5 = await createUser("Test", "User", "testuser@gmail.com", "password1234");

  const users = [user_1, user_2, user_3, user_4, user_5];
  const userIds = users.map((u) => u._id);

  console.log("Users created");

  const restaurantIds = await seedPostData(userIds);

  await favouriteRestaurantForUser(user_1._id, restaurantIds);
  await favouriteRestaurantForUser(user_2._id, [restaurantIds[0], restaurantIds[1]]);
  await favouriteRestaurantForUser(user_3._id, [restaurantIds[2]]);
  await favouriteRestaurantForUser(user_4._id, [restaurantIds[3]]);
  await favouriteRestaurantForUser(user_5._id, [restaurantIds[4]]);

  console.log("Favourites added");

  await mongoose.connection.close();
}

if (require.main === module) {
  seedDatabase(false).then(() => {
    console.log("Seed successful");
  });
}

module.exports = seedDatabase;