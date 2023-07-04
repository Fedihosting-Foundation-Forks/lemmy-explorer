import logging from "../lib/logging.js";

import Queue from "bee-queue";

import storage from "../storage.js";

import { CrawlTooRecentError } from "../lib/error.js";
import { CRAWL_TIMEOUT } from "../lib/const.js";

import CommunityCrawler from "../crawl/community.js";

export default class SingleCommunityQueue {
  constructor(isWorker = false, queueName = "one_community") {
    this.queue = new Queue(queueName, {
      removeOnSuccess: true,
      removeOnFailure: true,
      isWorker,
    });

    // report failures!
    this.queue.on("failed", (job, err) => {
      logging.error(
        `SingleCommunityQueue Job ${job.id} failed with error ${err.message}`,
        job,
        err
      );
    });

    if (isWorker) this.process();
  }

  async createJob(baseUrl, communityName, onSuccess = null) {
    const trimmedUrl = baseUrl.trim();
    const job = this.queue.createJob({
      baseUrl: trimmedUrl,
      community: communityName,
    });

    logging.silly("one_CommunityQueue createJob", trimmedUrl);
    await job
      .timeout(CRAWL_TIMEOUT.COMMUNITY)
      .setId(`${trimmedUrl}-${communityName}`) // deduplicate
      .save();
    job.on("succeeded", (result) => {
      // logging.info(`Completed communityQueue ${job.id}`, instanceBaseUrl);
      onSuccess && onSuccess(result);
    });
  }

  async process() {
    this.queue.process(async (job) => {
      await storage.connect();

      let communityData = null;
      try {
        const baseUrl = job.data.baseUrl;
        const communityName = job.data.community;

        const crawler = new CommunityCrawler(baseUrl);

        communityData = await crawler.crawlSingle(communityName);
      } catch (error) {
        if (error instanceof CrawlTooRecentError) {
          logging.warn(
            `[OneCommunity] [${job.data.baseUrl}] CrawlTooRecentError: ${error.message}`
          );
        } else {
          const errorDetail = {
            error: error.message,
            stack: error.stack,
            isAxiosError: error.isAxiosError,
            requestUrl: error.isAxiosError ? error.request.url : null,
            time: Date.now(),
          };

          // if (error instanceof CrawlError || error instanceof AxiosError) {
          await storage.tracking.upsertError(
            "one_community",
            job.data.baseUrl,
            errorDetail
          );

          logging.error(
            `[OneCommunity] [${job.data.baseUrl}] Error: ${error.message}`
          );
        }
      }

      // close redis connection on end of job
      storage.close();
      return communityData;
    });
  }
}
