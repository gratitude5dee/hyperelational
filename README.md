Hyperelational AI
<div align="center">
<img src="https://lovable.dev/opengraph-image-p98pqg.png" alt="Hyperelational AI Logo" width="150"/>
<br/>
<br/>
<p>
<strong>The AI-Powered Relational BI Dashboard for Modern Creatives & Retailers</strong>
</p>
<p>
Uncover hidden connections in your data with a foundation model built for relational intelligence.
</p>
<br/>
<p>
<img src="https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react" alt="React" />
<img src="https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite" alt="Vite" />
<img src="https://img.shields.io/badge/Supabase-2.55-3ECF8E?style=for-the-badge&logo=supabase" alt="Supabase" />
<img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
</p>
</div>

🚀 Introduction

Hyperelational is a next-generation Business Intelligence (BI) platform designed to move beyond traditional dashboards. It leverages a powerful relational foundation model, KumoRFM, to analyze deep, complex relationships within your data, providing predictive insights that were previously impossible to surface.

This isn't just about visualizing numbers; it's about understanding the intricate web of connections that drive your business. Whether you're in fashion e-commerce or the music & creative industry, Hyperelational offers a tailored experience to help you make smarter, data-driven decisions.

✨ Key Features

🌐 Dual-Industry Focus: A tailored BI experience for both Fashion E-commerce (customer churn, LTV, trend forecasting) and Music & Touring (fan engagement, tour planning, merch insights).

🤖 AI Chat & PQL Generation: Converse with your data in natural language. Our AI assistant, powered by Groq and KumoRFM, translates your questions into Predictive Query Language (PQL) and provides narrative insights.

🔮 Predictive Analytics: Go beyond historical data. Predict future outcomes like customer churn, sales forecasts, and market trends with confidence scores.

🕸️ 3D Relational Graph Explorer: Visualize the complex relationships between your customers, products, fans, and events in an interactive 3D universe.

🧠 Agent-Based Workflows: Deploy autonomous AI agents to perform complex tasks like ad campaign optimization, inventory management, and trend prediction.

🔌 Seamless Integrations: One-click connections to your favorite platforms (Shopify, Google Analytics, Stripe, Spotify for Artists) to build a unified data model.

🎯 Dynamic Audience Builder: Create hyper-specific audience segments using both historical data and AI predictions for targeted marketing campaigns.

Supabase Backend: Built on a robust and scalable serverless backend using Supabase for database, authentication, and edge functions.

🏛️ Project Architecture

Hyperelational is built with a modern, scalable architecture designed for real-time analytics and AI processing.

code
Code
download
content_copy
expand_less

+---------------------+      +---------------------------------+      +------------------------+
|   Frontend (Vite)   |      |      Backend (Supabase)         |      |    External Services   |
| - React & TypeScript|      |                                 |      |                        |
| - shadcn/ui         |      | - PostgreSQL Database           |      | - KumoRFM (Relational  |
| - Tailwind CSS      | <--> | - Authentication                | <--> |   Foundation Model)    |
| - Recharts, Three.js|      | - Edge Functions (Deno)         |      |                        |
|                     |      |   - AI Agent Executor           |      | - Groq (LLM for Chat)  |
|                     |      |   - Predictive Analytics        |      |                        |
+---------------------+      +---------------------------------+      +------------------------+
🛠️ Getting Started: Local Development

Follow these instructions to get a local copy up and running for development and testing purposes.

Prerequisites

Node.js (v18 or higher)

Bun (as a package manager)

Git

Supabase CLI

Installation & Setup

Clone the repository:

code
Sh
download
content_copy
expand_less
IGNORE_WHEN_COPYING_START
IGNORE_WHEN_COPYING_END
git clone <YOUR_REPOSITORY_URL>
cd hyperelational-main-3

Install dependencies:

code
Sh
download
content_copy
expand_less
IGNORE_WHEN_COPYING_START
IGNORE_WHEN_COPYING_END
bun install

Set up Supabase locally:

Initialize Supabase within the project:

code
Sh
download
content_copy
expand_less
IGNORE_WHEN_COPYING_START
IGNORE_WHEN_COPYING_END
supabase init

