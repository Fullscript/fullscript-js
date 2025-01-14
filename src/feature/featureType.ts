import { EventListenerFunction } from "./eventType";

const FEATURE_TYPES = {
  treatmentPlan: "treatmentPlan",
  platform: "platform",
};

type FeatureType = keyof typeof FEATURE_TYPES;

type PatientOptions = {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobileNumber?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "prefer not to say";
  biologicalSex?: "male" | "female" | "prefer not to say";
  discount?: number;
};
type TreatmentPlanOptions = { patient?: PatientOptions; secretToken: string };

type FeatureOptions<F extends FeatureType> = F extends "treatmentPlan" | "platform"
  ? TreatmentPlanOptions
  : Record<any, never>;

interface Feature {
  mount: (elementId: string) => Promise<void>;
  unmount: () => void;
  on: EventListenerFunction;
  off: EventListenerFunction;
}

export {
  FeatureType,
  FeatureOptions,
  TreatmentPlanOptions,
  PatientOptions,
  Feature,
  FEATURE_TYPES,
};
