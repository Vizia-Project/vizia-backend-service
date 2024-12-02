const db = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  registerValidation,
  loginValidation,
} = require("../validations/auth_validation");
// const { jwtPayload } = require("../config/auth");

const getUserById = async (user_id) => {
  try {
    return await db.query(`SELECT * FROM users WHERE id=${user_id}`);
  } catch (error) {
    return h
      .response({
        status: "failed",
        message: "Internal server error. Please contact the developer",
      })
      .code(500);
  }
};

const register = async (request, h) => {
  try {
    // Validate & destructuring request payload
    const { name, email, password, password_confirmation } = request.payload;
    const validate = registerValidation(
      name,
      email,
      password,
      password_confirmation
    );

    // Check validation errors possibility
    if (Object.keys(validate).length !== 0) {
      return h
        .response({
          status: "failed",
          message: "Registration input doesn't meet validation",
          validation: validate,
        })
        .code(400);
    }

    // Encrypt plain password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store user credential into database
    const [result] = await db.query(
      "INSERT INTO `users` (`name`, `email`, `password`) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    // Generate jwt for bearer authentication
    // const token = jwt.sign(jwtPayload, process.env.JWT_SECRET);

    // Get and mapping user schema for response
    const user = await getUserById(result.insertId);
    const mappedUser = user[0].map((user) => {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        // photo_url: user.photo_url,
        // token: token,
      };
    });

    return h
      .response({
        status: "success",
        message: "New account creation is success",
        data: mappedUser[0],
      })
      .code(201);
  } catch (error) {
    console.log(error);
    return h
      .response({
        status: "failed",
        message: "Internal server error. Please contact the developer",
      })
      .code(500);
  }
};

const login = async (request, h) => {
  try {
    // Validate & destructuring request payload
    const { email, password } = request.payload;
    const validate = loginValidation(email, password);

    // Check validation errors possibility
    if (Object.keys(validate).length !== 0) {
      return h
        .response({
          status: "failed",
          message: "Login input doesn't meet validation",
          validation: validate,
        })
        .code(400);
    }

    // Check if email is not registered
    const [user] = await db.query("SELECT * FROM `users` WHERE `email`=?", [
      email,
    ]);
    if (user.length === 0) {
      return h
        .response({
          status: "failed",
          message: "Login credentials is not valid",
        })
        .code(422);
    }

    // Check if password is wrong
    const isPasswordValid = await bcrypt.compare(password, user[0].password);
    if (!isPasswordValid) {
      return h
        .response({
          status: "failed",
          message: "Login credentials is not valid",
        })
        .code(422);
    }

    // Generate jwt for bearer authentication
    const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET);

    // Mapping user schema for response
    const mappedUser = user.map((user) => {
      return {
        id: user.id,
        name: user.name,
        token: token,
      };
    });

    return h
      .response({
        status: "success",
        message: "Login and get user are success",
        data: mappedUser[0],
      })
      .code(200);
  } catch (error) {
    console.log(error);
    return h
      .response({
        status: "failed",
        message: "Internal server error. Please contact the developer",
      })
      .code(500);
  }
};

module.exports = { register, login };
