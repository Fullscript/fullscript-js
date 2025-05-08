import { Dispatcher, createDispatcher } from "../eventSystem";
import { FeatureType } from "../feature";
import { FullscriptOptions } from "../fullscript";

import { FeatureOptions } from "./featureType";

let mockCreateIframe;
let mockRemoveChildren;
let mockV4;
const initializeMocks = () => {
  jest.doMock("../utils", () => ({
    // eslint-disable-next-line
    __esModule: true,
    buildQueryString: () => "url",
    removeChildren: mockRemoveChildren,
  }));

  jest.doMock("../iframe", () => ({
    // eslint-disable-next-line
    __esModule: true,
    createIframe: mockCreateIframe,
  }));

  jest.doMock("uuid", () => ({
    v4: mockV4,
  }));

  jest.doMock("../iframe/loader/containers", () => ({
    // eslint-disable-next-line
    __esModule: true,
    createWrapper: () => document.createElement("div"),
    createLoaderContainer: () => document.createElement("div"),
    createIframeContainer: () => document.createElement("div"),
  }));
};

describe("featurea", () => {
  let mockMountPoint;
  let dispatcher: Dispatcher;
  let mockFullscriptOptions: FullscriptOptions;
  let mockFeatureType: FeatureType;
  let mockFeatureOptions: FeatureOptions<"treatmentPlan">;
  let mockFrameId: string;

  beforeEach(() => {
    mockMountPoint = document.createElement("div");
    mockCreateIframe = jest.fn(() => document.createElement("iframe"));
    mockRemoveChildren = jest.fn();
    mockFrameId = "uuid";
    mockV4 = jest.fn(() => mockFrameId);

    mockFullscriptOptions = {
      publicKey: "mockPublicKey",
      env: "us",
    };

    mockFeatureOptions = {
      patient: {
        id: "xxxx",
      },
      secretToken: "aaa",
    };

    mockFeatureType = "treatmentPlan";
    dispatcher = createDispatcher();

    document.getElementById = jest.fn(() => mockMountPoint);
    jest.resetModules(); // required when there are multiple mocks (mockCreateIframe, mockRemoveChildren )

    initializeMocks();
  });

  describe("mount", () => {
    it("calls the createIframe function when mount is called", () => {
      return import("./feature").then(async ({ getFeature }) => {
        // hoisting issue with jest.mocks()
        const feature = getFeature(
          mockFeatureType,
          mockFeatureOptions,
          mockFullscriptOptions,
          dispatcher
        );
        await feature.mount("someid");

        expect(mockCreateIframe).toBeCalled();
      });
    });

    it("appends child to the mountPoint when mount is called", () => {
      return import("./feature").then(async ({ getFeature }) => {
        mockMountPoint.appendChild = jest.fn();
        const feature = getFeature(
          mockFeatureType,
          mockFeatureOptions,
          mockFullscriptOptions,
          dispatcher
        );
        await feature.mount("someid");

        expect(mockMountPoint.appendChild).toBeCalled();
      });
    });
  });

  it("does not return an iframe and throws an error if the provided elementId is undefined", () => {
    document.getElementById = jest.fn(() => null);

    return import("./feature").then(async ({ getFeature }) => {
      mockMountPoint.appendChild = jest.fn();
      const feature = getFeature(
        mockFeatureType,
        mockFeatureOptions,
        mockFullscriptOptions,
        dispatcher
      );

      expect(mockMountPoint.appendChild).not.toBeCalled();

      await expect(feature.mount("blah")).rejects.toThrow(
        "Could not find the mount point for the iframe. Please check that the elementId provided in .mount() matches the one that's used in the DOM"
      );
    });
  });

  describe("unmount", () => {
    it("removes a child from the mountPoint when unmount is called", () => {
      return import("./feature").then(({ getFeature }) => {
        const feature = getFeature(
          mockFeatureType,
          mockFeatureOptions,
          mockFullscriptOptions,
          dispatcher
        );
        feature.unmount();

        expect(mockRemoveChildren).toBeCalled();
      });
    });

    it("unregisters all feature eventListeners when unmounting", () => {
      return import("./feature").then(({ getFeature }) => {
        dispatcher.unregisterAllFeatureEventListeners = jest.fn();
        const feature = getFeature(
          mockFeatureType,
          mockFeatureOptions,
          mockFullscriptOptions,
          dispatcher
        );
        feature.unmount();
        expect(dispatcher.unregisterAllFeatureEventListeners).toHaveBeenCalledWith(mockFrameId);
      });
    });
  });

  describe("dispatcher calls", () => {
    it("calls registerEventListener on the dispatcher when on is called", () => {
      return import("./feature").then(({ getFeature }) => {
        const callback = jest.fn();
        const eventType = "treatmentPlan.activated";
        dispatcher.registerEventListener = jest.fn();
        const feature = getFeature(
          mockFeatureType,
          mockFeatureOptions,
          mockFullscriptOptions,
          dispatcher
        );

        feature.on(eventType, callback);
        expect(dispatcher.registerEventListener).toHaveBeenCalledWith(
          `${mockFrameId}.${eventType}`,
          callback
        );
      });
    });

    it("calls unregisterEventListener on the dispatcher when off is called", () => {
      return import("./feature").then(({ getFeature }) => {
        const callback = jest.fn();
        const eventType = "treatmentPlan.activated";
        dispatcher.unregisterEventListener = jest.fn();
        const feature = getFeature(
          mockFeatureType,
          mockFeatureOptions,
          mockFullscriptOptions,
          dispatcher
        );

        feature.off(eventType, callback);
        expect(dispatcher.unregisterEventListener).toHaveBeenCalledWith(
          `${mockFrameId}.${eventType}`,
          callback
        );
      });
    });
  });
});
