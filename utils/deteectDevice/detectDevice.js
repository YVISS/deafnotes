import { detect } from "detect-browser";

const devices = {};
export default function detectDevice() {
  const { detect } = require("detect-browser");
  const device = detect();
  console.log(device);
}
