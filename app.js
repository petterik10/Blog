const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const startingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB", {
  useNewUrlParser: true
});


const postSchema = {
  title: String,
  content: String,
  firstName: String,
  lastname: String,
  time: String
};

const Post = mongoose.model("Post", postSchema);
const CulturePosts = mongoose.model("CulturePosts", postSchema);
const SciencePosts = mongoose.model("SciencePosts", postSchema);


app.get("/", function(req, res) {
  res.render("home", {
    startingContent: startingContent,

  });
});

app.get("/compose", function(req, res) {
  res.render("compose");
});

app.post("/compose", function(req, res) {
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  let today = new Date();
  let date = (monthNames[today.getMonth()]) + '-' + today.getDate() + "-" + today.getFullYear();
  let dateTime = date;

  const topic = req.body.topic

  if (topic === "culture") {
    const post = new CulturePosts({
      title: req.body.postTitle,
      content: req.body.postBody,
      firstName: req.body.firstName,
      lastname: req.body.lastName,
      time: dateTime
    });
    post.save(function(err) {
      if (!err) {
        res.redirect("/" + topic);
      }
    });
  } else if (topic === "science") {
    const post = new SciencePosts({
      title: req.body.postTitle,
      content: req.body.postBody,
      firstName: req.body.firstName,
      lastname: req.body.lastName,
      time: dateTime
    });
    post.save(function(err) {
      if (!err) {
        res.redirect("/" + topic);
      }
    });
  } else {
    res.status(404).send("Topic not accepted");
  }
});


app.get("/culture", function(req, res) {
  CulturePosts.find({}, function(err, posts) {
    res.render("culture", {
      posts: posts
    });
  });
});

app.get("/culture/:postId", function(req, res) {
  const requestedPostId = req.params.postId;
  CulturePosts.findOne({
    _id: requestedPostId
  }, function(err, post) {
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });
});

app.get("/science", function(req, res) {
  SciencePosts.find({}, function(err, posts) {
    res.render("science", {
      posts: posts
    });
  });
});

app.get("/science/:postId", function(req, res) {
  const requestedPostId = req.params.postId;
  SciencePosts.findOne({
    _id: requestedPostId
  }, function(err, post) {
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
