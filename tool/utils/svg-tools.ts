/* eslint-disable no-useless-escape */
import { optimize } from 'svgo';

// Adapted from https://github.com/developit/htmlParser
const SPLIT_ATTRIBUTES_REGEX = /([a-z0-9_\:\-]*)\s*?=\s*?(['"]?)(.*?)\2\s+/gim;
const DOM_PARSER_REGEX =
  /(?:<(\/?)([a-zA-Z][a-zA-Z0-9\:]*)(?:\s([^>]*?))?((?:\s*\/)?)>|(<\!\-\-)([\s\S]*?)(\-\->)|(<\!\[CDATA\[)([\s\S]*?)(\]\]>))/gm;

function splitAttrs(str: string) {
  const res: any = {};
  SPLIT_ATTRIBUTES_REGEX.lastIndex = 0;
  str = ' ' + (str || '') + ' ';

  let token;
  while ((token = SPLIT_ATTRIBUTES_REGEX.exec(str))) {
    res[token[1]] = token[3];
  }

  return res;
}

function parseSvg(contents: string) {
  DOM_PARSER_REGEX.lastIndex = 0;
  let result = contents;
  let token;
  while ((token = DOM_PARSER_REGEX.exec(contents))) {
    const tag = token[2];
    if (tag === 'svg') {
      const attrs = splitAttrs(token[3]);
      result = contents
        .slice(DOM_PARSER_REGEX.lastIndex)
        .replace(/<\/svg>/gim, '')
        .trim();
      const value = { innerHTML: result, defaultProps: attrs };
      return value;
    }
  }

  return null;
}

export function optimizeSvg(contents: string): string {
  const { data } = optimize(contents, {
    plugins: [
      'removeDoctype',
      'removeXMLProcInst',
      'removeComments',
      'removeMetadata',
      'removeXMLNS',
      'removeEditorsNSData',
      'cleanupAttrs',
      'minifyStyles',
      'convertStyleToAttrs',
      {
        name: 'addClassesToSVGElement',
        params: {
          className: 'kodesiana-icon',
        },
      },
      'removeRasterImages',
      'removeUselessDefs',
      'cleanupNumericValues',
      'cleanupListOfValues',
      'convertColors',
      'removeUnknownsAndDefaults',
      'removeNonInheritableGroupAttrs',
      'removeUselessStrokeAndFill',
      'removeViewBox',
      'cleanupEnableBackground',
      'removeHiddenElems',
      'removeEmptyText',
      'convertShapeToPath',
      'moveElemsAttrsToGroup',
      'moveGroupAttrsToElems',
      'collapseGroups',
      'convertPathData',
      'convertTransform',
      'removeEmptyAttrs',
      'removeEmptyContainers',
      'mergePaths',
      'removeUnusedNS',
      'sortAttrs',
      'removeTitle',
      'removeDesc',
      'removeDimensions',
      'removeStyleElement',
      'removeScriptElement',
    ],
  });

  return data;
}
