# ReRead

ReRead is a platform for book lovers to exchange, donate, and discover books. Built with Next.js, efficient, and user-friendly.

## Getting Started

Follow these steps to get the project up and running on your local machine.

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm, yarn, pnpm, or bun

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <https://github.com/rianmubarok/ReRead>
    cd ReRead
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

### Environment Setup

This project requires environment variables to function correctly (Supabase, Firebase, etc.).

1.  **Create your local environment file:**
    Copy the example file `.env.local.example` to a new file named `.env.local` in the root directory.

    ```bash
    cp .env.local.example .env.local
    # On Windows command prompt: copy .env.local.example .env.local
    ```

2.  **Configure Environment Variables:**
    Open `.env.local` and fill in the required values. You will need credentials for:
    - **Supabase**: URL and Anon Key
    - **Firebase**: API Key, Auth Domain, Project ID, App ID

    *Note: Ask the project maintainer for these credentials if you don't have them.*

### Supabase Setup

This project uses Supabase for database and real-time features.

1.  **Create a Supabase Project**: Go to [database.new](https://database.new) and create a new project.
2.  **Get Credentials**: Get your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from Project Settings > API and add them to your `.env.local` file.
3.  **Setup Database Schema**:
    - Go to the **SQL Editor** in your Supabase dashboard.
    - Open the file `supabase.sql` located in the root of this repository.
    - Copy the entire content of the file.
    - Paste it into the SQL Editor and click **Run**.
    
    *This script sets up all necessary tables (users, books, chats, etc.), functions, and Row Level Security (RLS) policies.*

### Running the Application

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

- `src/app`: App directory (Next.js App Router)
- `src/components`: Reusable UI components
- `src/lib`: Utility functions and libraries
- `src/types`: TypeScript type definitions
- `public`: Static assets (images, icons)

## Learn More

To learn more about Next.js, take a look at the [Next.js Documentation](https://nextjs.org/docs).
