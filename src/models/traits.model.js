import mongoose, {Schema} from "mongoose";

const traitSchema = new Schema(
    {
        traitName: {
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