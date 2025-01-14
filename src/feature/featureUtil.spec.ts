import { FullscriptOptions } from "../fullscript";

import { FeatureOptions } from "./featureType";
import { getFeatureURL } from "./featureUtil";

describe("getFeatureUrl", () => {
  let mockFeatureOptions: FeatureOptions<"treatmentPlan" | "platform">;
  let mockFullscriptOptions: FullscriptOptions;
  let mockFrameId: string;
  const mockDataToken = "random+data_token";

  window.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ data_token: mockDataToken }),
    })
  ) as jest.Mock;

  beforeEach(() => {
    mockFeatureOptions = {
      patient: {
        id: "patientId",
      },
      secretToken: "secretToken",
    };

    mockFullscriptOptions = {
      env: "us-snd",
      publicKey: "publicKey",
    };

    mockFrameId = "uuid";
  });

  describe("feature type", () => {
    it("returns the proper url when the feature type is 'treatmentPlan'", async () => {
      const url = await getFeatureURL(
        "treatmentPlan",
        mockFeatureOptions,
        mockFullscriptOptions,
        mockFrameId
      );

      expect(url).toEqual(
        `https://us-snd.fullscript.io/api/embeddable/session/treatment_plans/new?data_token=${encodeURIComponent(
          mockDataToken
        )}&secret_token=secretToken&public_key=publicKey&frame_id=uuid&target_origin=http://localhost`
      );
    });

    it("returns the proper url when the feature type is 'platform'", async () => {
      const url = await getFeatureURL(
        "platform",
        mockFeatureOptions,
        mockFullscriptOptions,
        mockFrameId
      );

      expect(url).toEqual(
        `https://us-snd.fullscript.io/api/embeddable/session/o/home?data_token=${encodeURIComponent(
          mockDataToken
        )}&secret_token=secretToken&public_key=publicKey&frame_id=uuid&target_origin=http://localhost`
      );
    });
  });

  describe("custome domain", () => {
    it("returns proper custom url if domain is present", async () => {
      const customDomain = "https://staging.r.fullscript.io";
      mockFullscriptOptions = {
        ...mockFullscriptOptions,
        domain: customDomain,
      };

      const url = await getFeatureURL(
        "treatmentPlan",
        mockFeatureOptions,
        mockFullscriptOptions,
        mockFrameId
      );

      expect(url).toEqual(
        `${customDomain}/api/embeddable/session/treatment_plans/new?data_token=${encodeURIComponent(
          mockDataToken
        )}&secret_token=secretToken&public_key=publicKey&frame_id=uuid&target_origin=http://localhost`
      );
    });
  });
});
