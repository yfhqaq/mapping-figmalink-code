import { execa } from "../compiled";
async function getPnpmVersion() {
  const { stdout } = await execa("pnpm", [
    "--version"
  ]);
  return stdout;
}
async function canUseNpm() {
  try {
    await execa("npm", [
      "--version"
    ], {
      env: process.env
    });
    return true;
  } catch (e) {
    return false;
  }
}
async function canUseYarn() {
  try {
    await execa("yarn", [
      "--version"
    ], {
      env: process.env
    });
    return true;
  } catch (e) {
    return false;
  }
}
async function canUsePnpm() {
  try {
    await execa("pnpm", [
      "--version"
    ], {
      env: process.env
    });
    return true;
  } catch (e) {
    return false;
  }
}
export {
  canUseNpm,
  canUsePnpm,
  canUseYarn,
  getPnpmVersion
};
