import mongoose, {Schema} from "mongoose";

const ratingSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            required: true,
        },
    }
)


export const User = mongoose.model("Rating", ratingSchema)