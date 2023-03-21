import { WRAPPER_DIV_ID } from "../../../feature/featureType";

import * as styles from "./styles";

type DivAttributes = {
  id?: string;
  style?: { [key: string]: string };
  animate?: {
    keyframes: Keyframe[];
    keyframeOptions: KeyframeAnimationOptions;
  };
};

const createDiv = (attributes: DivAttributes): HTMLDivElement => {
  const div = document.createElement("div");

  div.setAttribute("id", attributes.id);
  div.animate(attributes.animate?.keyframes, attributes.animate?.keyframeOptions);
  if (div.style) {
    Object.assign(div.style, attributes.style);
  }

  return div;
};

const createWrapper = (): HTMLDivElement => {
  return createDiv({ id: WRAPPER_DIV_ID, style: styles.wrapper });
};

const createLoader = (): HTMLDivElement => {
  const loader = createDiv({
    id: "loader",
    style: styles.loader.base,
    animate: {
      keyframes: styles.loader.keyframes,
      keyframeOptions: styles.loader.keyframeOptions,
    },
  });

  return loader;
};

const createLoaderContainer = (): HTMLDivElement => {
  const loaderDiv = createDiv({ id: "loaderContainer", style: styles.loaderContainer });

  loaderDiv.appendChild(createLoader());

  return loaderDiv;
};

const createIframeContainer = (): HTMLDivElement => {
  return createDiv({ style: styles.iframeContainer });
};

export { createLoaderContainer, createWrapper, createIframeContainer };
