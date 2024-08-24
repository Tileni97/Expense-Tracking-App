import Transaction from "../models/transaction.model.js";
import User from "../models/user.model.js";

const transactionResolver = {
  Query: {
    transactions: async (_, { filter }, context) => {
      try {
        if (!context.getUser()) throw new Error("Unauthorized");
        const userId = context.getUser()._id;

        let query = { userId };

        if (filter) {
          if (filter.category) query.category = filter.category;
          if (filter.paymentType) query.paymentType = filter.paymentType;
          if (filter.minAmount) query.amount = { $gte: filter.minAmount };
          if (filter.maxAmount) query.amount = { ...query.amount, $lte: filter.maxAmount };
          if (filter.startDate) query.date = { $gte: filter.startDate };
          if (filter.endDate) query.date = { ...query.date, $lte: filter.endDate };
          if (filter.tags) query.tags = { $in: filter.tags };
        }

        const transactions = await Transaction.find(query);
        return transactions;
      } catch (err) {
        console.error("Error getting transactions:", err);
        throw new Error("Error getting transactions");
      }
    },
    transaction: async (_, { transactionId }, context) => {
      try {
        if (!context.getUser()) throw new Error("Unauthorized");
        const transaction = await Transaction.findById(transactionId);
        if (transaction.userId.toString() !== context.getUser()._id.toString()) {
          throw new Error("Unauthorized");
        }
        return transaction;
      } catch (err) {
        console.error("Error getting transaction:", err);
        throw new Error("Error getting transaction");
      }
    },
    categoryStatistics: async (_, { period }, context) => {
      if (!context.getUser()) throw new Error("Unauthorized");

      const userId = context.getUser()._id;
      let dateFilter = {};

      if (period) {
        const now = new Date();
        const startDate = new Date();
        startDate.setMonth(now.getMonth() - (period === 'year' ? 12 : 1));
        dateFilter = { date: { $gte: startDate.toISOString(), $lte: now.toISOString() } };
      }

      const transactions = await Transaction.find({ userId, ...dateFilter });
      const categoryMap = {};

      transactions.forEach((transaction) => {
        if (!categoryMap[transaction.category]) {
          categoryMap[transaction.category] = { totalAmount: 0, transactionCount: 0 };
        }
        categoryMap[transaction.category].totalAmount += transaction.amount;
        categoryMap[transaction.category].transactionCount += 1;
      });

      return Object.entries(categoryMap).map(([category, { totalAmount, transactionCount }]) => ({ 
        category, 
        totalAmount, 
        transactionCount 
      }));
    },
    monthlySpending: async (_, { year }, context) => {
      if (!context.getUser()) throw new Error("Unauthorized");

      const userId = context.getUser()._id;
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31);

      const transactions = await Transaction.find({
        userId,
        date: { $gte: startDate.toISOString(), $lte: endDate.toISOString() }
      });

      const monthlySpending = Array(12).fill().map(() => ({ totalAmount: 0 }));

      transactions.forEach((transaction) => {
        const month = new Date(transaction.date).getMonth();
        monthlySpending[month].totalAmount += transaction.amount;
      });

      return monthlySpending.map((spending, index) => ({
        month: index + 1,
        totalAmount: spending.totalAmount
      }));
    },
    transactionsByDateRange: async (_, { startDate, endDate }, context) => {
      if (!context.getUser()) throw new Error("Unauthorized");

      const userId = context.getUser()._id;
      return Transaction.find({
        userId,
        date: { $gte: startDate, $lte: endDate }
      });
    },
  },
  Mutation: {
    createTransaction: async (_, { input }, context) => {
      try {
        if (!context.getUser()) throw new Error("Unauthorized");
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
    updateTransaction: async (_, { input }, context) => {
      try {
        if (!context.getUser()) throw new Error("Unauthorized");
        const transaction = await Transaction.findById(input.transactionId);
        if (transaction.userId.toString() !== context.getUser()._id.toString()) {
          throw new Error("Unauthorized");
        }
        const updatedTransaction = await Transaction.findByIdAndUpdate(input.transactionId, input, {
          new: true,
        });
        return updatedTransaction;
      } catch (err) {
        console.error("Error updating transaction:", err);
        throw new Error("Error updating transaction");
      }
    },
    deleteTransaction: async (_, { transactionId }, context) => {
      try {
        if (!context.getUser()) throw new Error("Unauthorized");
        const transaction = await Transaction.findById(transactionId);
        if (transaction.userId.toString() !== context.getUser()._id.toString()) {
          throw new Error("Unauthorized");
        }
        const deletedTransaction = await Transaction.findByIdAndDelete(transactionId);
        return deletedTransaction;
      } catch (err) {
        console.error("Error deleting transaction:", err);
        throw new Error("Error deleting transaction");
      }
    },
    bulkDeleteTransactions: async (_, { transactionIds }, context) => {
      try {
        if (!context.getUser()) throw new Error("Unauthorized");
        const userId = context.getUser()._id;
        const result = await Transaction.deleteMany({
          _id: { $in: transactionIds },
          userId: userId
        });
        return {
          deletedCount: result.deletedCount,
          success: result.deletedCount === transactionIds.length
        };
      } catch (err) {
        console.error("Error bulk deleting transactions:", err);
        throw new Error("Error bulk deleting transactions");
      }
    },
  },
  Transaction: {
    user: async (parent) => {
      const userId = parent.userId;
      try {
        const user = await User.findById(userId);
        return user;
      } catch (err) {
        console.error("Error getting user:", err);
        throw new Error("Error getting user");
      }
    },
  },
};

export default transactionResolver;