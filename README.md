[node]: https://nodejs.org/en
[pnpm]: https://pnpm.io/installation
[yarn]: https://yarnpkg.com/getting-started/install
[demo]: https://lhedger-ai.vercel.app/
[license]: https://github.com/doinel1a/lhedger-ai/blob/main/LICENSE
[code-of-conduct]: https://github.com/doinel1a/lhedger-ai/blob/main/CODE_OF_CONDUCT.md
[issues]: https://github.com/doinel1a/lhedger-ai/issues
[pulls]: https://github.com/doinel1a/lhedger-ai/pulls
[browserslist]: https://browsersl.ist/#q=last+3+versions%2C%3E+0.2%25%2C+not+dead
[commitlint]: https://github.com/conventional-changelog/commitlint/#what-is-commitlint
[chrome-icon]: https://github.com/alrra/browser-logos/blob/main/src/chrome/chrome_64x64.png
[firefox-icon]: https://github.com/alrra/browser-logos/blob/main/src/firefox/firefox_64x64.png
[edge-icon]: https://github.com/alrra/browser-logos/blob/main/src/edge/edge_64x64.png
[opera-icon]: https://github.com/alrra/browser-logos/blob/main/src/opera/opera_64x64.png
[safari-icon]: https://github.com/alrra/browser-logos/blob/main/src/safari/safari_64x64.png

# LHedgrer AI

🔍 LHedgerAi is an AI-powered portfolio optimization platform that merges advanced mathematical analysis with an intuitive user experience — helping crypto investors make safer, smarter decisions based on real data and statistical reasoning.

🧩 The problem we solve is the poor risk management in crypto investing—most users lack tools to assess how risky a specific coin is, leading to uninformed decisions and losses. Our platform helps users understand and manage risk through data-driven portfolio optimization and clear diversification strategies.

🛠️ Our project offers an AI-driven implementation of Markowitz's Efficient Frontier, enabling users to optimize their crypto portfolios by balancing risk and return through intelligent diversification. This makes advanced investment strategies accessible to everyday users in a simple, automated way.

🧑‍🤝‍🧑 The target audience are the crypto investors that lack either the experience to analyze the market or lack the time.

---

🛤️ Roadmap

Hackathon MVP – 5 Apr 2025 Delivered a functional MVP focused on validating the core idea, proving real-world value, and setting the foundation for scalable crypto investment optimization.

Adding New Features – 20 May 2025 Implemented yield/stake optimization and automated portfolio rebalancing features to enhance platform utility.

Community Building & Awareness – Jun to 1 Sep 2025 Focused on growing community across X (Twitter), Telegram, and Discord. Started creating blog and social content, targeting 10,000+ followers across platforms.

Official Product Launch – 15 Oct 2025 Full public launch of the platform with a complete, user-ready feature set.

Adding More Features – 26 Jan 2026 Released Trading Bot Arena, Copy Trader functionality, and Multi-Chain Asset Optimization tools.

Growth KPI – 10 Apr 2026 Achieve a target of 15,000 daily active users as a key growth milestone.

Expansion & Partnerships – 1 Oct 2026 Scale operations, introduce advanced features, and establish strategic partnerships with platforms and services in the crypto space.

Token Launch – 31 Dec 2026 Launch of the native LHedgerAi token to support the platform’s ecosystem and incentivize user engagement.

---

🌍 Impact & Ecosystem Fit

We integrated Token Metrics as a source for general market data and used Open, High, Low, Close, and Volume (OHLCV) data to power our analytics dashboard. This dashboard displays key metrics such as daily volume (last 24h), price trends, and trading signals, helping users better understand market movements. Additionally, we used daily OHLCV data from the past year to compute the Markowitz Efficient Frontier chart, enabling data-driven risk-return analysis. Sentiment indicators were also incorporated to enhance the interpretation of trader signals.

