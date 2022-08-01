const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

//load env var
dotenv.config({ path: "./config/config.env" });

//load models
const Course = require("./models/Course");
const User = require("./models/User");
const Review = require("./models/Review");

//Connect to DB

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//Read json
const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/data/courses.json`, "utf-8")
);
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/data/users.json`, "utf-8")
);
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/data/reviews.json`, "utf-8")
);

//Import into DB
const importData = async () => {
  try {
    await Course.create(courses);
    await User.create(users);
    await Review.create(reviews);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

//Delete data from DB
const deleteData = async () => {
  try {
    await Course.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
