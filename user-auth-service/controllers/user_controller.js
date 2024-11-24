const db = require("../config/database");
const { bucket, getPublicUrl } = require("../utils/img_upload");
const { userUpdateValidation } = require("../validations/user_validation");

const getUser = async (request, h) => {
  try {
    // Destructure paramater
    const { id } = request.params;

    // Check if user not found
    const [user] = await db.query("SELECT * FROM `users` WHERE `id`=?", [id]);
    if (user.length === 0) {
      return h
        .response({
          status: "failed",
          message: "User account is not found",
        })
        .code(404);
    }

    // Mapping user schema for response
    const mappedUser = user.map((user) => {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        photo_url: user.photo_url,
      };
    });

    return h
      .response({
        status: "success",
        message: "Success get user preferences",
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

const updateUser = async (request, h) => {
  try {
    // Validate & destructuring request payload/payload
    const { id } = request.params;
    const { name, email, photo } = request.payload;
    const validate = userUpdateValidation(name, email);

    // Check validation errors possibility
    if (Object.keys(validate).length !== 0) {
      return h
        .response({
          status: "failed",
          message: "Update input doesn't meet validation",
          validation: validate,
        })
        .code(400);
    }

    // Check if user not found
    const [user] = await db.query("SELECT * FROM `users` WHERE `id`=?", [id]);
    if (user.length === 0) {
      return h
        .response({
          status: "failed",
          message: "User account is not found",
        })
        .code(404);
    }

    // Upload photo to cloud storage (if exists)
    var newPhotoUrl = null;
    if (photo) {
      const gcsname = Date.now().toString();

      await bucket.file(gcsname).save(photo, {
        metadata: {
          contentType: "image/jpeg",
        },
      });

      newPhotoUrl = getPublicUrl(gcsname);
    }

    // Update user in database
    await db.query(
      "UPDATE `users` SET `name`=?, `email`=?, `photo_url`=? WHERE `id`=?",
      [
        name ?? user[0].name,
        email ?? user[0].email,
        newPhotoUrl ?? user[0].photo_url,
        id,
      ]
    );

    return h
      .response({
        status: "success",
        message: "Success update user preferences",
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

module.exports = { getUser, updateUser };
