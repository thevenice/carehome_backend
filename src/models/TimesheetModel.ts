import mongoose, { Schema, Document } from 'mongoose';

export interface ITimesheet extends Document {
  user: mongoose.Types.ObjectId;
  date: Date;
  shiftStart: Date;
  shiftEnd: Date;
  breakTime: number; // in minutes
  totalHours: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const timesheetSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    shiftStart: { type: Date, required: true },
    shiftEnd: { type: Date, required: true },
    breakTime: { type: Number, required: true, default: 0 },
    totalHours: { type: Number, required: true },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      required: true,
      default: 'PENDING',
    },
    notes: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

const Timesheet = mongoose.model<ITimesheet>('Timesheet', timesheetSchema);

export default Timesheet;