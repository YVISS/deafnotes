import { detect } from "detect-browser";

export default function detectDevice() {
  const device = detect();
  const opSys = device?.os?.toLocaleLowerCase() || "";
  console.log(device);
  if (opSys.includes("android")) return { systemInfo: "android" };
  if (opSys.includes("windows")) return { systemInfo: "windows" };
  if (opSys.includes("mac")) return { systemInfo: "macos" };
  if (opSys.includes("ios")) return { systemInfo: "ios" };

  return { systemInfo: "unknown" };
}
