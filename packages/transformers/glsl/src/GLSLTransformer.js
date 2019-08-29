// @flow

import path from 'path';
import {Transformer} from '@parcel/plugin';
import {promisify} from '@parcel/utils';

export default new Transformer({
  async transform({asset, localRequire, config}) {
    if (!config) {
      return [asset];
    }

    const glslifyDeps = await localRequire('glslify-deps', asset.filePath);
    const cwd = path.dirname(asset.filePath);
    const depper = glslifyDeps({cwd});
    const depperInline = promisify(depper.inline.bind(depper));
    const content = await asset.getCode();
    const deps = await depperInline(content, cwd);
    deps.forEach(dep => {
      if (!dep.entry) {
        asset.addURLDependency(dep.file, {});
      }
    });

    const glslifyBundle = await localRequire('glslify-bundle', asset.filePath);
    const glsl = glslifyBundle(deps);
    asset.setCode(`module.exports=${JSON.stringify(glsl)};`);

    return [asset];
  }
});
