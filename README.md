# Crowdsourcing Platform for Text Detoxification Dataset

This is a web application built to crowdsource non-toxic versions of toxic sentences to create a dataset for fine-tuning text detoxification models.

## Features

1. **User Login**

   - User authentication (no registration required).

2. **Dashboard**

   - Displays:
     - Total number of sentences in the toxic dataset.
     - Number of sentences that have been provided with non-toxic versions.
     - Number of sentences filled by the logged-in user.
     - List of sentences already filled by the logged-in user, allowing editing or deletion.

3. **Input Interface**

   - Users can provide non-toxic versions of randomly selected toxic sentences from the dataset.
   - Sentences are chosen as follows:
     - Priority is given to unfilled sentences.
     - If all sentences have been filled, sentences with only one user's input are prioritized.
   - Option to mark a sentence as "cannot be detoxified."
     - If more than one user marks a sentence as "cannot be detoxified," it is removed from the pool.

4. **Instructions and Disclaimer**

   - Disclaimer: The dataset contains toxic sentences. Users are advised to proceed with caution.
   - Instructions and examples on how to detoxify sentences are provided.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Backend as a Service**: [Supabase](https://supabase.com/)
- **UI Components**: [ShadCN](https://shadcn.dev/)
- **Deployment**: [Vercel](https://vercel.com/)

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/naufal-h/detox-crowdsource.git
   cd detox-crowdsource
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file in the root directory and add the following variables:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

   Replace `your-supabase-url` and `your-supabase-anon-key` with the credentials from your Supabase project.

4. **Run the Development Server**

   ```bash
   npm run dev
   ```

   The application will be available at [http://localhost:3000](http://localhost:3000).

## Deployment

1. **Deploy to Vercel**
   - Push your code to a GitHub, GitLab, or Bitbucket repository.
   - Connect the repository to [Vercel](https://vercel.com/).
   - Add the environment variables (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`) to the Vercel project settings.
   - Vercel will automatically build and deploy your application.

## Usage Instructions

1. Log in to the application.
2. View the dashboard to see your contribution progress and overall dataset stats.
3. Click "Start Input" to begin providing non-toxic versions of toxic sentences.
4. Follow the provided instructions and examples to detoxify sentences.
5. Use the "Mark as Cannot Be Detoxified" option if a sentence cannot be reasonably detoxified.
6. Return to the dashboard to view and edit your contributions.

## Folder Structure

```plaintext
├── app              # Main application components
├── components       # Reusable UI components
├── lib              # Helper libraries (e.g., Supabase client setup)
├── utils            # Utility functions
├── .env.local       # Environment variables (not included in the repo)
├── README.md        # Project documentation
├── next.config.js   # Next.js configuration
├── package.json     # Dependencies and scripts
├── tailwind.config.js # Tailwind CSS configuration
```

---
