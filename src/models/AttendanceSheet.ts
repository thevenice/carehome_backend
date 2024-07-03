import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendance extends Document {
  user: mongoose.Types.ObjectId;
  date: Date;
  checkIn: Date;
  checkOut: Date;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EARLY_DEPARTURE';
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const attendanceSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    checkIn: { type: Date, required: false },
    checkOut: { type: Date, required: false },
    status: {
      type: String,
      enum: ['PRESENT', 'ABSENT', 'LATE', 'EARLY_DEPARTURE'],
      required: true,
      default: 'ABSENT',
    },
    notes: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

const Attendance = mongoose.model<IAttendance>('Attendance', attendanceSchema);

export default Attendance;