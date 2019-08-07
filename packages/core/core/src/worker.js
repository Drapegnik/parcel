// @flow strict-local

import type {Bundle, ParcelOptions} from './types';
import type BundleGraph from './BundleGraph';
import type {WorkerApi} from '@parcel/workers';

import Transformation, {type TransformationOpts} from './Transformation';
import PackagerRunner from './PackagerRunner';
import Validation, {type ValidationOpts} from './Validation';
import ParcelConfig from './ParcelConfig';
import registerCoreWithSerializer from './registerCoreWithSerializer';
import '@parcel/cache'; // register with serializer

registerCoreWithSerializer();

export function runTransform(workerApi: WorkerApi, opts: TransformationOpts) {
  return new Transformation({workerApi, ...opts}).run();
}

export function runValidate(workerApi: WorkerApi, opts: ValidationOpts) {
  return new Validation({workerApi, ...opts}).run();
}

export function runPackage(
  workerApi: WorkerApi,
  {
    bundle,
    bundleGraph,
    config,
    options
  }: {
    bundle: Bundle,
    bundleGraph: BundleGraph,
    config: ParcelConfig,
    options: ParcelOptions
  }
) {
  return new PackagerRunner({
    config,
    options
  }).writeBundle(bundle, bundleGraph);
}
