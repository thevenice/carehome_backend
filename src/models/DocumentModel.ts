import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IDocument extends Document {
  title: string;
  filename: string; // filename or path to the document
  uploadedAt: Date;
  createdBy: Types.ObjectId;
  associatedUsers?: [Types.ObjectId];
}

const documentSchema = new Schema<IDocument>(
  {
    title: {
      type: String,
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    associatedUsers: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }],
  },
  {
    timestamps: false,
  }
);

const DocumentModel: Model<IDocument> = mongoose.model<IDocument>('Document', documentSchema);

export default DocumentModel;
