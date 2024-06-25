import { asyncHandler } from "../utils/asyncHandler.js";
import * as EmailValidator from "email-validator";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiREsponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndrefreshToken = async(userId) => {
    try {

        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };

    } catch (error) {
        throw new ApiError(500, "Something went wrong while genrating Tokens");
    }
}

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

    let userAvatarLocalPath, userAvatarCloudinary;
    console.log(req.files);
    if (req.files && Array.isArray(req.files.userAvatar) && req.files.userAvatar[0]) userAvatarLocalPath = req.files.userAvatar[0].path;
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
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body

    if ((!email && !username) || !password) {
        throw new ApiError(400, "username or email or password required");
    }

    const user = await User.findOne({ $or: [{ username }, { email }] });

    if (!user) {
        throw new ApiError(404, "user does not exist")
    }

    const validPassword = await user.isPasswordCorrect(password);

    if (!validPassword) {
        throw new ApiError(401, "Password mismatch");
    }

    const { accessToken, refreshToken } = await generateAccessAndrefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                { user: loggedInUser, accessToken, refreshToken },
                "User logged in successfully"
            )
    )

});

const logoutUser = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        }
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"))

})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) throw new ApiError(401, "unauthorized request");

    try {
        const decodedToken = await jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decodedToken._id);
        if (!user) throw new ApiResponse(401, "Invalid refresh Token");
        if (incomingRefreshToken !== user?.refreshToken) throw new ApiResponse(401, "Refresh Token is expired or used");
    
        const options = {
            httpOnly: true,
            secured: true
        }
    
        const { newAccessToken, newRefreshToken } = await generateAccessAndrefreshToken(user._id);
    
        return res
            .status(200)
            .cookie("accessToken", newAccessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Token Generated"
                )
            );
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }


})

const changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword && newPassword) throw new ApiError(400, "Invalid request");
    
    const user = await User.findById(req.user?._id);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    
    if (!isPasswordCorrect) throw new ApiError(400, "invalid old password");

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password Changed successfully"));

})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                req.user,
                "User fetched successfully"
            )
        );
})

const updateUserDetails = asyncHandler(async (req, res) => {
    const { name, email } = req.body;

    if (!name && !email) throw new ApiError(400, "All Fields are Required");

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                name,
                email
            }
        },
        { new: true }
    ).select("-password -refreshToken");

    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "Details Updated Successfully!")
    )
})

const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) throw new ApiError(400, "Avatar file is missing");

    const avatarCloudinary = await uploadOnCloudinary(avatarLocalPath);

    if (!avatarCloudinary?.url) throw new (ApiError(400, "Cloudinary upload error"));

    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                userAvatar: avatarCloudinary.url,
            },
        },
        { new: true }
    ).select("-password -refreshToken");

    return res
        .status(200)
        .json(new ApiResponse(200, user, "User Avatar Updated Successfully!"));
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getCurrentUser,
    updateUserDetails,
    updateUserAvatar,
};
