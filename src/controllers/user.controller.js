import { asyncHandler } from "../utils/asyncHandler.js";
import * as EmailValidator from "email-validator";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiREsponse.js";

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, name, password } = req.body;

    if (
        [username, email, name, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All mandatory information is missing");
    }

    if (!EmailValidator.validate(email)) {
        throw new ApiError(400, "Enter Valid Email");
    }

    const existingUser = await User.findOne({
        $or: [{ email }, { username }],
    });

    if (existingUser) {
        throw new ApiError(409, "email or username already exists");
    }

    let userAvatarCloudinary;
    const userAvatarLocalPath = req.files?.userAvatar[0]?.path;
    if (userAvatarLocalPath) {
        userAvatarCloudinary = await uploadOnCloudinary(userAvatarLocalPath);
    }

    const user = await User.create({
        username: username.toLowerCase(),
        email,
        name,
        password,
        userAvatar: userAvatarCloudinary?.url || "",
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while creating the user");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                { user: createdUser },
                "User registered Successfully!"
            )
        );

    // res.status(200).json({
    //     message: "CHAL GAYA!",
    // })
});

export { registerUser };
