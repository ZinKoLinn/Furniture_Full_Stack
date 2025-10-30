import { Queue } from "bullmq";

import { redis } from "../../../config/redisClient";

const imageQuene = new Queue("imageQueue", { connection: redis });

export default imageQuene;
