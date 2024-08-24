import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import Transaction from '../Expense-Tracking-App/backend/models/transaction.model.js';

async function migrateTransactions() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to database: ${mongoose.connection.name}`);

    const totalCount = await Transaction.countDocuments();
    console.log(`Total documents in collection: ${totalCount}`);

    const documentsWithoutCurrency = await Transaction.countDocuments({ currency: { $exists: false } });
    console.log(`Documents without currency: ${documentsWithoutCurrency}`);

    const result = await Transaction.updateMany(
      { currency: { $exists: false } },
      {
        $set: {
          currency: 'USD',
          isRecurring: false,
          recurringFrequency: 'N/A',
          tags: [],
          notes: '',
          attachments: []
        }
      }
    );

    console.log(`Updated ${result.modifiedCount} documents`);
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
  }
}

migrateTransactions();