/// <reference types="./parcel" />
import Parcel from '@parcel/core';
import defaultConfig from '../index.json';
import { join } from 'path';
import { readFileSync } from 'fs';

process.chdir(__dirname);

const fp = (...p: string[]): string => join(__dirname, ...p);

const outDir = fp('tmp', Date.now().toString(36));
const cacheDir = join(outDir, 'cache');

const parcel = new Parcel({
  entries: [fp('index.html')],
  defaultConfig: {
    ...defaultConfig,
    extends: ['@parcel/config-default'],
    filePath: require.resolve('@parcel/config-default')
  },
  cacheDir,
  distDir: outDir
});
jest.setTimeout(120000); // Thanks, Parcel 2
test('Integrated correctly', async () => {
  await parcel.run();
  expect(
    readFileSync(join(outDir, 'sw.js')).toString()
  ).toMatchSnapshot();
});
