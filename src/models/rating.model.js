import mongoose, {Schema} from "mongoose";

const ratingSchema = new Schema(
    {
        userId: {
            type: String,
            required: true,
            index: true,
        },
        partnerId: {
            type: String,
            required: true,
            index: true,
        },
        traitIds: [
            {
                type: String,
            }
        ],
        traitRatings: [
            {
                type: String,
            }
        ],
        ratingComment: {
            type: String,
        },
    }, {
        timestamps: true,
    }
)


export const Rating = mongoose.model("Rating", ratingSchema)