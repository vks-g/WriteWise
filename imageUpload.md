# 🧩 WriteWise — Drag & Drop Image Upload Implementation Guide

This document defines the **exact order and implementation steps** for adding **drag-and-drop image uploads** to WriteWise with Cloudinary integration.

⚠️ **Follow the order strictly.**
⚠️ **Do NOT skip backend steps.**
⚠️ **Do NOT merge prompts.**

---

## 📋 Project File Structure Reference

```
writewise_blog/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db/
│   │   │   │   └── db.js
│   │   │   └── [NEW: cloudinary.js]
│   │   ├── controllers/
│   │   │   ├── postController.js
│   │   │   └── [NEW: uploadController.js]
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   ├── [NEW: multerMiddleware.js]
│   │   │   └── [NEW: fileTypeValidation.js]
│   │   ├── routes/
│   │   │   ├── post.routes.js
│   │   │   └── [NEW: upload.routes.js]
│   │   └── services/
│   │       ├── postService.js
│   │       └── [NEW: imageService.js]
│   ├── .env
│   └── index.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── [NEW: ImageUpload/]
│   │   │   │   ├── DragDropZone.jsx
│   │   │   │   └── ImageUploadProgress.jsx
│   │   │   └── [NEW: BlogEditor/]
│   │   │       └── EditorWithImageUpload.jsx
│   │   ├── hooks/
│   │   │   └── [NEW: useImageUpload.js]
│   │   └── lib/
│   │       ├── axios.js
│   │       └── [NEW: imageUploadConfig.js]
│   └── package.json
└── imageUpload.md [THIS FILE]
```

---

## 🧠 Upload Architecture (Reference)

**Frontend**
- `react-dropzone` - Drag & drop UI
- `browser-image-compression` - Client-side compression
- `axios` - HTTP requests with progress tracking
- `mime-types` - MIME type validation

**Backend**
- `multer` - File receiving middleware
- `cloudinary` - Cloud image storage
- `file-type` - Real MIME type detection
- `sharp` - Image processing & optimization

**Rule**
- ✅ Images stored in **Cloudinary**
- ✅ Database stores only `imageUrl` and `public_id`
- ✅ No base64, no database blobs
- ✅ `coverImage` column in `posts` table stores Cloudinary URL

---

## 🔹 PHASE 0 — GLOBAL CONTEXT (RUN ONCE)

**Prompt for Copilot:**

```txt
We are adding drag-and-drop image upload support to WriteWise.

Frontend libraries to add:
- react-dropzone
- browser-image-compression
- mime-types

Backend libraries to add:
- multer
- cloudinary
- file-type
- sharp

Architecture:
- Images are uploaded to Cloudinary
- Only Cloudinary URLs and public_id are stored in database
- No base64 encoding, no database blobs
- The coverImage column in posts table will store Cloudinary URLs
- Upload should be reusable for blog covers, editor images, and profiles

File structure locations:
Backend:
- Cloudinary config: /backend/src/config/cloudinary.js
- Multer middleware: /backend/src/middleware/multerMiddleware.js
- File validation: /backend/src/middleware/fileTypeValidation.js
- Image service: /backend/src/services/imageService.js
- Upload controller: /backend/src/controllers/uploadController.js
- Upload routes: /backend/src/routes/upload.routes.js

Frontend:
- Hook: /frontend/src/hooks/useImageUpload.js
- Config: /frontend/src/lib/imageUploadConfig.js
- Drag-drop component: /frontend/src/components/ImageUpload/DragDropZone.jsx
- Progress component: /frontend/src/components/ImageUpload/ImageUploadProgress.jsx
- Editor integration: /frontend/src/components/BlogEditor/EditorWithImageUpload.jsx
```

---

## 🔹 PHASE 1 — BACKEND SETUP (MANDATORY FIRST)

### 1️⃣ Install Dependencies

```bash
cd backend
npm install multer cloudinary file-type sharp
```

Add to `.env`:
```env
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

MAX_IMAGE_SIZE=5242880  # 5MB in bytes
```

---

### 2️⃣ Create Cloudinary Config

**File:** `/backend/src/config/cloudinary.js`

**Prompt for Copilot:**

```txt
Create a Cloudinary configuration helper file at /backend/src/config/cloudinary.js

Requirements:
- Import cloudinary and dotenv
- Configure cloudinary with environment variables (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET)
- Create and export an async function uploadImageToCloudinary that:
  - Accepts a file buffer, original filename, and optional folder name
  - Uploads to Cloudinary with the buffer as a stream
  - Returns an object with: { secure_url, public_id, format, width, height }
  - Throws descriptive errors if upload fails

- Create and export an async function deleteImageFromCloudinary that:
  - Accepts a public_id
  - Deletes the image from Cloudinary
  - Returns success/error status
  - Does not throw if image not found

- Do not hardcode credentials
- Use dotenv for all secrets
```

