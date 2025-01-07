import path from "node:path";
import { open, rm, mkdir, FileHandle } from "node:fs/promises";

import { IUptimeNodeData, IFullUptimeData } from "../lib/storage/uptime";

/**
 * OutputFileWriter - This class handles writing the output JSON files.
 *
 * It handles splitting/chunking the data into smaller files for easier loading.
 *
 */

// love you all

export type IMetaDataOutput = {
  instances: number;
  communities: number;
  mbin_instances: number; // @ NEW
  magazines: number;
  fediverse: number;

  time: number;
  package: string;
  version: string;

  linked?: any;
  allowed?: any;
  blocked?: any;
};

export type IInstanceDataOutput = {
  baseurl: string;
  url: string;
  name: string;
  desc: string;
  downvotes: boolean;
  nsfw: boolean;
  create_admin: boolean;
  private: boolean;
  fed: boolean;
  version: string;
  open: boolean;
  usage: number;
  counts: Object;
  icon: string;
  banner: string;
  langs: string[];
  date: string;
  published: number;
  time: number;
  score: number;
  uptime?: IUptimeNodeData;
  isSuspicious: boolean;
  metrics: Object | null;
  tags: string[];
  susReason: string[];
  trust: [];
  blocks: {
    incoming: number;
    outgoing: number;
  };
  blocked: string[];
};

export type ICommunityDataOutput = {
  baseurl: string;
  url: string;
  name: string;
  title: string;
  desc: string;
  icon: string | null;
  banner: string | null;
  nsfw: boolean;
  counts: Object;
  published: number;
  time: number;
  isSuspicious: boolean;
  score: number;
};

export type IMBinInstanceOutput = {
  // actor_id: string;
  // title: string;
  // name: string;
  // preferred: string;
  // baseurl: string;
  // summary: string;
  // sensitive: boolean;
  // postingRestrictedToMods: boolean;
  // icon: string;
  // published: string;
  // updated: string;
  // followers: number;
  // time: number;
};

export type IMBinMagazineOutput = {
  baseUrl: string;
  magazineId: number;
  title: string;
  name: string;
  description: string;
  isAdult: boolean;
  postingRestrictedToMods: boolean;
  icon: string;
  subscriptions: number;
  posts: number;
  time: number;
};

export type IFediverseDataOutput = {
  url: string;
  software: string;
  version: string;
};

export type IClassifiedErrorOutput = {
  baseurl: string;
  time: number;
  error: string;
  type?: string;
};

// type IInstanceOutput = {};

// // minified version, only enough for sort/filter
// // {
// //     "base": "lemmy.ml",
// //     "title": "Lemmy!",
// //     "name": "lemmy",
// //     "desc": "lemmy instance is cool and stuff!",
// //     "sort": {
// //       "score": 724,  //smart sort
// //       "subscribers": 1,
// //       "users": "users_active_week",
// //       "posts": 0,
// //       "comments": 0,
// //      }
// // }
// type IInstanceMinOutput = {};
// type IInstanceMetaOutput = {};

// type ICommunityOutput = {};
// type ICommunityMinOutput = {};

// type IMagazineOutput = {};

// split communities.json and instances.json into smaller files for easier loading

// community-index.json
// {
//     "baseurl": "lemmy.world",
//     "url": "https://lemmy.world/c/dua_lipa",
//     "name": "dua_lipa",
//     "title": "Dualipa",
//     "desc": "",
//     "icon": null,
//     "banner": null,
//     "nsfw": false,
//     "counts": {
//       "id": 10634,
//       "community_id": 30413,
//       "subscribers": 1,
//       "posts": 0,
//       "comments": 0,
//       "published": "2023-06-23T11:16:56.018957",
//       "users_active_day": 0,
//       "users_active_week": 0,
//       "users_active_month": 0,
//       "users_active_half_year": 0,
//       "hot_rank": 7
//     },
//     "time": 1687658284587,
//     "isSuspicious": false,
//     "score": 724
//   }

// instance-index.json

// should do all the things needed to transform the redis data into data for frontend
export default class OutputFileWriter {
  private publicDataFolder: string;
  private metricsPath: string;
  private communityMetricsPath: string;

  private communitiesPerFile: number;
  private instancesPerFile: number;
  private magazinesPerFile: number;

  constructor() {
    this.publicDataFolder = `../frontend/public/data`;

    // stores a .meta file for each instance
    this.metricsPath = `${this.publicDataFolder}/metrics`;

    // stores a .meta file for each community under instance DIR
    this.communityMetricsPath = `${this.publicDataFolder}/community-metrics`;

    // tuning the amount of entries per-file
    this.communitiesPerFile = 500;
    this.instancesPerFile = 100;
    this.magazinesPerFile = 500;
  }

