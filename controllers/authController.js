const User = require("../models/userModel.js");
const { validationResult, check } = require("express-validator");
const bcrypt = require("bcrypt");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    title: "Login",
    currentPage: "login",
    isLoggedIn: false,
    errors: [],
    oldInput: {},
  });
};

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).render("auth/login", {
      title: "Login",
      currentPage: "login",
      isLoggedIn: false,
      errors: ["Invalid email or password"],
      oldInput: req.body,
    });
  }
  req.session.isLoggedIn = true;
  req.session.user = user;

  res.redirect("/");
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};

exports.getRegister = (req, res, next) => {
  res.render("auth/register", {
    title: "Register",
    currentPage: "register",
    isLoggedIn: false,
    errors: [],
    oldInput: {},
  });
};

exports.postRegister = [
  check("firstName")
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: 3 })
    .withMessage("First name must be at least 3 characters long"),
  check("email").isEmail().withMessage("Invalid email"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  check("confirm_password")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Password and Confirm Password do not match"),
  check("role").notEmpty().withMessage("Role is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render("auth/register", {
        title: "Register",
        currentPage: "register",
        isLoggedIn: false,
        errors: errors.array().map((err) => err.msg),
        oldInput: req.body,
      });
    }
    next();
  },
  (req, res, next) => {
    const { firstName, lastName, email, password, role } = req.body;

    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
    });
    user
      .save()
      .then(() => res.redirect("/login"))
      .catch((err) => console.log(err));
  },
];
