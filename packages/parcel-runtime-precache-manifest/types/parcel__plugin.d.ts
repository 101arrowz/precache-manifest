type SynthAsset = {
  filePath: string;
  code: string;
  isEntry: boolean;
};

type Async<T> = T | Promise<T>;

type Target = {
  publicUrl: string;
};

type Environment = {
  context: string;
}

type Bundle = {
  name: string;
  hashReference: string;
  type: string;
  target: Target;
  env: Environment;
  isInline: boolean;
};

type BundleGraph = {
  getBundles(): Bundle[];
};

declare module '@parcel/plugin' {
  export class Runtime {
    constructor(data: {
      apply(data: { bundle: Bundle, bundleGraph: BundleGraph }): Async<SynthAsset | void>;
    });
  }
}