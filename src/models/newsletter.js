import mongoose, {Schema} from "mongoose";

const nlSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
        },
        nlText: {
            type: Number,
            required: true,
        },
        nlDuration: {
            type: Number,
            required: true,
        },
    }
)


export const User = mongoose.model("newsletter", nlSchema)