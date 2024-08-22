import passport from "passport";
import bcrypt from "bcryptjs"; // used for hashing passwords

import User from "../models/user.model.js";
import { GraphQLLocalStrategy } from "graphql-passport"; // used for authenticating users

export const configurePassport = async () => { //this function will be called in the index.js file
	passport.serializeUser((user, done) => { //will take the user object and store it in the session
		console.log("Serializing user"); //this function will be called when the user logs in
		done(null, user.id); //the user object is passed to the done callback function
	});

	passport.deserializeUser(async (id, done) => { //will take the user object from the session and convert it back into a user object
		console.log("Deserializing user"); //this function will be called when the user makes a request to the server
		try {
			const user = await User.findById(id); //find the user by the id
			done(null, user);
		} catch (err) {
			done(err);
		}
	});

	passport.use( //use the GraphQLLocalStrategy to authenticate users with a username and password
		new GraphQLLocalStrategy(async (username, password, done) => {
			try {
				const user = await User.findOne({ username });
				if (!user) {
					throw new Error("Invalid username or password");
				}
				const validPassword = await bcrypt.compare(password, user.password);

				if (!validPassword) {
					throw new Error("Invalid username or password");
				}

				return done(null, user);
			} catch (err) {
				return done(err);
			}
		})
	);
};

//Notes:
// passport is a middleware that is used to authenticate users in Node.js applications
// passport.serializeUser() is used to store the user object in the session
// passport.deserializeUser() is used to retrieve the user object from the session
// passport.use() is used to define a new authentication strategy
// The GraphQLLocalStrategy is a strategy that is used to authenticate users with a username and password
// The strategy takes a username and password and checks if the user exists in the database
// If the user exists, it checks if the password is valid using bcrypt.compare()
// If the password is valid, the user object is passed to the done callback function
// If the password is invalid, an error is thrown
// If the user does not exist, an error is thrown
// The configurePassport() function is used to set up the passport middleware
// The function defines the serializeUser, deserializeUser, and use strategies
// The function is exported so that it can be used in other files