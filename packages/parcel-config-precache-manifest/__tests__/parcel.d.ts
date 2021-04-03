declare module '@parcel/core' {
  export interface ParcelOptions {
    entries: string | string[];
    defaultTargetOptions: {
      distDir: string;
    };
    cacheDir: string;
    defaultConfig: string;
  }
  export default class Parcel {
    constructor(opts: ParcelOptions);
    run(): Promise<void>;
  }
}
