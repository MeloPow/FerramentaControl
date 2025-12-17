// forge.config.ts
import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { AutoUnpackNativesPlugin } from '@electron-forge/plugin-auto-unpack-natives';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';

import { mainConfig } from './webpack.main.config';
import { rendererConfig } from './webpack.renderer.config';

// Ajuste aqui os metadados do app
const APP_NAME = 'FerramentaControl';
const APP_SLUG = 'ferramentacontrol';
const APP_ID = 'com.melopow.ferramentacontrol';

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,

    // Identidade do app (nome do executável/pacote)
    name: APP_NAME,
    executableName: APP_NAME,

    // Útil principalmente em macOS e alguns installers
    appBundleId: APP_ID,
    appCategoryType: 'public.app-category.productivity',

    // Ícone do app (o Electron Packager escolhe .ico/.icns/.png conforme o alvo)
    // Crie esses arquivos:
    // - assets/icon.ico  (Windows)
    // - assets/icon.icns (macOS - opcional)
    // - assets/icon.png  (Linux - opcional)
    icon: './assets/icon',
  },

  rebuildConfig: {},

  makers: [
    new MakerSquirrel({
      name: APP_SLUG,
      setupExe: `${APP_NAME}-Setup.exe`,
      setupIcon: './assets/icon.ico',
      authors: 'MeloPow',
      description:
        'Sistema simples de controle de ferramentas para obras e depósito.',
    }),
    new MakerZIP({}, ['darwin']),
    new MakerRpm({}),
    new MakerDeb({}),
  ],

  plugins: [
    new AutoUnpackNativesPlugin({}),
    new WebpackPlugin({
      mainConfig,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: './src/renderer/index.html',
            js: './src/renderer/renderer.tsx',
            name: 'main_window',
            preload: { js: './src/main/preload.ts' },
          },
        ],
      },
    }),
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};

export default config;
