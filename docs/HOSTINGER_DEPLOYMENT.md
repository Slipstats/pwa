# 🚀 Hostinger hPanel Node.js Deployment Guide (No VPS Required)

This guide is tailored specifically for deploying **Slipstats** to your **Hostinger Web/Cloud Hosting account via hPanel**, where your domain and email are already configured.

---

## 📋 Overview of How It Works on hPanel
Hostinger's hPanel includes a built-in **Node.js Application Manager**.
We have added a custom [`server.js`](file:///c:/Users/digit/OneDrive/Desktop/GITHUB/slipstats/server.js) entry file to the root of your project. This file automatically starts your Next.js application and connects to the port assigned by Hostinger, operating well within Hostinger's memory limits.

---

## 🛠️ Step-by-Step Deployment on Hostinger hPanel

### Step 1: Upload Your Code to Hostinger
You can upload the files either via **hPanel File Manager** or **Git / FTP**:

#### Method 1: Via Git (Recommended)
1. In **hPanel**, search for **Git**.
2. Click **Create a New Repository**:
   * **Repository**: Enter your GitHub repo URL (e.g., `https://github.com/your-username/slipstats.git`).
   * **Branch**: `main`.
   * **Install Path**: `/public_html` (or a subfolder like `/slipstats`).
3. Click **Create** ➔ then click **Deploy**.

#### Method 2: Via File Manager (ZIP upload)
1. On your computer, zip the project files (exclude `node_modules` and `.git` to keep the file small, around 2-5 MB).
2. In **hPanel**, go to **File Manager** ➔ open `public_html`.
3. Click **Upload** ➔ upload the `.zip` file.
4. Right-click the `.zip` file and select **Extract**.

---

### Step 2: Configure the Node.js Application in hPanel
1. In your **hPanel Dashboard**, use the search bar or scroll down to the **Advanced** section and click on **Node.js** (or **Node.js Apps**).
2. Click **Create Application** (or **Add Application**):
   * **Node.js Version**: Select **`20.x`** or **`22.x`** (LTS).
   * **Application Mode**: Select **`Production`**.
   * **Application Root**: Set to `public_html` (or the folder where your files are located).
   * **Application URL**: Select your domain from the dropdown (e.g., `yourdomain.com`).
   * **Application Startup File**: Enter **`server.js`**.
3. Click **Create** / **Save**.

---

### Step 3: Install Packages & Build Next.js
Hostinger gives you two ways to run the build:

#### Option A: Via SSH / Web Terminal in hPanel (Fastest)
1. In hPanel, go to **Advanced** ➔ **SSH Access** (or **Terminal**).
2. Connect or open the in-browser terminal:
   ```bash
   cd public_html
   npm install
   npm run build
   ```
3. Copy static files into the standalone folder:
   ```bash
   cp -r public .next/standalone/
   cp -r .next/static .next/standalone/.next/
   ```

#### Option B: Via hPanel "NPM Install" Button
1. On the Node.js management page in hPanel, you will see a button labeled **"Run NPM Install"**. Click it.
2. Under "Run Script", you can enter `build` to trigger `npm run build`.

---

### Step 4: Add Environment Variables in hPanel
On the Node.js App settings page in hPanel, scroll to **Environment Variables** and add:
* `NODE_ENV` = `production`
* `NEXT_PUBLIC_DEFAULT_CURRENCY` = `ZAR`
* `NEXT_PUBLIC_SUPABASE_URL` = `https://your-project.supabase.co`
* `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `your-anon-key`

---

### Step 5: Start or Restart the App
1. In the hPanel Node.js section, click the **Restart Application** (or **Start**) button.
2. Open your domain (e.g. `https://yourdomain.com`) in your browser.
3. Your **Slipstats** PWA is now live, running fast on Node.js with free SSL and custom domain!

---

## ❓ FAQ & Troubleshooting

* **Does this affect my existing domain email on Hostinger?**
  * **No.** Hostinger manages emails via MX and DNS records on separate mail servers. Running Node.js on `public_html` does not touch or disrupt your email inbox.
* **What if Hostinger's Node.js port is dynamic?**
  * [`server.js`](file:///c:/Users/digit/OneDrive/Desktop/GITHUB/slipstats/server.js) automatically reads `process.env.PORT`, meaning it seamlessly binds to whichever port Hostinger assigns.
* **Why is memory consumption so low?**
  * Because `output: 'standalone'` is enabled in `next.config.ts`, Next.js only loads required modules, typically consuming just **70–90MB of RAM** (well below Hostinger's Cloud/Shared limits).
