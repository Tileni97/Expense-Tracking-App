import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    paymentType: {
        type: String,
        enum: ["Cash", "Card", "Bank Transfer", "Mobile Payment", "Other"],
        required: true,
    },
    category: {
        type: String,
        enum: ["Saving", "Expense", "Investment", "Income", "Other"],
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        validate: {
            validator: function(value) {
                return value > 0;
            },
            message: 'Amount must be a positive number'
        }
    },
    currency: {
        type: String,
        required: true,
        default: "NAD", // You can change this default as needed
    },
    location: {
        type: String,
        default: "Unknown",
    },
    date: {
        type: Date,
        required: true,
        validate: {
            validator: function(value) {
                if (this.isRecurring) return true;
                return value <= new Date();
            },
            message: 'Date cannot be in the future unless the transaction is recurring'
        }
    },
    tags: [{
        type: String,
        trim: true,
    }],
    isRecurring: {
        type: Boolean,
        default: false,
    },
    recurringFrequency: {
        type: String,
        enum: ["Daily", "Weekly", "Monthly", "Yearly", "N/A"],
        default: "N/A",
    },
    notes: {
        type: String,
        trim: true,
    },
    attachments: [{
        type: String,
        validate: {
            validator: function(value) {
                return /^https?:\/\/[^\s$.?#].[^\s]*$/.test(value);
            },
            message: 'Invalid URL format for attachment'
        }
    }],
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
});

// Indexes
transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ category: 1 });
transactionSchema.index({ tags: 1 });
transactionSchema.index({ amount: 1 });

// Custom Methods
transactionSchema.methods.generateRecurringTransactions = async function() {
    if (!this.isRecurring) return;

    const frequencies = {
        "Daily": 1,
        "Weekly": 7,
        "Monthly": 30,
        "Yearly": 365
    };

    const daysToAdd = frequencies[this.recurringFrequency];
    const nextDate = new Date(this.date);
    nextDate.setDate(nextDate.getDate() + daysToAdd);

    const newTransaction = new this.constructor({
        ...this.toObject(),
        date: nextDate
    });

    await newTransaction.save();
    return newTransaction;
};

// Static Methods
transactionSchema.statics.findByDateRange = function(userId, startDate, endDate) {
    return this.find({
        userId,
        date: { $gte: startDate, $lte: endDate }
    });
};

transactionSchema.statics.findByCategory = function(userId, category) {
    return this.find({
        userId,
        category
    });
};

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
