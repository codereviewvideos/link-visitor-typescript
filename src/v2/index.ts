import { visit } from "./visit";

// const href = "https://a.bad.url";
// const href = "https://aka.ms/new-console-template";
// const href = "https://codereviewvideos.com";
// const href = "http://codereviewvideos.com";
// const href = "http://codereviewvideos.com/444444";
const href = "https://codereviewvideos.com/typescript-tuple";
// const href = "tel:+1-303-499-7111";
// const href = "mailto:someone@example.com";

const url = process.argv[2] ?? href;

(async () => {
  try {
    const journey = await visit(url);
    console.log(journey);
  } catch (e) {
    console.error(e);
  }
})();
