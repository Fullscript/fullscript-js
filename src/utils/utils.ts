import { FULLSCRIPT_DOMAINS } from "../fullscript";

export type Params = { key: string; value: any } | any;

const removeChildren = (element: HTMLElement): void => {
  while (element.firstChild) {
    element.firstChild.remove();
  }
};

const snakeCase = (word: string): string => {
  return word
    .split(/(?=[A-Z])/g)
    .map(w => w.toLowerCase())
    .join("_");
};

const snakeCaseObjectKeys = (obj: any) => {
  return Object.keys(obj).reduce(
    (result, key) => ({
      ...result,
      [snakeCase(key)]: obj[key],
    }),
    {}
  );
};

const tokenizeData = async (patientInfo, fullscriptOptions) => {
  try {
    const { env, domain } = fullscriptOptions;
    const fsDomain = domain ?? FULLSCRIPT_DOMAINS[env];

    const tokenizedInfo = await fetch(`${fsDomain}/api/embeddable/tokenize`, {
      method: "POST",
      body: JSON.stringify({ data: patientInfo }),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      headers: { "Content-Type": "application/json" },
    }).then(res => res.json());

    if (typeof tokenizedInfo.data_token !== "string") throw new Error("Invalid response");

    return tokenizedInfo.data_token;
  } catch (error) {
    return null;
  }
};

const buildQueryString = async (params: Params): Promise<string> => {
  if (!Object.keys(params) || Object.keys(params).length === 0) return "";

  const { patient: patientInfo, fullscriptOptions, ...exposedParams } = params;
  let startingQueryString = "?";

  if (patientInfo) {
    const snakeCasePatient = snakeCaseObjectKeys(patientInfo);
    const dataToken = await tokenizeData(snakeCasePatient, fullscriptOptions);

    startingQueryString += `data_token=${encodeURIComponent(dataToken)}&`;
  }

  return Object.keys(exposedParams).reduce((queryString, key) => {
    let newParam = `${snakeCase(key)}=${exposedParams[key]}`;

    if (typeof exposedParams[key] !== "string") {
      newParam = Object.keys(exposedParams[key]).reduce(
        (objectParams, attribute, currentIndex): string => {
          const objectParam = `${snakeCase(key)}[${snakeCase(attribute)}]=${encodeURIComponent(
            exposedParams[key][attribute]
          )}`;

          if (currentIndex === 0) {
            return objectParam;
          }
          return `${objectParams}&${objectParam}`;
        },
        ""
      );
    }

    if (queryString !== startingQueryString) {
      newParam = `&${newParam}`;
    }

    return `${queryString}${newParam}`;
  }, startingQueryString);
};

export { removeChildren, buildQueryString };
