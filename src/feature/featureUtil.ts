import { FULLSCRIPT_DOMAINS, FullscriptOptions } from "../fullscript";
import { validateFeatureType } from "../fullscriptJsValidator";
import { buildQueryString } from "../utils";

import { FEATURE_PATHS } from "./featurePath";
import { ENTRYPOINTS, FeatureType, FeatureOptions } from "./featureType";

const getValidFeatureOptions = (
  featureType: FeatureType,
  featureOptions: FeatureOptions<FeatureType>
) => {
  if ("entrypoint" in featureOptions) {
    if (featureType === "treatmentPlan" || !ENTRYPOINTS.includes(featureOptions.entrypoint)) {
      const { entrypoint: _removed, ...validOptions } = featureOptions;
      return validOptions;
    }
  }

  return featureOptions;
};
const getFeatureURL = async <F extends FeatureType>(
  featureType: F,
  featureOptions: FeatureOptions<F>,
  fullscriptOptions: FullscriptOptions,
  frameId: string
): Promise<string> => {
  const { publicKey, env, domain } = fullscriptOptions;

  const queryString = await buildQueryString({
    ...getValidFeatureOptions(featureType, featureOptions),
    fullscriptOptions,
    publicKey,
    frameId,
  });
  validateFeatureType(featureType);
  const fsDomain = domain ?? FULLSCRIPT_DOMAINS[env];

  return `${fsDomain}/api/embeddable/session${FEATURE_PATHS[featureType]}${queryString}&target_origin=${window.location.origin}`;
};

export { getFeatureURL };
