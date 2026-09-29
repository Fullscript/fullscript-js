import { Client, createClient } from "./client";
import { initializeMessageListener, createDispatcher } from "./eventSystem";
import { FullscriptOptions } from "./fullscript";
import { validateFullscriptOptions } from "./fullscriptJsValidator";

export type {
  FeatureType,
  FEATURE_TYPES,
  EventType,
  EVENT_TYPES,
  EventListenerPayload,
  EventListenerCallback,
  TreatmentPlanPayload,
  PatientPayload,
  OrderPayload,
  PatientOptions,
  FeatureOptions,
} from "./feature";

export const Fullscript = (options: FullscriptOptions): Client => {
  validateFullscriptOptions(options);
  const eventDispatcher = createDispatcher();
  initializeMessageListener(options, eventDispatcher);
  return createClient(options, eventDispatcher);
};
