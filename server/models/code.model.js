// Load required packages
import mongoose from 'mongoose';

// Define our token schema
const CodeSchema = new mongoose.Schema({
  value: { type: String, required: true },
  redirectUri: { type: String, required: true },
  userId: { type: String, required: true },
  clientId: { type: String, required: true }
});

// Export the Mongoose model
export default mongoose.model('Code', CodeSchema);
