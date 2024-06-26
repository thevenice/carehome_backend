import multer from 'multer'
import path from 'path'
import crypto from 'crypto'
import aws from 'aws-sdk'
import multerS3 from 'multer-s3'

// const spacesEndpoint = new aws.Endpoint(process.env.SPACES_ENDPOINT!);

// Multer storage configuration
const profilePicUploadStorage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    // Specify the destination folder for profile pictures
    cb(null, 'uploads/profile_pictures')
  },
  filename: function (req: any, file: any, cb: any) {
    // Generate a unique filename
    const uniqueFilename = `${Date.now()}-${Math.round(
      Math.random() * 1e9,
    )}${path.extname(file.originalname)}`
    cb(null, uniqueFilename)
  },
})

// Multer middleware for profile picture upload
export const profilePicUpload = multer({
  storage: profilePicUploadStorage,
  fileFilter: function (req: any, file: any, cb: any) {
    // Set the filetypes to allow jpg, jpeg, and png
    const filetypes = /jpg|jpeg|png/
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase(),
    )

    if (extname) {
      return cb(null, true)
    }

    cb(new Error('Invalid file type. Only jpg, jpeg, and png are allowed.'))
  },
})

// const spacesEndpoint = new aws.Endpoint(process.env.SPACES_ENDPOINT!);

// Multer storage configuration
const careHomeLogoStorage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    // Specify the destination folder for profile pictures
    cb(null, 'uploads/care-home-logo')
  },
  filename: function (req: any, file: any, cb: any) {
    // Generate a unique filename
    const uniqueFilename = `${Date.now()}-${Math.round(
      Math.random() * 1e9,
    )}${path.extname(file.originalname)}`
    cb(null, uniqueFilename)
  },
})

// Multer storage configuration
const usersDocumentStorage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    // Specify the destination folder for profile pictures
    cb(null, 'uploads/user-docs')
  },
  filename: function (req: any, file: any, cb: any) {
    // Generate a unique filename
    const uniqueFilename = `${Date.now()}-${Math.round(
      Math.random() * 1e9,
    )}${path.extname(file.originalname)}`
    cb(null, uniqueFilename)
  },
})

// Multer middleware for profile picture upload
export const careHomeLogo = multer({
  storage: careHomeLogoStorage,
  fileFilter: function (req: any, file: any, cb: any) {
    // Set the filetypes to allow jpg, jpeg, and png
    const filetypes = /jpg|jpeg|png/
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase(),
    )

    if (extname) {
      return cb(null, true)
    }

    cb(new Error('Invalid file type. Only jpg, jpeg, and png are allowed.'))
  },
})
export const usersDocuments = multer({
  storage: usersDocumentStorage, // storage configuration
  limits: {
    fileSize: 1024 * 1024 * 5, // Limit file size to 5MB
  },
  fileFilter: function (req: any, file: any, cb: any) {
    // Allow specific document and image file types (e.g., PDF, DOCX, TXT, JPEG, PNG)
    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'text/plain',
      'image/jpeg',
      'image/png',
    ]
    if (allowedMimeTypes.includes(file.mimetype)) {
      return cb(null, true)
    }
    cb(
      new Error(
        'Invalid file type. Only PDF, DOCX, TXT, JPEG, and PNG files are allowed.',
      ),
    )
  },
})

// export const s3: any = new aws.S3({
//   endpoint: spacesEndpoint,
//   accessKeyId: process.env.SPACES_ACCESS_KEY_ID!.trim(),
//   secretAccessKey: process.env.SPACES_SECRET_ACCESS_KEY!.trim(),
// });

// export const uploadFileToS3 = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: "care-home/profile-pics",
//     acl: "public-read",
//     metadata: (req: any, file: any, cb: any) => {
//       cb(null, { filename: file.originalname });
//     },
//     key: function (request: any, file: any, cb: any) {
//       crypto.randomBytes(16, (err, buf) => {
//         if (err) {
//           return err;
//         }
//         const filename = buf.toString("hex") + path.extname(file.originalname);
//         cb(null, filename);
//       });
//     },
//   }),
// });
