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
        trait1Rating: {
            type: String,
        },
        trait2Rating: {
            type: String,
        },
        trait3Rating: {
            type: String,
        },
        trait4Rating: {
            type: String,
        },
        trait5Rating: {
            type: String,
        },
        // traitIds: [
        //     {
        //         type: String,
        //     }
        // ],
        // traitRatings: [
        //     {
        //         type: String,
        //     }
        // ],
        ratingComment: {
            type: String,
        },
    }, {
        timestamps: true,
    }
)


export const Rating = mongoose.model("Rating", ratingSchema)