# Expense Tracker API with Photo Upload Features

A comprehensive expense tracking API built with NestJS, MongoDB, and AWS S3/CloudFront for photo storage and delivery.

## Features

- ✅ User authentication with JWT
- ✅ Role-based access control (USER/ADMIN)
- ✅ Expense tracking with categories
- ✅ Product management
- ✅ User statistics and analytics
- ✅ **NEW:** Profile photo upload for users
- ✅ **NEW:** Multiple photo upload for products
- ✅ **NEW:** Photo deletion capabilities
- ✅ **NEW:** AWS S3 integration for storage
- ✅ **NEW:** CloudFront CDN configuration
- ✅ Complete Swagger API documentation

## Prerequisites

- Node.js (v16 or higher)
- MongoDB
- AWS Account with S3 and CloudFront access

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env`:
   ```env
   # Database
   MONGO_URI=mongodb://localhost:27017/expense-tracker

   # JWT
   JWT_SECRET=your-jwt-secret

   # AWS S3 Configuration
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your-access-key-id
   AWS_SECRET_ACCESS_KEY=your-secret-access-key
   AWS_S3_BUCKET=expense-tracker-bucket

   # CloudFront (Optional)
   CLOUDFRONT_DISTRIBUTION_ID=your-distribution-id
   CLOUDFRONT_DOMAIN=your-distribution-domain.cloudfront.net
   ```

## AWS Setup Instructions

### 1. Create S3 Bucket

1. Go to AWS S3 Console
2. Create a new bucket (e.g., `expense-tracker-bucket`)
3. Configure bucket permissions:
   - Go to Permissions → Bucket Policy
   - Add the following policy to allow public read access:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::expense-tracker-bucket/*"
        }
    ]
}
```

### 2. Create IAM User

1. Go to AWS IAM Console
2. Create a new user with programmatic access
3. Attach the following policy:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:DeleteObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::expense-tracker-bucket",
                "arn:aws:s3:::expense-tracker-bucket/*"
            ]
        }
    ]
}
```

### 3. Configure CloudFront (Optional but Recommended)

1. Go to AWS CloudFront Console
2. Create a new distribution:
   - Origin Domain: Select your S3 bucket
   - Origin Path: Leave empty
   - Enable Origin Shield: No
   - Restrict Bucket Access: No
3. Configure cache behavior:
   - Viewer Protocol Policy: Redirect HTTP to HTTPS
   - Allowed HTTP Methods: GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE
4. Note down the Distribution ID and Domain Name

## Running the Application

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## API Documentation

Once the application is running, visit:
- **API**: http://localhost:3000
- **Swagger Documentation**: http://localhost:3000/api

## Photo Upload Features

### User Profile Photos

- **Upload**: `POST /users/{id}/profile-photo`
  - Requires authentication
  - Users can upload their own photos, admins can upload any
  - Supports image files (jpg, png, etc.) up to 5MB

- **Delete**: `DELETE /users/{id}/profile-photo`
  - Requires authentication
  - Users can delete their own photos, admins can delete any

### Product Photos

- **Upload Multiple**: `POST /products/{id}/photos`
  - Admin only
  - Supports up to 10 images per request
  - Each image up to 5MB

- **Delete Single**: `DELETE /products/{id}/photos`
  - Admin only
  - Requires photoUrl in request body

- **Delete All**: `DELETE /products/{id}/photos/all`
  - Admin only
  - Removes all photos from a product

## File Storage Structure

```
S3 Bucket Structure:
├── users/
│   └── {userId}/
│       └── profile-{timestamp}-{filename}
└── products/
    └── {productId}/
        ├── photo-{timestamp}-{random}-{filename1}
        ├── photo-{timestamp}-{random}-{filename2}
        └── ...
```

## Security Features

- JWT authentication required for all operations
- Role-based access control
- File type validation (images only)
- File size limits (5MB per file)
- Automatic cleanup of old profile photos
- CloudFront cache invalidation on file deletion

## Testing the API

1. Register a user or login with existing credentials
2. Use the JWT token in Authorization header: `Bearer {token}`
3. Test photo upload endpoints with form-data
4. View uploaded photos via the returned URLs

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGO_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `AWS_REGION` | AWS region (e.g., us-east-1) | Yes |
| `AWS_ACCESS_KEY_ID` | AWS access key | Yes |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key | Yes |
| `AWS_S3_BUCKET` | S3 bucket name | Yes |
| `CLOUDFRONT_DISTRIBUTION_ID` | CloudFront distribution ID | No |
| `CLOUDFRONT_DOMAIN` | CloudFront domain | No |

## Troubleshooting

### Common Issues

1. **AWS Credentials Error**: Ensure IAM user has correct permissions
2. **Bucket Not Found**: Verify bucket name and region
3. **File Upload Fails**: Check file size (max 5MB) and type (images only)
4. **CloudFront Issues**: Ensure distribution is properly configured

### Logs

Check application logs for detailed error messages:
```bash
npm run start:dev
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
