import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME;
const publicBaseUrl = process.env.R2_PUBLIC_BASE_URL;

if (!accountId || !accessKeyId || !secretAccessKey || !bucketName || !publicBaseUrl) {
  throw new Error("Missing Cloudflare R2 environment variables");
}

export const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export async function uploadPlatformImage(params: {
  buffer: Buffer;
  contentType: string;
  fileName: string;
}) {
  const key = `platforms/${Date.now()}-${params.fileName}`;

  await r2Client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: params.buffer,
      ContentType: params.contentType,
    }),
  );

  const url = `${publicBaseUrl}/${bucketName}/${key}`;

  return { key, url };
}

