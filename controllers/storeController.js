const Home = require("../models/homeModel");
const Favourite = require("../models/favouriteModal");

exports.getHome = (req, res, next) => {
  Home.find()
    .then((homes) => {
      res.render("home", {
        title: "Airbnb Home",
        homes: homes,
        currentPage: "home",
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
      });
    })
    .catch((err) => next(err));
};

exports.getFavoriteList = (req, res, next) => {
  let homes = [];
  Favourite.find()
    .populate("homeId")
    .then((favourites) => {
      homes = favourites.map((favourite) => favourite.homeId);
    })
    .catch((err) => console.log(err))
    .finally(() => {
      res.render("store/favorite-list", {
        title: "Store Favorite List",
        homes: homes,
        currentPage: "favorite-list",
      });
    });
};

exports.addToFavorite = (req, res, next) => {
  const homeId = req.params.id;
  const favourite = new Favourite({ homeId });
  favourite
    .save()
    .then((result) => console.log("Favourite added successfully", result))
    .catch((err) => console.log(err))
    .finally(() => res.redirect("/favorite-list"));
};

exports.getHomeDetails = (req, res, next) => {
  const homeId = req.params.id;
  Home.findById(homeId)
    .then((home) =>
      res.render("store/home-details", {
        title: "Store Home Details",
        home,
        currentPage: "home-list",
      }),
    )
    .catch((err) => res.redirect("/home-list"));
};

exports.removeFromFavorite = (req, res, next) => {
  const homeId = req.params.id;
  Favourite.findOneAndDelete({ homeId })
    .then((result) => console.log("Favourite removed successfully", result))
    .catch((err) => console.log(err))
    .finally(() => res.redirect("/favorite-list"));
};

exports.getBookings = (req, res, next) => {
  res.render("store/bookings", {
    title: "Store Bookings",
    currentPage: "bookings",
  });
};
