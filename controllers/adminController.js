const Home = require("../models/homeModel");
const User = require("../models/userModel");
const fs = require("fs");

exports.getAdminHomeList = (req, res, next) => {
  const user = req.session.user;
  Home.find()
    .then((homes) => {
      const userHomes = homes.filter((home) =>
        user.homes.includes(home._id.toString()),
      );
      res.render("admin/list", {
        title: "Admin Home List",
        currentPage: "admin-home-list",
        homes: userHomes,
        isLoggedIn: req.session.isLoggedIn,
        user: req.session.user,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getAdminAddHome = (req, res, next) => {
  const editId = req.params.id;
  if (editId !== "new") {
    Home.findById(editId)
      .then((home) => {
        console.log(home);
        res.render("admin/add-home", {
          title: "Admin Add Home",
          currentPage: "add-home",
          home: home,
          isLoggedIn: req.session.isLoggedIn,
          user: req.session.user,
        });
      })
      .catch((err) => {
        res.redirect("/admin/home-list");
      });
  } else {
    res.render("admin/add-home", {
      title: "Admin Add Home",
      currentPage: "add-home",
      home: {},
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user,
    });
  }
};

exports.addAdminHome = async (req, res, next) => {
  const reqUser = req.session.user;
  const { id, name, location, price, description } = req.body;

  const image = req.file?.path;
  const requestData = { name, location, price, description };

  if (image) {
    requestData.image = image;
  }
  
  if (id) {
    if (req.body.image && image) fs.unlinkSync(req.body.image);
    await Home.findByIdAndUpdate(id, requestData);
    res.redirect("/admin/home-list");
  } else {
    const home = new Home(requestData);
    const savedHome = await home.save();
    const user = await User.findById(reqUser._id);
    reqUser.homes.push(savedHome._id);
    user.homes.push(savedHome._id);
    await user.save();
    res.redirect("/admin/home-list");
  }
};

exports.deleteAdminHome = async (req, res, next) => {
  const reqUser = req.session.user;
  const id = req.params.id;
  await Home.findOneAndDelete({ _id: id });
  const user = await User.findById(reqUser._id);
  const newHomes = user.homes.filter((homeId) => homeId.toString() !== id);
  user.homes = newHomes;
  await user.save();
  res.redirect("/admin/home-list");
};
