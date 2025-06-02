import { Fullscript } from "./index";

describe("Fullscript library", () => {
  it("returns a Client", () => {
    const client = Fullscript({ publicKey: "we", env: "us" });

      expect(client).not.toBe(null);
  });
});