  async storeInstanceData(instanceArray) {
    await this.storeChunkedData("instance", this.instancesPerFile, instanceArray);

    // minified version, just names and base urls
    const minInstanceArray = instanceArray.map((instance) => {
      return {
        name: instance.name,
        base: instance.baseurl,
        score: instance.score,
      };
    });

    await this.writeJsonFile(`${this.publicDataFolder}/instance.min.json`, JSON.stringify(minInstanceArray));
  }

  async storeCommunityData(communityArray) {
    await this.storeChunkedData("community", this.communitiesPerFile, communityArray);

    for (let i = 0; i < communityArray.length; i++) {
      await this.storeCommunityMetricsData(communityArray[i].baseurl, communityArray[i]);
    }
  }

  /**
   * this method is used to store the fediverse data
   */
  public async storeFediverseData(data: any, softwareData: any, softwareBaseUrls: any, fediTags: any) {
    await this.writeJsonFile(`${this.publicDataFolder}/fediverse.json`, JSON.stringify(data));
    await this.writeJsonFile(
      `${this.publicDataFolder}/fediverse_software_counts.json`,
      JSON.stringify(softwareData),
    );
    await this.writeJsonFile(
      `${this.publicDataFolder}/fediverse_software_sites.json`,
      JSON.stringify(softwareBaseUrls),
    );

    // write tags meta
    await this.writeJsonFile(`${this.publicDataFolder}/tags.meta.json`, JSON.stringify(fediTags));
  }

  /**
   * this method is used to store the instance metrics data
   */
  public async storeInstanceMetricsData(instanceBaseUrl: String, data: any) {
    await mkdir(this.metricsPath, {
      recursive: true,
    });

    await this.writeJsonFile(`${this.metricsPath}/${instanceBaseUrl}.meta.json`, JSON.stringify(data));
  }

  /**
   * this method is used to store the community metrics data
   */
  public async storeCommunityMetricsData(instanceBaseUrl: string, communityData: any) {
    // make sure the directory exists for the instance
    await mkdir(`${this.communityMetricsPath}/${instanceBaseUrl}`, {
      recursive: true,
    });

    await this.writeJsonFile(
      `${this.communityMetricsPath}/${instanceBaseUrl}/${communityData.name}.meta.json`,
      JSON.stringify(communityData),
    );
  }

  public async storeMetaData(data: IMetaDataOutput) {
    await this.writeJsonFile(`${this.publicDataFolder}/meta.json`, JSON.stringify(data));
  }

  public async storeInstanceErrors(data: any) {
    await this.writeJsonFile(`${this.publicDataFolder}/instanceErrors.json`, JSON.stringify(data));
  }

  public async storeSuspicousData(data: any) {
    await this.writeJsonFile(`${this.publicDataFolder}/sus.json`, JSON.stringify(data));
  }

  // stores an array of the string baseUrl
  public async storeMBinInstanceData(data: string[]) {
    await this.writeJsonFile(`${this.publicDataFolder}/kbin.min.json`, JSON.stringify(data));
  }

  public async storeMBinMagazineData(data: any) {
    await this.storeChunkedData("magazines", this.magazinesPerFile, data);
  }

  /**
   * this method is used to clean (delete all files) the data folder
   */
  public async cleanData(): Promise<void> {
    await rm(this.publicDataFolder, { recursive: true, force: true });
    await mkdir(this.publicDataFolder, { recursive: true });
  }

  /**
   * this method is used to split the data into smaller files for easier loading
   */
  private async storeChunkedData(chunkName: string, perFile: number, dataArray: []): Promise<void> {
    await this.writeJsonFile(`${this.publicDataFolder}/${chunkName}.full.json`, JSON.stringify(dataArray));

    // mapped versions and the metadata
    await mkdir(path.join(this.publicDataFolder, chunkName), {
      recursive: true,
    });

    let fileCount = 0;
    for (let i = 0; i < dataArray.length; i += perFile) {
      let chunk = dataArray.slice(i, i + perFile);

      await this.writeJsonFile(
        `${this.publicDataFolder}/${chunkName}/${fileCount}.json`,
        JSON.stringify(chunk),
      );
      fileCount++;
    }

    await this.writeJsonFile(
      `${this.publicDataFolder}/${chunkName}.json`,
      JSON.stringify({
        count: fileCount,
      }),
    );
  }

  /**
   * this method is used to write a JSON file
   */
  private async writeJsonFile(fileName: string, data: string): Promise<void> {
    let filehandle: FileHandle | null = null;
    try {
      filehandle = await open(fileName, "w");

      await filehandle?.writeFile(data);
    } finally {
      await filehandle?.close();
    }
  }
}
