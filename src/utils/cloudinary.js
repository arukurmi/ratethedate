import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async function (path) {
    try {
        if (!path) {
            return null;
        }
        // upload to cloudinary
        const cloudinaryResponse = await cloudinary.uploader.upload(path, {
            resource_type: "auto",
        });
        // console.log(
        //     "A file is uploaded to cloudinary, ",
        //     cloudinaryResponse.url
        // );
        fs.unlinkSync(path);
        return cloudinaryResponse;
    } catch (error) {
        fs.unlinkSync(path);
        return null;
    }
};

export { uploadOnCloudinary };
