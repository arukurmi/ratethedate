import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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

userSchema.pre("save", async function (next) {
    if(this.isModified("password")) this.password = bcrypt.hash(this.password, 10);
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: ACCESS_TOKEN_EXPIRY,
        },
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: REFRESH_TOKEN_EXPIRY,
        },
    )
}

export const User = mongoose.model("User", userSchema)