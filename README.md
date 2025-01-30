# Face-It

## Face It, Time to Master Your Money

**Face-It** is a comprehensive financial management application designed to help users manage and track their finances effectively. The application provides tools for visualizing income and expenses, categorizing transactions, predicting future financial trends, and generating financial reports.

**Hosted URL**: [https://face-it.pages.dev/](https://face-it.pages.dev/)

## Installation Instructions

To set up and run the Face-It application, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/face-it.git
   cd face-it
   ```
2. **Install dependencies**:

   ```bash
   # npm
   npm install

   # pnpm
   pnpm install

   # yarn
   yarn install

   # bun
   bun install
   ```

3. **Run the development server:**:

   ```bash
   # npm
   npm run dev

   # pnpm
   pnpm dev

   # yarn
   yarn dev

   # bun
   bun run dev
   ```

4. **Build the application for production:**:

   ```bash
   # npm
   npm run build

   # pnpm
   pnpm build

   # yarn
   yarn build

   # bun
   bun run build
   ```

5. **Preview the production build**:

   ```bash
   # npm
   npm run preview

   # pnpm
   pnpm preview

   # yarn
   yarn preview

   # bun
   bun run preview
   ```

#### Usage Instructions

1. **Dashboard**: View an overview of your financial status, including income, expenses, and balance.

2. **Transactions**: Add, edit, and delete transactions. Categorize them as income or expenses.

3. **Report**: Generate and download financial reports in PDF format.

4. **Analytics**: Visualize your financial data using various charts (line charts, bar charts, donut charts).
   - **AI Tips**: Get AI-generated tips on how to save more money based on your financial data.

#### Code Structure

- **components/**: Contains Vue components used throughout the application.
- **pages/**: Contains Vue pages that define the routes of the application.
- **assets/css/**: Contains the main CSS file with Tailwind CSS configurations.
- **composables/**: Contains reusable logic and functions.
- **public/**: Contains static assets like images and icons.
- **server/**: Contains server-side code and configurations.
- **nuxt.config.js**: Nuxt.js configuration file.
- **tailwind.config.js**: Tailwind CSS configuration file.

#### External Libraries or Frameworks

- **Nuxt.js**: Framework for building Vue.js applications.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Pinia**: State management library for Vue.js.
- **VueUse**: Collection of essential Vue Composition Utilities.
- **@google/generative-ai**: Library for integrating Google Generative AI.
- **@tanstack/vue-table**: Table component for Vue.js.
- **@vee-validate/zod**: Validation library for Vue.js.
- **@unovis/ts** and **@unovis/vue**: Libraries for data visualization.
- **shadcn**: A library for building accessible and customizable UI components.

#### Known Issues or Limitations

- The AI service may occasionally be unavailable due to server overload. If this happens, the application will display a message indicating that the AI is unavailable.
- Some features may not be fully optimized for mobile devices.

#### Contact Information

- **Name**: Ibrahim Afzal
- **Email**: ibrahim.afzal.c740@gmail.com