---

### 3️⃣ Create Multer Middleware

**File:** `/backend/src/middleware/multerMiddleware.js`

**Prompt for Copilot:**

```txt
Create a multer middleware file at /backend/src/middleware/multerMiddleware.js

Requirements:
- Import multer
- Use memory storage (not disk storage)
- Set file size limit to process.env.MAX_IMAGE_SIZE (default 5MB)
- Accept only image MIME types: image/jpeg, image/png, image/webp, image/gif
- Create a single file upload middleware called uploadSingleImage
- Create a multiple file upload middleware called uploadMultipleImages (max 5 files)
- Reject files with extensions that don't match the MIME type
- Attach file(s) to req.file or req.files with buffer included

Export both middlewares
```

---

### 4️⃣ Create File-Type Validation Middleware

**File:** `/backend/src/middleware/fileTypeValidation.js`

**Prompt for Copilot:**

```txt
Create file-type validation middleware at /backend/src/middleware/fileTypeValidation.js

Requirements:
- Import file-type package
- Create middleware function validateImageType that:
  - Checks req.file or req.files
  - Uses file-type.fromBuffer() to detect real MIME type from buffer
  - Allows only: image/jpeg, image/png, image/webp, image/gif
  - Rejects files with spoofed extensions (e.g., .exe renamed to .jpg)
  - Returns 400 error with message: "Invalid file type. Only images are allowed."
  - Passes to next() if valid

- Create middleware function for multiple files that validates each file
- Attach detected MIME type to req.file.detectedMime

Export both middlewares
```

---

### 5️⃣ Create Image Service

**File:** `/backend/src/services/imageService.js`

**Prompt for Copilot:**

```txt
Create image service at /backend/src/services/imageService.js

Requirements:
- Import sharp, Prisma client, cloudinary helpers
- Create async function processAndUploadImage that:
  - Accepts: fileBuffer, originalFilename, folder (optional)
  - Uses sharp to:
    - Resize max width to 1200px (maintain aspect ratio)
    - Convert to optimized webp or jpeg
    - Strip metadata
    - Return optimized buffer
  - Uploads to Cloudinary using the config helper
  - Returns object: { imageUrl: secure_url, public_id, filename: originalFilename }
  - Throws descriptive errors

- Create async function deleteImage that:
  - Accepts: public_id
  - Calls Cloudinary delete helper
  - Returns success status

- Create async function updatePostCoverImage that:
  - Accepts: postId, imageUrl, public_id
  - Updates posts table coverImage column with imageUrl
  - Stores public_id in a new table or returns it
  - Returns updated post

Export all functions
```

---

### 6️⃣ Create Upload Controller

**File:** `/backend/src/controllers/uploadController.js`

**Prompt for Copilot:**

```txt
Create upload controller at /backend/src/controllers/uploadController.js

Requirements:
- Import imageService, error handling middleware
- Create async uploadImage function that:
  - Extracts file from req.file
  - Validates file exists, throw 400 if not
  - Calls imageService.processAndUploadImage()
  - Returns response with: { success: true, imageUrl, public_id, message: "Image uploaded successfully" }
  - Catches errors and returns 500 with error message

- Create async uploadBlogCover function that:
  - Extracts postId from req.body
  - Extracts file from req.file
  - Calls processAndUploadImage()
  - Calls updatePostCoverImage()
  - Returns updated post with coverImage field

- Create async deleteImage function that:
  - Extracts public_id from req.body
  - Calls imageService.deleteImage()
  - Returns: { success: true, message: "Image deleted successfully" }

- Add proper error handling and validation
- Return descriptive error messages

Export all functions
```

---

### 7️⃣ Create Upload Routes

**File:** `/backend/src/routes/upload.routes.js`

**Prompt for Copilot:**

```txt
Create upload routes at /backend/src/routes/upload.routes.js

Requirements:
- Import: express, uploadController, multerMiddleware, fileTypeValidation, authMiddleware
- Create router
- Define routes:

  POST /upload
  - Middleware: authMiddleware, multerMiddleware.uploadSingleImage, validateImageType.validateImage
  - Controller: uploadController.uploadImage
  - Returns: { success, imageUrl, public_id }

  POST /upload/blog-cover
  - Middleware: authMiddleware, multerMiddleware.uploadSingleImage, validateImageType.validateImage
  - Body: { postId }
  - Controller: uploadController.uploadBlogCover
  - Returns: updated post object with coverImage

  DELETE /upload/image
  - Middleware: authMiddleware
  - Body: { public_id }
  - Controller: uploadController.deleteImage
  - Returns: { success, message }

- Add proper error handling on routes
- Export router
```

---

### 8️⃣ Register Routes in Backend

**File:** `/backend/src/index.js`

