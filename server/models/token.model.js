// Load required packages
import mongoose from 'mongoose';

// Define our token schema
const TokenSchema = new mongoose.Schema({
  value: { type: String, required: true },
  userId: { type: String, required: true },
  clientId: { type: String, required: true }
});

// Export the Mongoose model
export default mongoose.model('Token', TokenSchema);
