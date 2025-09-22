# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/c444c200-edaa-4bcc-95b9-f439c9ad4647

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/c444c200-edaa-4bcc-95b9-f439c9ad4647) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Supabase setup

The application expects listings data to be served from Supabase in the `listings_view`. To create the database structure:

1. Copy the values received from Lovable into a local `.env` file based on `.env.example`:

   ```sh
   cp .env.example .env
   echo "VITE_SUPABASE_URL=https://psomfbtkxvegqfmcfmsf.supabase.co" >> .env
   echo "VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzb21mYnRreHZlZ3FmbWNmbXNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1MzkyMzksImV4cCI6MjA3NDExNTIzOX0.SUAn2FSkGUiul9Dis_aZU1LVO518En_wHeJ6uvEGxNs" >> .env
   ```

   > ⚠️ Do **not** commit the generated `.env` file. The service-role key is sensitive and must never ship to the browser or repo. Keep it only in secure server-side environments or command invocations.

2. Run the SQL in `supabase/schema.sql` inside the Supabase SQL editor (or using the CLI) to create the `autovit_listings` table, the `listings_view` view, admin role helpers, and RLS policies. Re-run this script whenever the schema evolves.

3. Deploy the Autovit import edge function (needed for importul din link):

   ```sh
   supabase functions deploy import-autovit
   ```

   > Comanda de mai sus presupune că folosești `supabase` CLI autentificat în proiectul `psomfbtkxvegqfmcfmsf`.

4. Seed a sample Autovit listing (optional, but useful to verify the connection):

   ```sh
   SUPABASE_SERVICE_URL=https://psomfbtkxvegqfmcfmsf.supabase.co \
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzb21mYnRreHZlZ3FmbWNmbXNmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODUzOTIzOSwiZXhwIjoyMDc0MTE1MjM5fQ.rOE0P5DRAXJqq27TatZv-VOA89LoPcl448Y4BEprcUs \
   npm run seed:sample
   ```

5. Create at least one admin account so you can manage adverts through Supabase Auth:

   - Sign up with the email/password you will use in the admin dashboard (e.g. via Supabase Auth UI, Supabase Dashboard > Auth > Add User, or a temporary API call).
   - Insert the newly created user's UUID into `public.admin_users`:

     ```sql
     insert into public.admin_users (user_id, role)
     values ('<AUTH-USER-UUID>', 'admin')
   on conflict (user_id) do update set role = excluded.role;
   ```

   All requests authenticated as that user (via `supabase.auth.signInWithPassword`) will inherit admin rights and can insert/update/delete listings client-side or via API routes. Non-admin authenticated users are restricted to read-only access. Anonymous traffic only sees listings with `status = 'ACTIVE'`.

6. Accesează panoul `/admin` în aplicație pentru a te autentifica (folosind utilizatorul creat mai sus) și pentru a adăuga, edita sau arhiva anunțuri.

   - Tab-ul **Import Autovit** permite inserția rapidă prin simpla introducere a linkului Autovit, folosind funcția edge `import-autovit` ce normalizează automat datele.
   - Tab-ul **Adaugă manual** oferă un formular minimal pentru anunțuri fără link Autovit (se generează automat un `manual-<uuid>` intern).
   - Tab-ul **Editează** apare după selectarea unui anunț din listă și permite ajustări detaliate.

   Lista se actualizează automat după fiecare import sau salvare, iar statusul „ACTIVE” controlează vizibilitatea pe site-ul public (`/`, `/cumpara`, `/car/:id`).

The frontend automatically falls back to the bundled sample listing if Supabase is empty or unreachable, so you can continue developing without live data.

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/c444c200-edaa-4bcc-95b9-f439c9ad4647) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
