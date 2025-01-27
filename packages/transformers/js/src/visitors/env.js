import * as types from '@babel/types';
import {morph} from './utils';

export default {
  MemberExpression(node, {asset, env}) {
    // Inline environment variables accessed on process.env
    if (types.matchesPattern(node.object, 'process.env')) {
      let key = types.toComputedKey(node);
      if (types.isStringLiteral(key)) {
        // Try using the value from the passed env (either from new Parcel
        // options or from dotenv), and fall back to process.env
        let prop = env[key.value] ?? process.env[key.value];
        if (typeof prop !== 'function') {
          let value = types.valueToNode(prop);
          morph(node, value);
          asset.ast.isDirty = true;
          // asset.meta.env[key.value] = process.env[key.value];
        }
      }
    }
  }
};
