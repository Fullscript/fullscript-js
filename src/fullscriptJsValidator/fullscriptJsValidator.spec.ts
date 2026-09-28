// @ts-nocheck
import { FullscriptOptions } from "../fullscript";
import { errorMessage } from "../staticMessages";

import {
  validateFullscriptOptions,
  validateFeatureType,
  validateFeatureEventType,
  validateMountPoint,
} from "./fullscriptJsValidator";

describe("fullscriptValidator", () => {
  describe("validateFullscriptOptions", () => {
    let mockFullscriptOptions: FullscriptOptions;

    it("does not throw an error when env is valid", () => {
      mockFullscriptOptions = {
        publicKey: "publicKey",
        env: "ca",
      };

      expect(() => {
        validateFullscriptOptions(mockFullscriptOptions);
      }).not.toThrow(errorMessage.invalidEnv);
    });

    it("throws an error when env is not provided", () => {
      mockFullscriptOptions = {
        publicKey: "publicKey",
        env: "ca",
      };
      delete mockFullscriptOptions.env;

      expect(() => {
        validateFullscriptOptions(mockFullscriptOptions);
      }).toThrow(errorMessage.invalidEnv);
    });

    it("throws an error when env is invalid", () => {
      mockFullscriptOptions = {
        publicKey: "publicKey",
        // @ts-ignore - this is used to supress errors for testing invalid env
        env: "invalid-env",
      };

      expect(() => {
        validateFullscriptOptions(mockFullscriptOptions);
      }).toThrow(errorMessage.invalidEnv);
    });
  });

  describe("validateFeatureType", () => {
    it("does not throw an error if featureType is supported", () => {
      expect(() => {
        validateFeatureType("treatmentPlan");
      }).not.toThrow();
    });

    it("throws error if featureType is not supported", () => {
      const invalidFeature = "searchExecuted";
      expect(() => {
        validateFeatureType(invalidFeature);
      }).toThrow(errorMessage.invalidFeatureType(invalidFeature));
    });

    it("throws error if featureType is not a string", () => {
      const invalidFeature = 3;
      expect(() => {
        validateFeatureType(invalidFeature);
      }).toThrow(errorMessage.invalidFeatureType(invalidFeature));
    });
  });

  describe("validateFeatureEventType", () => {
    it.each(["treatmentPlan.activated", "patient.selected", "order.checkoutStarted"])(
      "does not throw an error if the featureEventType is %s",
      eventType => {
        expect(() => {
          validateFeatureEventType(eventType);
        }).not.toThrow();
      }
    );

    it("throws an error if the featureEventType is not treatmentPlan or a string", () => {
      const invalidEventType = "cancelled";
      expect(() => {
        validateFeatureEventType(invalidEventType);
      }).toThrow(errorMessage.invalidEventType(invalidEventType));
    });
  });

  describe("validateMountPoint", () => {
    it("does not throw an error if the provided elementId is defined", () => {
      const mockMountPoint = document.createElement("div");
      expect(() => {
        validateMountPoint(mockMountPoint);
      }).not.toThrow();
    });

    it("throws an error if the provided elementId is undefined", () => {
      document.getElementById = jest.fn(() => null);
      const undefinedMountPoint = undefined;
      expect(() => {
        validateMountPoint(undefinedMountPoint);
      }).toThrow(errorMessage.invalidMountPoint);
    });
  });
});
