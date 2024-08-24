import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

const userResolver = {
  Mutation: {
    signUp: async (_, { input }, context) => {
      try {
        const { username, email, name, password, gender } = input;

        if (!username || !email || !name || !password || !gender) {
          throw new Error("All fields are required");
        }

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
          throw new Error("User with this username or email already exists");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const profilePicture = `https://avatar.iran.liara.run/public/${gender === "male" ? "boy" : "girl"}?username=${username}`;

        const newUser = new User({
          username,
          email,
          name,
          password: hashedPassword,
          gender,
          profilePicture,
          createdAt: new Date().toISOString(),
        });

        await newUser.save();
        await context.login(newUser);
        return newUser;
      } catch (err) {
        console.error("Error in signUp: ", err);
        throw new Error(err.message || "Internal server error");
      }
    },

    login: async (_, { input }, context) => {
      try {
        const { email, password } = input;
        if (!email || !password) throw new Error("All fields are required");

        const user = await User.findOne({ email });
        if (!user) throw new Error("User not found");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error("Invalid credentials");

        await context.login(user);
        user.lastLogin = new Date().toISOString();
        await user.save();
        return user;
      } catch (err) {
        console.error("Error in login:", err);
        throw new Error(err.message || "Internal server error");
      }
    },

    logout: async (_, __, context) => {
      try {
        await context.logout();
        context.req.session.destroy((err) => {
          if (err) throw err;
        });
        context.res.clearCookie("connect.sid");

        return { message: "Logged out successfully", success: true };
      } catch (err) {
        console.error("Error in logout:", err);
        throw new Error(err.message || "Internal server error");
      }
    },

    updateProfile: async (_, { input }, context) => {
      try {
        const user = await context.getUser();
        if (!user) throw new Error("Authentication required");

        const updatedUser = await User.findByIdAndUpdate(
          user._id,
          { $set: input },
          { new: true }
        );

        return updatedUser;
      } catch (err) {
        console.error("Error in updateProfile:", err);
        throw new Error(err.message || "Internal server error");
      }
    },
  },

  Query: {
    authUser: async (_, __, context) => {
      try {
        const user = await context.getUser();
        return user;
      } catch (err) {
        console.error("Error in authUser: ", err);
        throw new Error("Internal server error");
      }
    },
    user: async (_, { userId }) => {
      try {
        const user = await User.findById(userId);
        return user;
      } catch (err) {
        console.error("Error in user query:", err);
        throw new Error(err.message || "Error getting user");
      }
    },
  },

  User: {
    transactions: async (parent) => {
      try {
        const transactions = await Transaction.find({ userId: parent._id });
        return transactions;
      } catch (err) {
        console.log("Error in user.transactions resolver: ", err);
        throw new Error(err.message || "Internal server error");
      }
    },
  },
};

export default userResolver;