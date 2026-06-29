const Home = require("../models/homeModel");

exports.getAdminHomeList = (req, res, next) => {
  Home.find()
    .then((homes) => {
      res.render("admin/list", {
        title: "Admin Home List",
        currentPage: "admin-home-list",
        homes: homes,
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

exports.addAdminHome = (req, res, next) => {
  const { id, name, location, price, description } = req.body;

  const image = req.file?.path;
  const requestData = { name, location, price, description };

  if (image) requestData.image = image;

  if (id) {
    Home.findByIdAndUpdate(id, requestData)
      .then((result) => console.log("Home updated successfully", result))
      .catch((err) => console.log(err))
      .finally(() => res.redirect("/admin/home-list"));
  } else {
    const home = new Home(requestData);
    home
      .save()
      .then((result) => console.log("Home added successfully", result))
      .catch((err) => console.log(err))
      .finally(() => res.redirect("/admin/home-list"));
  }
};

exports.deleteAdminHome = (req, res, next) => {
  const id = req.params.id;
  Home.findOneAndDelete({ _id: id })
    .then((result) => console.log("Home deleted successfully", result))
    .catch((err) => console.log(err))
    .finally(() => res.redirect("/admin/home-list"));
};
