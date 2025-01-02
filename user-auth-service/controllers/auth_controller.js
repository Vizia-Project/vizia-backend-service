const dbFirestore = require("../config/firestore");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const {
  registerValidation,
  loginValidation,
} = require("../validations/auth_validation");

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

    // Check is email is registered
    const usersRef = dbFirestore.collection("users");
    const docRes = await usersRef.where('email', '==', email).get();
    if (docRes.docs.length !== 0) {
      return h
        .response({
          status: "failed",
          message: "Your email is already registered",
        })
        .code(409);
    }

    // Encrypt plain password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store user credential into database
    const id = crypto.randomUUID();
    await usersRef.doc().set({
      id,
      name,
      email,
      password: hashedPassword,
      photo_url: null,
    });

    // Get and mapping created user for response
    const createdUser = { id, name, email };

    return h
      .response({
        status: "success",
        message: "New account creation is success",
        data: createdUser,
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
    const usersRef = dbFirestore.collection("users");
    const userDoc = await usersRef.where("email", "==", email).get();
    if (userDoc.docs.length === 0) {
      return h
        .response({
          status: "failed",
          message: "Login credentials is not valid",
        })
        .code(422);
    }

    // Check if password is wrong
    const isPasswordValid = await bcrypt.compare(
      password,
      userDoc.docs[0].data()["password"]
    );
    if (!isPasswordValid) {
      return h
        .response({
          status: "failed",
          message: "Login credentials is not valid",
        })
        .code(422);
    }

    // Generate jwt for bearer authentication
    const token = jwt.sign(
      { id: userDoc.docs[0].data()["id"] },
      process.env.JWT_SECRET
    );

    // Mapping user schema for response
    const user = {
      id: userDoc.docs[0].data()["id"],
      name: userDoc.docs[0].data()["name"],
      token,
    };

    return h
      .response({
        status: "success",
        message: "Login and get user are success",
        data: user,
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
