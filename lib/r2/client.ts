// =============================================================
// Lassana LK — Cloudflare R2 Client (Server-Side Only)
// =============================================================

import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  type PutObjectCommandInput,
} from "@aws-sdk/client-s3";

/**
 * ⚠️ SERVER-SIDE ONLY — NEVER import this in client components.
 *
 * R2 is S3-compatible, so we use the AWS SDK.
 */
function getR2Client(): S3Client {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error(
      "Missing R2 credentials. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, " +
        "and R2_SECRET_ACCESS_KEY in environment variables."
    );
  }

  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

function getBucketName(): string {
  const bucket = process.env.R2_BUCKET_NAME;
  if (!bucket) {
    throw new Error("Missing R2_BUCKET_NAME environment variable.");
  }
  return bucket;
}

/**
 * Get the public CDN URL for an R2 object key.
 */
export function getPublicUrl(key: string): string {
  const publicUrl = process.env.R2_PUBLIC_URL;
  if (!publicUrl) {
    throw new Error("Missing R2_PUBLIC_URL environment variable.");
  }
  return `${publicUrl.replace(/\/$/, "")}/${key}`;
}

/**
 * Upload a file to R2.
 * @param key - The object key (e.g., "products/abc/main.webp")
 * @param body - The file buffer
 * @param contentType - The MIME type
 * @returns The public URL of the uploaded file
 */
export async function uploadToR2(
  key: string,
  body: Buffer | Uint8Array,
  contentType: string
): Promise<string> {
  const client = getR2Client();
  const bucket = getBucketName();

  const params: PutObjectCommandInput = {
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentType: contentType,
    CacheControl: "public, max-age=31536000, immutable",
  };

  await client.send(new PutObjectCommand(params));

  return getPublicUrl(key);
}

/**
 * Delete a file from R2.
 * @param key - The object key to delete
 */
export async function deleteFromR2(key: string): Promise<void> {
  const client = getR2Client();
  const bucket = getBucketName();

  await client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  );
}

/**
 * Generate a unique object key for product media.
 * @param productId - The product UUID
 * @param filename - Original filename
 * @param type - "images" or "videos"
 */
export function generateProductMediaKey(
  productId: string,
  filename: string,
  type: "images" | "videos"
): string {
  const timestamp = Date.now();
  const sanitized = filename
    .toLowerCase()
    .replace(/[^a-z0-9.]/g, "-")
    .replace(/-+/g, "-");
  return `products/${productId}/${type}/${timestamp}-${sanitized}`;
}

/**
 * Generate a unique object key for category images.
 */
export function generateCategoryMediaKey(
  categoryId: string,
  filename: string
): string {
  const timestamp = Date.now();
  const sanitized = filename
    .toLowerCase()
    .replace(/[^a-z0-9.]/g, "-")
    .replace(/-+/g, "-");
  return `categories/${categoryId}/${timestamp}-${sanitized}`;
}

/**
 * Generate a unique object key for review images.
 */
export function generateReviewMediaKey(
  reviewId: string,
  filename: string
): string {
  const timestamp = Date.now();
  const sanitized = filename
    .toLowerCase()
    .replace(/[^a-z0-9.]/g, "-")
    .replace(/-+/g, "-");
  return `reviews/${reviewId}/${timestamp}-${sanitized}`;
}
