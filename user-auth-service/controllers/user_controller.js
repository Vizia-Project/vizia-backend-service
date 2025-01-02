const dbFirestore = require("../config/firestore");
const { bucket, getPublicUrl } = require("../utils/img_upload");
const { userUpdateValidation } = require("../validations/user_validation");

const getUser = async (request, h) => {
  try {
    // Destructure paramater
    const { id } = request.params;

    // Check if user not found
    const usersRef = dbFirestore.collection("users");
    const userDoc = await usersRef.where("id", "==", id).get();
    if (userDoc.docs.length === 0) {
      return h
        .response({
          status: "failed",
          message: "User account is not found",
        })
        .code(404);
    }

    // Mapping user schema for response
    const user = {
      id: userDoc.docs[0].data()["id"],
      name: userDoc.docs[0].data()["name"],
      email: userDoc.docs[0].data()["email"],
      photo_url: userDoc.docs[0].data()["photo_url"],
    };

    return h
      .response({
        status: "success",
        message: "Success get user preferences",
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
    const usersRef = dbFirestore.collection("users");
    const userDoc = await usersRef.where("id", "==", id).get();
    if (userDoc.docs.length === 0) {
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

      await bucket.file("user-photos/" + gcsname).save(photo, {
        metadata: {
          contentType: "image/jpeg",
        },
      });

      newPhotoUrl = getPublicUrl(gcsname);
    }

    // Update user in database
    const userDocRef = usersRef.doc(userDoc.docs[0].id);
    await userDocRef.set(
      {
        name: name ?? userDoc.docs[0].data()["name"],
        email: email ?? userDoc.docs[0].data()["email"],
        photo_url: newPhotoUrl ?? userDoc.docs[0].data()["photo_url"],
      },
      { merge: true }
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
