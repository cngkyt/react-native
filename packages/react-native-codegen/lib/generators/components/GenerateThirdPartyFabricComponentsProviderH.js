/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 * @format
 */

'use strict';

// File path -> contents

const FileTemplate = ({lookupFuncs}) => `
/*
 * This code was generated by [react-native-codegen](https://www.npmjs.com/package/react-native-codegen).
 *
 * Do not edit this file as changes may cause incorrect behavior and will be lost
 * once the code is regenerated.
 *
 * ${'@'}generated by GenerateRCTThirdPartyFabricComponentsProviderH
 */

#pragma GCC diagnostic push
#pragma GCC diagnostic ignored "-Wreturn-type-c-linkage"

#import <React/RCTComponentViewProtocol.h>

#ifdef __cplusplus
extern "C" {
#endif

Class<RCTComponentViewProtocol> RCTThirdPartyFabricComponentsProvider(const char *name);

#ifndef RCT_DYNAMIC_FRAMEWORKS

${lookupFuncs}

#endif

#ifdef __cplusplus
}
#endif

#pragma GCC diagnostic pop

`;
const LookupFuncTemplate = ({className, libraryName}) =>
  `
Class<RCTComponentViewProtocol> ${className}Cls(void) __attribute__((used)); // ${libraryName}
`.trim();
module.exports = {
  generate(schemas) {
    const fileName = 'RCTThirdPartyFabricComponentsProvider.h';
    const lookupFuncs = Object.keys(schemas)
      .map(libraryName => {
        const schema = schemas[libraryName];
        return Object.keys(schema.modules)
          .map(moduleName => {
            const module = schema.modules[moduleName];
            if (module.type !== 'Component') {
              return;
            }
            const components = module.components;
            // No components in this module
            if (components == null) {
              return null;
            }
            return Object.keys(components)
              .filter(componentName => {
                const component = components[componentName];
                return !(
                  component.excludedPlatforms &&
                  component.excludedPlatforms.includes('iOS')
                );
              })
              .map(componentName => {
                return LookupFuncTemplate({
                  className: componentName,
                  libraryName,
                });
              })
              .join('\n');
          })
          .filter(Boolean)
          .join('\n');
      })
      .join('\n');
    const replacedTemplate = FileTemplate({
      lookupFuncs,
    });
    return new Map([[fileName, replacedTemplate]]);
  },
};
