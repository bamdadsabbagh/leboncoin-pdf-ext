/* eslint-disable no-template-curly-in-string */
module.exports = {
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'CHANGELOG.md',
      },
    ],
    [
      '@semantic-release/exec',
      {
        prepareCmd: 'pnpm build:increment ${nextRelease.version} && pnpm build',
      },
    ],
    [
      'semantic-release-firefox-add-on',
      {
        extensionId: '{55a4be35-e4be-40dc-a87e-ea6a58d04f46}',
        targetXpi: 'leboncoin-pdf-ext-${nextRelease.version}.xpi',
        sourceDir: 'dist/firefox',
        artifactsDir: 'packages',
        channel: 'listed',
      },
    ],
    [
      'semantic-release-chrome',
      {
        asset: 'leboncoin-pdf-ext-${nextRelease.version}.zip',
        extensionId: 'mifkoblilhehppoemadbhopbbijpifcj',
        distFolder: 'dist/chrome',
      },
    ],
    [
      '@semantic-release/github',
      {
        assets: [
          'packages/leboncoin-pdf-ext-${nextRelease.version}.xpi',
          'leboncoin-pdf-ext-${nextRelease.version}.zip',
        ],
      },
    ],
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md', 'package.json', 'src/manifest-*.json'],
        message:
          'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
  ],
};
