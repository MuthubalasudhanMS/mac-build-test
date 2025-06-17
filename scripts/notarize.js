require('dotenv').config();
const { notarize } = require('@electron/notarize');

exports.default = async function notarizeApp(context) {
  const { electronPlatformName, appOutDir } = context;
  const appName = context.packager.appInfo.productFilename;
  
  if (electronPlatformName !== 'darwin') return;

  if (!process.env.APPLE_ID || !process.env.APPLE_ID_PASS || !process.env.ASC_PROVIDER) {
    console.warn("Missing Apple notarization credentials. Skipping notarization.");
    return;
  }

  console.log(`Notarizing ${appName}.app`);

  await notarize({
    appBundleId: 'com.example.localupdate', 
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.APPLE_ID,
    appleIdPassword: process.env.APPLE_ID_PASS,
    ascProvider: process.env.ASC_PROVIDER,
  });

  console.log(`Done notarizing ${appName}.app`);
};
