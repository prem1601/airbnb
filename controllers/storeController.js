const Home = require("../models/homeModel");
const User = require("../models/userModel");

exports.getHome = (req, res, next) => {
  Home.find()
    .then((homes) => {
      res.render("home", {
        title: "Airbnb Home",
        homes: homes,
        currentPage: "home",
        isLoggedIn: req.session.isLoggedIn,
        user: req.session.user,
      });
    })
    .catch((err) => next(err));
};

exports.getHomeList = (req, res, next) => {
  Home.find()
    .then((homes) => {
      res.render("store/list", {
        title: "Store Home List",
        homes: homes,
        currentPage: "home-list",
        isLoggedIn: req.session.isLoggedIn,
        user: req.session.user,
      });
    })
    .catch((err) => next(err));
};

exports.getFavoriteList = (req, res, next) => {
  let homes = [];
  User.findById(req.session.user._id)
    .populate("favourites")
    .then((user) => {
      homes = user.favourites;
    })
    .catch((err) => console.log(err))
    .finally(() => {
      res.render("store/favorite-list", {
        title: "Store Favorite List",
        homes: homes,
        currentPage: "favorite-list",
        isLoggedIn: req.session.isLoggedIn,
        user: req.session.user,
      });
    });
};

exports.getHomeDetails = (req, res, next) => {
  const homeId = req.params.id;
  Home.findById(homeId)
    .then((home) =>
      res.render("store/home-details", {
        title: "Store Home Details",
        home,
        currentPage: "home-list",
        isLoggedIn: req.session.isLoggedIn,
        user: req.session.user,
      }),
    )
    .catch((err) => res.redirect("/home-list"));
};

exports.addToFavorite = (req, res, next) => {
  const homeId = req.params.id;
  User.findById(req.session.user._id)
    .then((user) => {
      user.favourites.push(homeId);
      user.save();
    })
    .catch((err) => console.log(err))
    .finally(() => res.redirect("/favorite-list"));
};

exports.removeFromFavorite = (req, res, next) => {
  const homeId = req.params.id;
  User.findById(req.session.user._id)
    .then((user) => {
      user.favourites = user.favourites.filter(
        (favourite) => favourite.toString() !== homeId,
      );
      user.save();
    })
    .then((result) => console.log("Favourite removed successfully", result))
    .catch((err) => console.log(err))
    .finally(() => res.redirect("/favorite-list"));
};

exports.getBookings = (req, res, next) => {
  res.render("store/bookings", {
    title: "Store Bookings",
    currentPage: "bookings",
    isLoggedIn: req.session.isLoggedIn,
    user: req.session.user,
  });
};
