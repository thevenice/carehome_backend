import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICompanyInfo extends Document {
  name: string;
  contactInfo: {
    phoneNumber: string;
    emailAddress: string;
  };
  location?: {
    address?: string;
    coordinates?: {
      type: string; // GeoJSON type (e.g., "Point")
      coordinates: [number]; // Array of longitude & latitude
    };
  };
  logo?: string;
  linkedin?: string;
  googleMap?: string;
  xCom?: string;
  instagram?: string;
  facebook?: string;
  whatsapp?: string;
  telegram?: string;
  images: string[]; // Array of image URLs stored elsewhere
  aboutUs?: string; // Optional description
  servicesOffered?: string[]; // Optional list of services
  facilitiesAmenities?: string[]; // Optional list of facilities & amenities description
  testimonials?: string[]; // Optional testimonials
  createdAt: Date;
  updatedAt: Date;
}

const companyInfoSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    contactInfo: {
      phoneNumber: {
        type: String,
        required: true,
      },
      emailAddress: {
        type: String,
        required: true,
      },
    },
    location: {
      address: {
        type: String,
        required: false,
      },
      coordinates: {
        type: {
          type: String, // GeoJSON type (e.g., "Point")
          enum: ['Point'],
        },
        coordinates: {
          type: [Number],
          required: false,
        },
      },
    },
    logo: {
      type: String,
      required: false,
    },
    linkedin: {
      type: String,
      required: false,
    },
    googleMap: {
      type: String,
      required: false,
    },
    xCom: {
      type: String,
      required: false,
    },
    instagram: {
      type: String,
      required: false,
    },
    facebook: {
      type: String,
      required: false,
    },
    whatsapp: {
      type: String,
      required: false,
    },
    telegram: {
      type: String,
      required: false,
    },
    images: {
      type: [String],
    },
    aboutUs: {
      type: String,
    },
    servicesOffered: {
      type: [String],
    },
    facilitiesAmenities: {
      type: [String],
    },
    testimonials: {
      type: [String],
    },
  },
  {
    timestamps: true, // This option enables Mongoose to automatically manage createdAt and updatedAt fields
  }
);

// Ensure the model is a singleton
let CompanyInfo: Model<ICompanyInfo, {}, {}>;

try {
  // Trying to create the model if it doesn't exist, and providing a default shape
  CompanyInfo = mongoose.model('CompanyInfo') as Model<ICompanyInfo, {}, {}>;
} catch (e) {
  // If the model already exists, then it's fine.
  CompanyInfo = mongoose.model<ICompanyInfo>('CompanyInfo', companyInfoSchema) as Model<ICompanyInfo, {}, {}>;
}

export default CompanyInfo;