We integrated the On-Chain Kit and successfully deployed the Bundler Smart Contract on Base [view on BaseScan](https://basescan.org/address/0x23b838A2b6B9158de82eb261a818D07EC5ab0624). All selected tokens are exclusively on the Base network, and we integrated with Uniswap pairs on Base to enable seamless trading and liquidity access.

---

🧑‍🤝‍🧑Team

Alexe-Luca Spataru - Multiple hackathons participant and seasoned blockchain developer with 6 years of experience in building smart contracts and dapps.

Doinel Atanasiu - Fullstack engineer with 10 years of experience developing scalable web applications at startups.

Axel Delamarre - Quant in investment banking on equity derivatives, machine learning engineer for hedging strategies and LLMs, defi protocol smart contract development

Stavinschi Denis - 3 years of Marketing experience, Google Ads, Meta Ads, responsible for the Business Plan, Marketing Strategy

## [Full business plan](https://www.notion.so/Business-Plan-Full-Version-1cbdfbbb66ce8008a997fc742c213341)

## :computer: Getting started

### Prerequisites:

- JavaScript runtime **[node.js][node]**;
- **(OPTIONAL)** Alternative package manager:
  - **[pnpm][pnpm]** <br /> or
  - **[yarn][yarn]**

### Start developing:

- Get the repository:
  - click **"Use this template"** &nbsp; or &nbsp; **"Fork"** button <br /> alternately
  - **clone** the repository through your terminal: <br />
    ```bash
    git clone https://github.com/doinel1a/lhedger-ai
    ```
- Open your terminal or code editor to the path your project is located, and, for the frontend, run `cd dapp` and :

  |                                                  | **npm**           | **pnpm**       | **yarn**       |
  | ------------------------------------------------ | ----------------- | -------------- | -------------- |
  | To **install** the dependencies                  | `npm install`     | `pnpm install` | `yarn install` |
  | To **run** the **development server**            | `npm run dev`     | `pnpm dev`     | `yarn dev`     |
  | To **build** your app **for production**         | `npm run build`   | `pnpm build`   | `yarn build`   |
  | To **preview** your **production optimized app** | `npm run preview` | `pnpm preview` | `yarn preview` |

- Open your terminal or code editor to the path your project is located, and, for the api, run `cd portfolio-optimization` and:

  |                                       | **python**                        |
  | ------------------------------------- | --------------------------------- |
  | To **create venv**                    | `python3 -m venv .venv`           |
  | To **activate venv**                  | `source .venv/bin/activate`       |
  | To **install** the dependencies       | `pip install -r requirements.txt` |
  | To **run** the **development server** | `python3 api/api.py`              |

[Back to :arrow_up:](#lhedgrer-ai "Back to 'Table of contents' section")

---

## :battery: Features

This repository comes 🔋 packed with:

- **Next.js 15**;
- **React.js 19**;
- **Shadcn/ui**;
- **HeroUI**;
- **TailwindCSS**;
- **SASS** & **SCSS**;
- **Base OnChainKit**;
- **Viem**;
- **Wagmi**;
- **ESLint**;
- **Prettier**;
- **Husky**;
- **Commitlint**;
- **Lint staged**;
- **Playwright**;

[Back to :arrow_up:](#lhedgrer-ai "Back to 'Table of contents' section")

---

## :busts_in_silhouette: Contribute

Contributions are what make the open source community such an amazing place to learn, inspire, and create.  
Any contribution is greatly appreciated: big or small, it can be documentation updates, adding new features or something bigger.  
Please check the [**contributing guide**][code-of-conduct] for details on how to help out and keep in mind that all commits must follow the **[conventional commit format][commitlint]**.

### How to contribute:

1.  **[Get started](#computer-getting-started "Go to 'Getting started' section");**
2.  **For a new feature:**
    1.  Create a new branch: `git checkout -b feat/NEW-FEATURE`;
    2.  Add your changes to the staging area: `git add PATH/TO/FILENAME.EXTENSION`;
    3.  Commit your changes: `git commit -m "feat: NEW FEATURE"`;
    4.  Push your new branch: `git push origin feat/NEW-FEATURE`;
3.  **For a bug fix:**
    1.  Create a new branch: `git checkout -b fix/BUG-FIX`;
    2.  Add your changes to the staging area: `git add PATH/TO/FILENAME.EXTENSION`;
    3.  Commit your changes: `git commit -m "fix: BUG FIX"`;
    4.  Push your new branch: `git push origin fix/BUG-FIX`;
4.  **Open a new [pull request][pulls];**

[Back to :arrow_up:](#lhedgrer-ai "Back to 'Table of contents' section")

---

## :bookmark_tabs: License

All logos and trademarks are the property of their respective owners.  
Everything else is distributed under the **MIT License** .  
See the [LICENSE][license] file for more informations.

[Back to :arrow_up:](#lhedgrer-ai "Back to 'Table of contents' section")