Start the local Supabase services (this will spin up Docker containers):

code
Sh
download
content_copy
expand_less
IGNORE_WHEN_COPYING_START
IGNORE_WHEN_COPYING_END
supabase start

Apply the database migrations to your local instance. The -x flag is important to apply all schemas.

code
Sh
download
content_copy
expand_less
IGNORE_WHEN_COPYING_START
IGNORE_WHEN_COPYING_END
supabase db reset

Deploy the edge functions to your local instance:

code
Sh
download
content_copy
expand_less
IGNORE_WHEN_COPYING_START
IGNORE_WHEN_COPYING_END
supabase functions deploy

Configure Environment Variables:

Copy the example environment file:

code
Sh
download
content_copy
expand_less
IGNORE_WHEN_COPYING_START
IGNORE_WHEN_COPYING_END
cp .env.example .env.local

Run supabase status. This will output your local Supabase details.

Update .env.local with the following values from the supabase status output:

VITE_SUPABASE_URL: Your local API URL.

VITE_SUPABASE_ANON_KEY: Your local anon key.

You will also need to add Supabase service role key and other API keys for the functions to work correctly. Find the service_role key from the supabase status output.

code
Env
download
content_copy
expand_less
IGNORE_WHEN_COPYING_START
IGNORE_WHEN_COPYING_END
# Supabase (frontend)
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=your-local-anon-key

# Supabase Edge Functions (backend)
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_SERVICE_ROLE_KEY=your-local-service-role-key

# External Services
KUMO_API_KEY=your_kumorfm_api_key_or_mock
GROQ_API_KEY=your_groq_api_key_or_mock

Note: For local development, you can use placeholder strings for KUMO_API_KEY and GROQ_API_KEY as the edge functions have mock fallbacks.

Run the development server:

code
Sh
download
content_copy
expand_less
IGNORE_WHEN_COPYING_START
IGNORE_WHEN_COPYING_END
bun run dev

The application will be available at http://localhost:8080.

📂 Application Structure

The project follows a standard Vite + React structure with a clear separation of concerns.

code
Code
download
content_copy
expand_less
IGNORE_WHEN_COPYING_START
IGNORE_WHEN_COPYING_END
/
├── public/                # Static assets
├── supabase/              # Supabase configuration
│   ├── functions/         # Edge Functions (backend logic)
│   └── migrations/        # Database schema migrations
└── src/
    ├── assets/            # Images, fonts, etc.
    ├── components/        # Reusable UI components
    │   ├── ui/            # shadcn/ui components
    │   ├── analytics/     # High-level analytics modules
    │   └── dashboard/     # Dashboard-specific components & widgets
    ├── contexts/          # React contexts (e.g., AuthContext)
    ├── hooks/             # Custom React hooks
    ├── integrations/      # Supabase client and types
    ├── lib/               # Utility functions
    ├── pages/             # Route components for each page
    ├── services/          # Business logic and API services (Groq, GraphAI)
    └── stores/            # Zustand stores for global state
🤖 Key Supabase Edge Functions

Our backend logic is primarily handled by serverless Supabase Edge Functions. Here are some of the key players:

agent-workflow-executor: Orchestrates multi-agent workflows for complex tasks.

retail-predict-churn: Runs AI models to predict customer churn probability.

artist-fan-engagement: Analyzes fan data to calculate engagement scores and identify superfans.

artist-forecast-demand: Predicts ticket demand for tour planning.

retail-recommend-products: Generates personalized product recommendations.

sample-data-seeder: Populates the database with realistic sample data for demonstration.

🤝 Contributing

We welcome contributions to Hyperelational! If you're interested in helping, please check out our contributing guidelines (CONTRIBUTING.md - to be created).

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request

📜 License

This project is licensed under the MIT License. See the LICENSE file for details.

🙏 Acknowledgments

Supabase: For their incredible open-source backend-as-a-service platform.

Kumo.AI: For the groundbreaking Relational Foundation Model technology that powers our core intelligence.

Groq: For providing the high-speed LLM inference that powers our AI chat assistant.

shadcn/ui: For the fantastic, accessible component library.
