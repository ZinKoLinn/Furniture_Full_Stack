import { Worker } from "bullmq";
import sharp from "sharp";
import path from "path";

import { redis } from "../../../config/redisClient";

const imageWorker = new Worker(
  "imageQueue",
  async (job) => {
    const { filePath, fileName, width, height, quality } = job.data;
    const optimizeFilePath = path.join(
      __dirname,
      "../../../",
      "uploads/optimize",
      fileName
    );
    await sharp(filePath)
      .resize(width, height)
      .webp({ quality: quality })
      .toFile(optimizeFilePath);
  },
  { connection: redis }
);

imageWorker.on("completed", (job) => {
  console.log(`Job completed with result ${job.id}`);
});

imageWorker.on("failed", (job: any, err) => {
  console.log(`Job ${job.id} failed with ${err.message}`);
});
