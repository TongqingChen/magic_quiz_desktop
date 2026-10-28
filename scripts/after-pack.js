const { execFileSync } = require('node:child_process');
const path = require('node:path');

/**
 * Ad-hoc sign the packaged macOS app.
 *
 * electron-builder skips signing when no Developer ID is available, which leaves
 * the bundle with only the linker's ad-hoc signature on the main executable.
 * Apple Silicon then refuses to launch it and macOS reports 「已损坏，无法打开」.
 * Re-signing the whole bundle with "-" seals resources and binds Info.plist, so
 * the app launches (Gatekeeper may still ask for a right-click → Open once).
 *
 * A real Developer ID certificate + notarization is still required to remove
 * that prompt completely.
 */
module.exports = async function afterPack(context) {
  if (context.electronPlatformName !== 'darwin') return;
  const appName = context.packager.appInfo.productFilename;
  const appPath = path.join(context.appOutDir, `${appName}.app`);
  console.log(`[after-pack] ad-hoc signing ${appPath}`);
  execFileSync('codesign', ['--force', '--deep', '--sign', '-', '--timestamp=none', appPath], { stdio: 'inherit' });
  execFileSync('codesign', ['--verify', '--deep', '--strict', appPath], { stdio: 'inherit' });
};
