require('dotenv').config();
const { notarize } = require('@electron/notarize');

exports.default = async function notarizeApp(context) {
  const { appOutDir } = context;
  const appName = context.packager.appInfo.productFilename;

  if (!process.env.APPLE_ID || !process.env.APPLE_ID_PASS || !process.env.ASC_PROVIDER) {
    console.warn("Missing Apple notarization credentials. Skipping notarization.");
    return;
  }

  console.log(`Notarizing ${appName}.app`);

  await notarize({
    appBundleId: 'com.example.app', // replace with your app's bundle ID
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.APPLE_ID,
    appleIdPassword: process.env.APPLE_ID_PASS,
    ascProvider: process.env.ASC_PROVIDER,
  });

  console.log(`Done notarizing ${appName}.app`);
};
