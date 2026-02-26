import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IScan {
  timestamp: Date;
  userAgent?: string;
  ipAddress?: string;
}

export interface IQRCode extends Document {
  shortCode: string;
  originalUrl: string;
  qrImageData: string;
  scans: IScan[];
  scanCount: number;
  createdAt: Date;
}

const ScanSchema = new Schema<IScan>({
  timestamp: { type: Date, default: Date.now },
  userAgent: { type: String },
  ipAddress: { type: String },
});

const QRCodeSchema = new Schema<IQRCode>({
  shortCode: { 
    type: String, 
    required: true, 
    unique: true,
    index: true 
  },
  originalUrl: { 
    type: String, 
    required: true 
  },
  qrImageData: { 
    type: String, 
    required: true 
  },
  scans: [ScanSchema],
  scanCount: { 
    type: Number, 
    default: 0 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

const QRCode: Model<IQRCode> = mongoose.models.QRCode || mongoose.model<IQRCode>('QRCode', QRCodeSchema);

export default QRCode;