**Prompt for Copilot:**

```txt
Update /backend/src/index.js to register upload routes:

Requirements:
- Import uploadRoutes from /backend/src/routes/upload.routes.js
- Add: app.use('/api/upload', uploadRoutes)
- Add this after other route registrations (auth, posts, etc.)
```

---

### ✅ TEST BACKEND WITH POSTMAN

Before moving to frontend, test:

1. **POST /api/upload**
   - Send multipart/form-data with image file
   - Should return: { success: true, imageUrl, public_id }

2. **POST /api/upload/blog-cover**
   - Send multipart/form-data with image + postId in body
   - Should return updated post with coverImage field

3. **DELETE /api/upload/image**
   - Send { public_id }
   - Should return: { success: true }

---

## 🔹 PHASE 2 — FRONTEND

### 9️⃣ Install Frontend Dependencies

```bash
cd frontend
npm install react-dropzone browser-image-compression mime-types
```

---

### 🔟 Create Image Upload Config

**File:** `/frontend/src/lib/imageUploadConfig.js`

**Prompt for Copilot:**

```txt
Create image upload config at /frontend/src/lib/imageUploadConfig.js

Requirements:
- Define constant ACCEPTED_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif'
  ]

- Define constant MAX_FILE_SIZE = 5 * 1024 * 1024 (5MB in bytes)

- Define constant IMAGE_COMPRESSION_OPTIONS = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    compressFormat: 'webp',
    useWebWorker: true
  }

- Create function validateFileType(file):
  - Check file.type is in ACCEPTED_MIME_TYPES
  - Return object: { valid: boolean, error?: string }

- Create function validateFileSize(file):
  - Check file.size <= MAX_FILE_SIZE
  - Return object: { valid: boolean, error?: string }

- Export all constants and functions
```

---

### 1️⃣1️⃣ Create useImageUpload Hook

**File:** `/frontend/src/hooks/useImageUpload.js`

**Prompt for Copilot:**

```txt
Create custom hook at /frontend/src/hooks/useImageUpload.js

Requirements:
- Import: useState, axios, imageCompression, imageUploadConfig

- Return object with:
  - uploadProgress: number (0-100)
  - isUploading: boolean
  - error: string | null
  - uploadedImage: { imageUrl, public_id } | null

- Create async function uploadImage(file):
  - Validate file type using config
  - Validate file size using config
  - Set error state if validation fails, return early
  - Set isUploading = true
  - Compress image using browser-image-compression
  - Create FormData with compressed file
  - Call POST /api/upload with axios
  - Track upload progress in uploadProgress state
  - On success: set uploadedImage and clear error
  - On error: set error state
  - Finally: set isUploading = false

- Create async function uploadBlogCover(file, postId):
  - Similar flow but calls POST /api/upload/blog-cover
  - Include postId in FormData
  - Returns updated post object

- Create async function deleteImage(public_id):
  - Calls DELETE /api/upload/image
  - Returns success status

- Export hook
```

---

### 1️⃣2️⃣ Create Drag-Drop Component

**File:** `/frontend/src/components/ImageUpload/DragDropZone.jsx`

**Prompt for Copilot:**

```txt
Create drag-drop component at /frontend/src/components/ImageUpload/DragDropZone.jsx

Requirements:
- Import: useCallback, useImageUpload, react-dropzone, useState

- Create DragDropZone component that:
  - Accepts props: onUploadComplete, onError, maxSize (optional)
  - Uses useImageUpload hook
  - Uses useDropzone with:
    - accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif'] }
    - maxSize: maxSize prop or 5MB
    - multiple: false (single file)

  - Renders:
    - Drag-over area with visual feedback
    - File input (hidden)
    - Preview of selected image
    - Upload button
    - Progress bar showing uploadProgress
    - Error message if upload fails
    - Success message when upload completes

  - On drop:
    - Upload image using hook
    - Call onUploadComplete callback with { imageUrl, public_id }
    - Show error via onError callback if it fails

- Style with Tailwind CSS
- Make fully responsive
- Show loading state during upload
- Clear previous errors on new drop
```

---

### 1️⃣3️⃣ Create Upload Progress Component

**File:** `/frontend/src/components/ImageUpload/ImageUploadProgress.jsx`

**Prompt for Copilot:**

```txt
Create progress component at /frontend/src/components/ImageUpload/ImageUploadProgress.jsx

Requirements:
- Import: necessary React hooks

- Create ImageUploadProgress component that:
  - Accepts props: progress (0-100), isUploading (boolean), error (string | null)

  - Renders:
    - Progress bar that fills from 0 to 100
    - Percentage text showing progress
    - Loading spinner while isUploading = true
    - Error message in red if error exists
    - Success message in green when progress = 100 and !isUploading
    - Smooth animations

- Use Tailwind CSS
- Make responsive and visually consistent with WriteWise design
```

