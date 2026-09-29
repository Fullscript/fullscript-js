/* eslint-disable @typescript-eslint/naming-convention */
const EVENT_TYPES = {
  "treatmentPlan.activated": "treatmentPlan.activated",
  "patient.selected": "patient.selected",
  "order.checkoutStarted": "order.checkoutStarted",
};

type EventType = keyof typeof EVENT_TYPES;

type PatientPayload = {
  patient: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
    gender: string;
    discount: number;
    totalDiscount: number;
    mobileNumber: string;
    textMessageNotification: boolean;
  };
};

type TreatmentPlanPayload = {
  treatmentPlan: {
    id: string;
    state: string;
    patient: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
    practitioner: {
      id: string;
    };
    availableAt: string;
    recommendations: {
      variantId: string;
      refill: boolean;
      unitsToPurchase: number;
      dosage: {
        recommendedAmount: string;
        recommendedFrequency: string;
        recommendedDuration: string;
        format: string;
        additionalInfo: string;
      };
    }[];
    labRecommendations: {
      id: string;
      name: string;
      instructions: string;
      requiresFasting: boolean;
      tests: {
        id: string;
        name: string;
      }[];
    }[];
  };
};

type OrderPayload = {
  order: {
    id: string;
    practitionerPay: boolean;
    treatmentPlan: TreatmentPlanPayload["treatmentPlan"];
  };
};

// Indexing with `E` means adding an entry to EVENT_TYPES without one here is a compile error
type EventPayloads = {
  "treatmentPlan.activated": TreatmentPlanPayload;
  "patient.selected": PatientPayload;
  "order.checkoutStarted": OrderPayload;
};

type EventListenerPayload<E extends EventType> = {
  id: string;
  type: E;
  data: EventPayloads[E];
  createdAt: string;
  clinicId: string;
  oauth: {
    clientId: string;
  };
};

type EventListenerCallback<E extends EventType> = (data: EventListenerPayload<E>) => void;

type EventListenerFunction = <E extends EventType>(
  eventType: E,
  callback: EventListenerCallback<E>
) => void;

export {
  EventListenerFunction,
  EventListenerCallback,
  EventListenerPayload,
  TreatmentPlanPayload,
  PatientPayload,
  OrderPayload,
  EventType,
  EVENT_TYPES,
};
