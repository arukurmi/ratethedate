import mongoose, {Schema} from "mongoose";

const letterSchema = new Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        partnerId: {
            type: String,
            required: true,
        },
        letterBody: {
            type: String,
            required: true,
        },
        letterFrequency:{
            type: String,
            required: true,
            default: 7,
        }
    }
)


export const Letter = mongoose.model("letter", letterSchema)