---

### 1️⃣4️⃣ Integrate with Blog Editor

**File:** Update existing blog editor component or create `/frontend/src/components/BlogEditor/EditorWithImageUpload.jsx`

**Prompt for Copilot:**

```txt
Integrate image upload into the blog editor:

Requirements:
- Import DragDropZone component
- Import useImageUpload hook
- In editor component, add:

  - A section with DragDropZone for inserting images into content
  - When onUploadComplete fires with imageUrl:
    - Insert markdown/HTML image syntax into editor content
    - Example: ![alt](imageUrl)
  - Show error notifications if upload fails
  - Keep editor responsive during upload
  - Support multiple image insertions

- For inline images in editor:
  - Add button to trigger image upload
  - Insert uploaded image URL at cursor position
  - Support copy-paste of image URLs

- Make sure editor still functions during image processing
```

---

### 1️⃣5️⃣ Integrate Blog Cover Image Upload

**File:** Update post creation/editing component

**Prompt for Copilot:**

```txt
Integrate cover image upload to blog post creation:

Requirements:
- Import DragDropZone component
- Import useImageUpload hook
- Add DragDropZone in post form with:
  - Label: "Add Cover Image"
  - onUploadComplete: save coverImage to state
  - Show uploaded image preview
  - Allow replacing image by dragging new one

- When uploading cover:
  - Use uploadBlogCover from hook
  - Pass postId to hook
  - Save imageUrl to post.coverImage field
  - Update database immediately if post exists

- Display cover image preview with:
  - Option to remove
  - Option to replace
  - Aspect ratio: 16:9 or 21:9

- Include in both:
  - New post creation
  - Existing post editing
```

---

## 🔹 PHASE 3 — DATABASE & CLEANUP

### 1️⃣6️⃣ Database Schema

**Already exists:** `coverImage` column in `posts` table

**Prompt for Copilot:**

```txt
Verify Prisma schema has:

- posts table with:
  - coverImage: String (stores Cloudinary URL)
  - coverImagePublicId: String (optional, stores public_id for deletion)

If not present, create migration to add these columns.

No other changes needed - coverImage already exists.
```

---

### 1️⃣7️⃣ Image Cleanup on Post Deletion

**File:** Update `/backend/src/services/postService.js`

**Prompt for Copilot:**

```txt
Update postService to delete cover images when posts are deleted:

Requirements:
- In deletePost function:
  - Before deleting post from database
  - Extract coverImagePublicId or use another method to get public_id
  - Call imageService.deleteImage(public_id)
  - Handle error gracefully (don't block post deletion if image delete fails)
  - Then proceed with post deletion from database

- This prevents orphaned images in Cloudinary
```

---

## ✅ FINAL CHECKLIST

Before deployment, verify:

- [x] Cloudinary credentials in `.env`
- [x] All dependencies installed (backend + frontend)
- [x] Backend upload endpoint tested with Postman
- [x] MIME type spoofing is blocked
- [x] Images are compressed and optimized
- [x] Upload progress UI shows during upload
- [x] Only URLs stored in database (no base64)
- [x] Drag-drop UI is responsive on mobile
- [x] Error messages are user-friendly
- [x] Cover image displays correctly in posts
- [x] Images deleted from Cloudinary when post is deleted
- [x] Multiple image insertions work in editor

---

## 🧪 Testing Commands

**Backend Testing:**

```bash
# Test single image upload
curl -X POST http://localhost:8888/api/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/image.jpg"

# Test blog cover upload
curl -X POST http://localhost:8888/api/upload/blog-cover \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/image.jpg" \
  -F "postId=123"

# Test image deletion
curl -X DELETE http://localhost:8888/api/upload/image \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"public_id":"folder/image_id"}'
```

---

## 📚 Environment Variables

Add to `/backend/.env`:

```env
# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Upload Config
MAX_IMAGE_SIZE=5242880  # 5MB
NODE_ENV=development
```

---

## 🔗 API Endpoints Summary

| Method | Endpoint | Auth | Body | Response |
|--------|----------|------|------|----------|
| POST | `/api/upload` | ✓ | `file` (multipart) | `{ success, imageUrl, public_id }` |
| POST | `/api/upload/blog-cover` | ✓ | `file` + `postId` | Updated post object |
| DELETE | `/api/upload/image` | ✓ | `{ public_id }` | `{ success, message }` |

---

## 📝 Notes

- All image uploads go through compression before Cloudinary
- Cloudinary handles CDN delivery automatically
- Database only stores URLs, not files
- public_id is used for deletion from Cloudinary
- Mobile responsiveness is critical for drag-drop UX
- Consider adding image optimization settings in frontend config

---

**Document Created:** January 15, 2026
**Status:** Ready for Implementation
**Follow Phase Order Strictly**
