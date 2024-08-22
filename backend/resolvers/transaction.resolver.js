import Transaction from "../models/transaction.model.js";
import User from "../models/user.model.js";

const transactionResolver = { // Here we define the resolvers for the Transaction model
	Query: { // We define the Query resolvers for the Transaction model
		transactions: async (_, __, context) => { // We define the transactions resolver function
			try {
				if (!context.getUser()) throw new Error("Unauthorized");
				const userId = await context.getUser()._id;

				const transactions = await Transaction.find({ userId }); // We fetch all transactions associated with the authenticated user
				return transactions;
			} catch (err) {
				console.error("Error getting transactions:", err);
				throw new Error("Error getting transactions");
			}
		},
		transaction: async (_, { transactionId }) => { // we get one transaction by its id using the transaction resolver function
			try {
				const transaction = await Transaction.findById(transactionId);
				return transaction;
			} catch (err) {
				console.error("Error getting transaction:", err);
				throw new Error("Error getting transaction");
			}
		},
		// categoryStatistics: async (_, __, context) => {
		//	if (!context.getUser()) throw new Error("Unauthorized");

		//	const userId = context.getUser()._id;
		//	const transactions = await Transaction.find({ userId });
		//	const categoryMap = {};

			// const transactions = [
			// 	{ category: "expense", amount: 50 },
			// 	{ category: "expense", amount: 75 },
			// 	{ category: "investment", amount: 100 },
			// 	{ category: "saving", amount: 30 },
			// 	{ category: "saving", amount: 20 }
			// ];

		//	transactions.forEach((transaction) => {
		//		if (!categoryMap[transaction.category]) {
		//			categoryMap[transaction.category] = 0;
		//		}
		//		categoryMap[transaction.category] += transaction.amount;
		//	});

			// categoryMap = { expense: 125, investment: 100, saving: 50 }

		//	return Object.entries(categoryMap).map(([category, totalAmount]) => ({ category, totalAmount }));
			// return [ { category: "expense", totalAmount: 125 }, { category: "investment", totalAmount: 100 }, { category: "saving", totalAmount: 50 } ]
		//},
	},
	Mutation: { // We define the Mutation resolvers for the Transaction model
		createTransaction: async (_, { input }, context) => { // We define the createTransaction resolver function
			try {
				const newTransaction = new Transaction({
					...input,
					userId: context.getUser()._id,
				});
				await newTransaction.save();
				return newTransaction;
			} catch (err) {
				console.error("Error creating transaction:", err);
				throw new Error("Error creating transaction");
			}
		},
		updateTransaction: async (_, { input }) => { // We define the updateTransaction resolver function
			try {
				const updatedTransaction = await Transaction.findByIdAndUpdate(input.transactionId, input, {
					new: true,
				});
				return updatedTransaction;
			} catch (err) {
				console.error("Error updating transaction:", err);
				throw new Error("Error updating transaction");
			}
		},
		deleteTransaction: async (_, { transactionId }) => {
			try {
				const deletedTransaction = await Transaction.findByIdAndDelete(transactionId);
				return deletedTransaction;
			} catch (err) {
				console.error("Error deleting transaction:", err);
				throw new Error("Error deleting transaction");
			}
		},
	},
	//Transaction: {
	//	user: async (parent) => {
	//		const userId = parent.userId;
	//		try {
	//			const user = await User.findById(userId);
	//			return user;
	//		} catch (err) {
	//			console.error("Error getting user:", err);
	//			throw new Error("Error getting user");
	//		}
	//	},
//	},
};

export default transactionResolver;