import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: function() {
            return `https://avatar.iran.liara.run/public/${this.gender === "male" ? "boy" : "girl"}?username=${this.username}`;
        },
    },
    gender: {
        type: String,
        enum: ["male", "female", "others"],
        required: true,
    },
    lastLogin: {
        type: Date,
        default: null,
    },
}, { timestamps: true });

// Pre-save hook to hash password before saving
userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// Method to validate password
userSchema.methods.validatePassword = async function(password) {
    return bcrypt.compare(password, this.password);
};

// Index for faster queries
userSchema.index({ username: 1, email: 1 });

const User = mongoose.model("User", userSchema);

export default User;
