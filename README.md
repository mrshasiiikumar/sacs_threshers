# Thresher Manager

A full-stack crop-thresher financial management app built with React + Vite and Supabase.

## What it manages

- Admin login
- Worker master list
- Daily thresher income
- Diesel expenses
- Worker attendance using selectable worker buttons
- Automatic 50/50 owner/worker split
- Equal worker wage calculation
- Daily settlement history
- Worker wage/payment ledger
- Dashboard totals
- Long-term cloud database storage
- Row Level Security (RLS)

## Calculation

For every settlement:

1. Net amount = Total income - Diesel expense
2. Owner share = Net amount / 2
3. Workers share = Net amount / 2
4. Each worker wage = Workers share / Number of selected workers

Example:

Income = ₹20,000
Diesel = ₹2,500
Net = ₹17,500
Owner = ₹8,750
Workers = ₹8,750
6 workers = ₹1,458.33 each

## 1. Create Supabase project

Create a project in Supabase.

Then open:

Supabase Dashboard -> SQL Editor

Run the complete file:

supabase/schema.sql

The SQL creates:
- profiles
- workers
- settlements
- settlement_workers
- dashboard view
- secure RLS policies
- settlement creation function

## 2. Create admin account

In Supabase:

Authentication -> Users -> Add user

Create your admin email and password.

The application uses Supabase Auth. Only authenticated users can read/write business data.

For a single-admin setup, you can use one Supabase user.

## 3. Configure local environment

Copy:

.env.example

to:

.env

Put your Supabase project URL and anon/publishable key in it.

Example:

VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxxx

Do NOT put a Supabase service_role key in this frontend project.

## 4. Run

Open a terminal in THIS project folder (the folder containing package.json):

npm install
npm run dev

Then open the local URL printed by Vite.

## 5. Build for production

npm run build

## Important

The database is the source of truth. The frontend only calculates a preview before saving; the Supabase database function recalculates the settlement values when the record is saved.

This prevents users from changing the browser values and saving an incorrect owner/worker split.

## Project structure

src/
  App.jsx              Main application
  main.jsx             React entry
  supabaseClient.js    Supabase connection
  styles.css           Complete UI styling

supabase/
  schema.sql            Database tables, RLS, indexes and RPC

.env.example            Environment variable template
README.md               Setup instructions
package.json            Dependencies/scripts
