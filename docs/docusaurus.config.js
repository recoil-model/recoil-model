/*
 *   Copyright (c) 2021 
 *   All rights reserved.
 */

module.exports = {
  title: 'Recoil Model',
  tagline: 'A model library for Recoil',
  url: 'https://recoil-model.github.io',
  baseUrl: '/',
  favicon: 'img/favicon.png',
  organizationName: 'facebookexperimental', // Usually your GitHub org/user name.
  projectName: 'Recoil', // Usually your repo name.
  themeConfig: {
    algolia: {
      apiKey: '9c5a009951e793525603922b8ca66628',
      indexName: 'recoiljs'
    },
    googleAnalytics: {
      trackingID: 'UA-44373548-46',
    },
    image: 'img/og-image.png',
    navbar: {
      logo: {
        alt: 'Recoil',
        src: 'img/logo.svg',
        srcDark: 'img/logo--dark.svg',
        href: '/',
        target: '_self'
      },
      items: [
        {
          to: 'docs/introduction/installation',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        //{ to: 'blog', label: 'Blog', position: 'left' },
        // {to: 'resources', label: 'External Resources', position: 'left'},
        // Please keep GitHub link to the right for consistency.
        {
          href: 'https://github.com/recoil-model/recoil-model',
          label: 'GitHub',
          position: 'right',
        },
      ],
    }
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/recoil-model/recoil-model/edit/docs/docs/',
        },
        blog: {
          showReadingTime: true,
          editUrl:
            'https://github.com/recoil-model/recoil-model/edit/docs/docs/blog/',
          feedOptions: {
            type: 'all',
            copyright: `Copyright © ${new Date().getFullYear()} Facebook, Inc.`,
          },
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
