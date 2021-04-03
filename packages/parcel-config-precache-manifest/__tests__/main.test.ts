/// <reference types="./parcel" />
import Parcel from '@parcel/core';
import { join } from 'path';
import { readFileSync, existsSync } from 'fs';

process.chdir(__dirname);

const fp = (...p: string[]): string => join(__dirname, ...p);

const outDir = fp('tmp', Date.now().toString(36));
const cacheDir = join(outDir, 'cache');

const parcel = new Parcel({
  entries: [fp('index.html')],
  defaultConfig: require.resolve('@parcel/config-default'),
  defaultTargetOptions: {
    distDir: outDir
  },
  cacheDir
});
jest.setTimeout(120000); // Thanks, Parcel 2
test('Integrated correctly', async () => {
  await parcel.run();
  const self: {
    __precacheManifest: { url: string; revision: string }[] | null;
  } = { __precacheManifest: null };
  eval(readFileSync(join(outDir, 'sw.js')).toString());
  expect(self.__precacheManifest).not.toBeNull();
  expect(self.__precacheManifest).toBeInstanceOf(Array);
  for (const precacheItem of self.__precacheManifest!) {
    expect(precacheItem).not.toBeNull();
    expect(typeof precacheItem.revision).toBe('string');
    expect(existsSync(join(outDir, precacheItem.url.slice(1)))).toBe(true);
    expect(typeof precacheItem.revision).toBe('string');
  }
});
