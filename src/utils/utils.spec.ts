import { removeChildren, buildQueryString, Params } from "./utils";

describe("utils", () => {
  let elem: HTMLElement;
  let mockParams: Params;
  const mockKey = "pupper";
  const mockValue = "nessa";
  const mockDataToken = "random+data_token";
  const mockFullscriptOptions = {
    publicKey: "mockPublicKey",
    env: "us",
  };

  beforeEach(() => {
    elem = document.createElement("div");
    document.getElementById = jest.fn(() => elem);

    mockParams = {
      key: mockKey,
      value: mockValue,
    };
  });
  describe("removeChildren", () => {
    it("removes all children elements if there is any", () => {
      const textNode = document.createTextNode("helloo");
      elem.appendChild(textNode);
      elem.appendChild(textNode);
      removeChildren(elem);

      expect(elem.childNodes.length).toBe(0);
    });

    it("does nothing if there are no children", () => {
      removeChildren(elem);
      expect(elem.childNodes.length).toBe(0);
    });
  });

  describe("buildQueryString", () => {
    it("returns an empty string if params have no keys", async () => {
      mockParams = {};
      const builtQueryString = await buildQueryString(mockParams);
      await expect(builtQueryString).toHaveLength(0);
    });

    it("properly builds a query string with proper key and param values", async () => {
      const builtQueryString = await buildQueryString(mockParams);

      await expect(builtQueryString).toEqual(`?key=${mockKey}&value=${mockValue}`);
    });

    it("converts keys into snakecase", async () => {
      mockParams = { fooBar: "foobar" };
      const builtQueryString = await buildQueryString(mockParams);
      await expect(builtQueryString).toEqual(`?foo_bar=${mockParams.fooBar}`);
    });

    it("accept object params", async () => {
      mockParams = { something: "else", foo: { bar: "foobar" } };
      const queryString = await buildQueryString(mockParams);
      await expect(queryString).toEqual(`?something=else&foo[bar]=${mockParams.foo.bar}`);
    });

    it("encodes reserved characters in string params", async () => {
      mockParams = { fooBar: "a#b&c=d+e f", publicKey: "publicKey" };
      const queryString = await buildQueryString(mockParams);

      await expect(queryString).toEqual("?foo_bar=a%23b%26c%3Dd%2Be%20f&public_key=publicKey");
      await expect(new URLSearchParams(queryString).get("foo_bar")).toEqual("a#b&c=d+e f");
    });

    it("skips null and undefined params without breaking the separators", async () => {
      mockParams = { first: undefined, foo: "bar", middle: null, baz: "qux" };
      const queryString = await buildQueryString(mockParams);

      await expect(queryString).toEqual("?foo=bar&baz=qux");
    });

    it("stringifies non-string scalar params instead of dropping them", async () => {
      mockParams = { count: 12345, publicKey: "publicKey" };
      const queryString = await buildQueryString(mockParams);

      await expect(queryString).toEqual("?count=12345&public_key=publicKey");
    });

    it("properly converts patient info to token", async () => {
      mockParams = {
        fooBar: "foobar",
        patient: { id: "patientId" },
        fullscriptOptions: mockFullscriptOptions,
      };

      window.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({ data_token: mockDataToken }),
        })
      ) as jest.Mock;

      const builtQueryString = await buildQueryString(mockParams);

      await expect(builtQueryString).toEqual(
        `?data_token=${encodeURIComponent(mockDataToken)}&foo_bar=${mockParams.fooBar}`
      );
    });

    it("passes null data token if tokenization fails", async () => {
      mockParams = {
        fooBar: "foobar",
        patient: { id: "patientId" },
        fullscriptOptions: mockFullscriptOptions,
      };

      window.fetch = jest.fn(() =>
        Promise.reject({
          json: () => Promise.resolve({ error: "some error" }),
        })
      ) as jest.Mock;

      const builtQueryString = await buildQueryString(mockParams);

      await expect(builtQueryString).toEqual(`?data_token=null&foo_bar=${mockParams.fooBar}`);
    });
  });
});
