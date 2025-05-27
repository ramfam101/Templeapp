const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName:  { type: String, required: true },
    dob:       { type: Date, required: true },
    email:     { type: String, required: true, unique: true },
    password:  { type: String, required: true },
    accountType: {
        type: String,
        enum: ["client", "admin", "priest"],
        default: "client"
    },
});

module.exports = mongoose.model("User", UserSchema);
