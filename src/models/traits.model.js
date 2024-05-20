import mongoose, {Schema} from "mongoose";

const traitSchema = new Schema(
    {
        traitname: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
    }, {
        timestamps: true,
    }
)


export const Trait = mongoose.model("Trait", traitSchema)