// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer').themes.github;;
const darkCodeTheme = require('prism-react-renderer').themes.dracula;;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: '2025 AWS High School STEM',
  tagline: '고등학생 여러분과 함께 AWS의 생성형 AI 서비스인 Amazon Bedrock을 다뤄보는 실습을 진행합니다.',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://stem.awskorea.kr',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  // organizationName: 'facebook', // Usually your GitHub org/user name.
  // projectName: 'docusaurus', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //   'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: false,
          blogTitle: 'Contributors',
          blogDescription: 'Meet our contributors',
          blogSidebarTitle: 'All Contributors',
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/thumbnail.png',
      navbar: {
        title: 'AWS Korea',
        logo: {
          alt: 'AWS Korea',
          src: 'img/thumbnail.png',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Tutorial',
          },
          {to: '/blog', label: 'Contributor', position: 'left'},
          {
            href: 'https://docs.google.com/spreadsheets/d/1MfA-7K2HbeKFolIkbr5uzQLvV8SxGisWX7o5gKY3UvA',
            label: 'Accounts',
            position: 'left',
          },
          {
            href: 'https://aws.amazon.com/bedrock/?gclid=CjwKCAiA2cu9BhBhEiwAft6IxBoSpIdCU00g-wkL5Pj8Ax-MY8eHXSqgTVc7IhRk3suLDltg4ix3qxoCLGYQAvD_BwE&trk=24a8f13a-f5db-4127-bcb7-8b2876aa4265&sc_channel=ps&ef_id=CjwKCAiA2cu9BhBhEiwAft6IxBoSpIdCU00g-wkL5Pj8Ax-MY8eHXSqgTVc7IhRk3suLDltg4ix3qxoCLGYQAvD_BwE:G:s&s_kwcid=AL!4422!3!692062155749!e!!g!!aws%20bedrock!21058131112!157173586057',
            label: 'AWS Bedrock',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Community',
            items: [
              {
                label: 'AWS',
                href: 'https://aws.amazon.com/ko/free/?gclid=Cj0KCQiA_NC9BhCkARIsABSnSTacJ6XsM3kkpAjLYReSWlmmrJ1xXHTFM31kWLcPmER57TUrygKkfEAaAnaHEALw_wcB&trk=fa2d6ba3-df80-4d24-a453-bf30ad163af9&sc_channel=ps&ef_id=Cj0KCQiA_NC9BhCkARIsABSnSTacJ6XsM3kkpAjLYReSWlmmrJ1xXHTFM31kWLcPmER57TUrygKkfEAaAnaHEALw_wcB:G:s&s_kwcid=AL!4422!3!563761819834!e!!g!!aws!15286221779!129400439466&all-free-tier.sort-by=item.additionalFields.SortRank&all-free-tier.sort-order=asc&awsf.Free%20Tier%20Types=*all&awsf.Free%20Tier%20Categories=*all',
              },
              
              {
                label: 'AWS re:Post',
                href: 'https://repost.aws/ko',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Contributor',
                to: '/blog',
              },
              {
                label: 'AWS Bedrock',
                href: 'https://aws.amazon.com/ko/bedrock/?nc1=h_ls',
              },
            ],
          },
        ],
        copyright: `COPYRIGHT ${new Date().getFullYear()} AWS KOREA | ALL RIGHTS RESERVED `,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      colorMode: {
        defaultMode: 'light',
        disableSwitch: true,
        respectPrefersColorScheme: false,
      },
    }),
};

module.exports = config;