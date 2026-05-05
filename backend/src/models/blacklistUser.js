const mongoose = require("mongoose")


// Define the schema for blacklisted tokens
const blacklistTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, "token is required"]
    }
}, {
    timestamps: true
})



module.exports = mongoose.model("BlacklistTokens", blacklistTokenSchema)