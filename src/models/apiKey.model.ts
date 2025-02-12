import mongoose, { model, type InferSchemaType } from 'mongoose';

const DOCUMENT_NAME = 'ApiKey';
const COLLECTION_NAME = 'ApiKeys';

const apiKeySchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: Boolean,
      default: true,
    },

    permissions: {
      type: [String],
      required: true,
      enum: ['000', '111', '222'],
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

export type ApiKey = InferSchemaType<typeof apiKeySchema>;

export default model(DOCUMENT_NAME, apiKeySchema);
