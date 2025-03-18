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
    describe("the feature type is 'treatmentPlan'", () => {
      it("returns the proper url", async () => {
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

      it("doesn't add entrypoint to the url when entrypoint is given", async () => {
        const url = await getFeatureURL(
          "treatmentPlan",
          // @ts-expect-error
          { ...mockFeatureOptions, entrypoint: "labs" },
          mockFullscriptOptions,
          mockFrameId
        );

        expect(url).toEqual(
          `https://us-snd.fullscript.io/api/embeddable/session/treatment_plans/new?data_token=${encodeURIComponent(
            mockDataToken
          )}&secret_token=secretToken&public_key=publicKey&frame_id=uuid&target_origin=http://localhost`
        );
      });
    });

    describe("the feature type is 'platform'", () => {
      it("returns the proper url", async () => {
        const url = await getFeatureURL(
          "platform",
          mockFeatureOptions,
          mockFullscriptOptions,
          mockFrameId
        );

        expect(url).toEqual(
          `https://us-snd.fullscript.io/api/embeddable/session/embed/entry?data_token=${encodeURIComponent(
            mockDataToken
          )}&secret_token=secretToken&public_key=publicKey&frame_id=uuid&target_origin=http://localhost`
        );
      });

      describe("entrypoint", () => {
        it("adds labs entrypoint to the url when it is given", async () => {
          const url = await getFeatureURL(
            "platform",
            { ...mockFeatureOptions, entrypoint: "labs" },
            mockFullscriptOptions,
            mockFrameId
          );

          expect(url).toEqual(
            `https://us-snd.fullscript.io/api/embeddable/session/embed/entry?data_token=${encodeURIComponent(
              mockDataToken
            )}&secret_token=secretToken&entrypoint=labs&public_key=publicKey&frame_id=uuid&target_origin=http://localhost`
          );
        });

        it("adds catalog entrypoint to the url when it is given", async () => {
          const url = await getFeatureURL(
            "platform",
            { ...mockFeatureOptions, entrypoint: "catalog" },
            mockFullscriptOptions,
            mockFrameId
          );

          expect(url).toEqual(
            `https://us-snd.fullscript.io/api/embeddable/session/embed/entry?data_token=${encodeURIComponent(
              mockDataToken
            )}&secret_token=secretToken&entrypoint=catalog&public_key=publicKey&frame_id=uuid&target_origin=http://localhost`
          );
        });

        it("doesn't add entrypoint to the url when an invalid entrypoint is given", async () => {
          const url = await getFeatureURL(
            "platform",
            // @ts-expect-error
            { ...mockFeatureOptions, entrypoint: "invalid" },
            mockFullscriptOptions,
            mockFrameId
          );

          expect(url).toEqual(
            `https://us-snd.fullscript.io/api/embeddable/session/embed/entry?data_token=${encodeURIComponent(
              mockDataToken
            )}&secret_token=secretToken&public_key=publicKey&frame_id=uuid&target_origin=http://localhost`
          );
        });
      });
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
