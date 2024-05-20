import mongoose, {Schema} from "mongoose";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        phone: {
            type: Number,
            required: true,
            unique: true,
            index: true,
        },
        password: {
            type: password,
            required: [true, "Password is Required"],
        },
        partnerId:{
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        userAvatar: {
            type: String,
        },
        refreshToken: {
            type: String,
        }
    }, {
        timestamps: true,
    }
)


export const User = mongoose.model("User", userSchema)