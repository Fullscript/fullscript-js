import { v4 as uuidv4 } from "uuid";

import { Dispatcher, Callback } from "../eventSystem";
import { FullscriptOptions } from "../fullscript";
import { validateFeatureEventType, validateMountPoint } from "../fullscriptJsValidator";
import { createIframe } from "../iframe";
import { removeChildren } from "../utils";

import { EventType, EventListenerCallback } from "./eventType";
import { FeatureType, FeatureOptions, Feature, WRAPPER_DIV_ID } from "./featureType";
import { getFeatureURL } from "./featureUtil";

const getFeature = <F extends FeatureType>(
  featureType: F,
  featureOptions: FeatureOptions<F>,
  fullscriptOptions: FullscriptOptions,
  dispatcher: Dispatcher
): Feature => {
  let mountPoint: HTMLElement;
  const frameId = uuidv4();

  // TODO: If we can only mount a feature once, throw an error if attempting to mount a second time
  const mount = async (elementId: string) => {
    const url = await getFeatureURL(featureType, featureOptions, fullscriptOptions, frameId);
    mountPoint = document.getElementById(elementId);
    validateMountPoint(mountPoint);

    if (!mountPoint.querySelector(`#${WRAPPER_DIV_ID}`)) {
      const iframe = createIframe(url);
      mountPoint.appendChild(iframe);
    }
  };

  const unmount = () => {
    removeChildren(mountPoint);
    dispatcher.unregisterAllFeatureEventListeners(frameId);
  };

  const on = <E extends EventType>(eventType: E, callback: EventListenerCallback<E>) => {
    validateFeatureEventType(eventType);
    dispatcher.registerEventListener(`${frameId}.${eventType}`, callback as Callback);
  };

  const off = <E extends EventType>(eventType: E, callback: EventListenerCallback<E>) => {
    validateFeatureEventType(eventType);
    dispatcher.unregisterEventListener(`${frameId}.${eventType}`, callback as Callback);
  };

  return { mount, unmount, on, off };
};

export { getFeature };
