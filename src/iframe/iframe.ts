import { wrapWithLoader } from "./loader";

const createIframe = (src: string): HTMLElement => {
  const iframe = document.createElement("iframe");
  iframe.style.setProperty("width", "100%");
  iframe.style.setProperty("height", "100%");
  iframe.style.setProperty("border", "none");
  iframe.allow = "clipboard-read; clipboard-write";
  iframe.src = src;

  return wrapWithLoader(iframe);
};

export { createIframe };
