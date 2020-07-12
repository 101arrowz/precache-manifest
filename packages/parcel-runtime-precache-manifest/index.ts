import { Runtime } from '@parcel/plugin';

type Precache = {
  url: string;
  revision: string | null;
};

export default new Runtime({
  async apply({
    bundle: {
      target: { publicUrl }
    },
    bundleGraph
  }) {
    const manifest: Precache[] = [];
    if (!publicUrl.endsWith('/')) publicUrl += '/';

    for (const bundle of bundleGraph.getBundles()) {
      if (bundle.name.endsWith('index.html')) {
        // These should never have the `index.html` at the end
        bundle.name = bundle.name.slice(0, -10);
      }
      if (bundle.env.context !== 'service-worker') {
        manifest.push({
          url: publicUrl + bundle.name,
          revision: bundle.hashReference
        });
      }
    }

    return {
      filePath: 'precache-manifest.js',
      code: `self.__precacheManifest = ${JSON.stringify(manifest)}`,
      isEntry: true
    };
  }
});
