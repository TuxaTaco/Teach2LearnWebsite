# Teach2Learn deployment and editor setup

The public site is hosted by Vercel. Supabase provides the private login, editable content, and image storage.

## 1. Create the Supabase project

1. Create a Supabase project.
2. Open **SQL Editor**, paste the contents of `supabase/setup.sql`, and run it once.
3. Open **Authentication → Users** and create the private admin email/password.
4. Copy that user's UUID, then run this in SQL Editor:

   ```sql
   insert into public.admin_users (user_id) values ('PASTE_THE_USER_UUID_HERE');
   ```

5. In the project **Connect** dialog, copy the Project URL and Publishable key.

## 2. Connect the local project

Copy `.env.example` to `.env.local` and replace the two placeholder values. Restart `npm run dev` afterward.

The editor is at `/t2l-content-studio`. It is not linked anywhere on the public site and is marked `noindex`, but its real protection is Supabase authentication plus database row-level security.

## 3. Deploy with Vercel

1. Put this project in a GitHub repository.
2. In Vercel, select **Add New → Project**, import the repository, and deploy. Vercel detects Vite automatically.
3. In **Project Settings → Environment Variables**, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` using the same values as `.env.local`.
4. Redeploy once so the variables are included in the site build.

## 4. Connect weteach2learn.com

1. In the Vercel project, open **Settings → Domains** and add `weteach2learn.com` and `www.weteach2learn.com`.
2. Vercel will show the exact DNS records it expects.
3. In Namecheap, open **Domain List → Manage → Advanced DNS** and add the A/CNAME records shown by Vercel. Remove only conflicting parking records; keep email-related MX/TXT records.
4. Return to Vercel and wait for both domains to show as verified. Vercel provisions HTTPS automatically.

Choose one domain as primary and redirect the other to it inside Vercel.
