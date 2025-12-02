# 🧠 WriteWise — Complete Frontend Build Instructions
### (For GitHub Copilot — Use This as Your Global Project Instruction)

You are now responsible for completing **ALL remaining frontend functionality** of the WriteWise blog application.
This document defines the **coding rules**, **API usage**, **UI structure**, and **page requirements**.

Your job is to use these instructions for **every file you generate or modify**.

---

# 🚨 GLOBAL RULES (Copilot MUST Follow These)

### 🔗 API Usage Rules
- **Use ONLY the API endpoints listed in `writewise_blog/todo.md`**
- Do **NOT** create new endpoints unless they appear under “Suggested Additional Endpoints” in that file.
- Every page **must fetch real data** from the backend.
  ❌ **Never** hardcode placeholder JSON.

### 🧭 Routing Rules
- Use Next.js App Router.
- Use **client components** ONLY when handling:
  - State
  - Event handlers
  - Effects
  - Auth
  - Dynamic interactions

### 🔐 Auth Rules
- Use the existing **AuthContext** to:
  - Check authentication
  - Access logged-in user
  - Handle redirect logic
- Protect routes under `/me` and `/dashboard`.

### 🎨 UI + Component Rules
- Use components from the **React Bits UI Library** inside `components/ui/`:
  - `AppleCardsCarousel`
  - `ContainerCover`
  - `SpotlightCard`
  - `ElectricBorder`
  - `Loader`
  - `BlurText`
  - `GradualBlur`
  - `Aurora`
  - And others present in the folder

- Use **logo.svg** from `/public` whenever you need the WriteWise logo.
- Maintain the **techy + aurora + glassmorphic** theme.
- Maintain **full responsiveness** on every page.
- Do NOT break or modify backend logic or naming.

---

# 📄 REQUIRED PAGES (Implement ALL)

Below are all pages that must be implemented, each with strict specifications.

---

# 1️⃣ `/posts/page.js` — Public Posts Page

### IF USER IS NOT AUTHENTICATED:
- Immediately show a centered **glassmorphic popup**.
- Background must blur using `backdrop-blur-xl` + dark overlay.
- Popup contains:
  - A single primary button: **“Sign In / Register”**
  - Clicking it → **navigate to `/signup`**
  - A short text: _“Sign in to explore posts, save favorites, and interact with writers.”_

### IF USER *IS* AUTHENTICATED:
Show the full posts page:

### 🔝 Top Bar
- Left: WriteWise logo
- Center: Search bar (filters posts via API)
- Right: “Dashboard” button → `/dashboard/page.js`

### 🔥 Trending Posts (React Bits)
- Use `AppleCardsCarousel`
- Fetch via:
GET /api/posts/trending?limit=10

- Clicking a card → `/posts/[id]`
- Use `<Loader />` while loading

### 🧭 Explore By Category (Tags)
- Wrap section in `ContainerCover`
- You MUST:
- Fetch tags from backend (`unique` tags from all posts)
- Render horizontal scrollable tag buttons
- Clicking a tag filters posts via:
  ```
  GET /api/posts?tag=<tag>
  ```
- ONLY update the explore grid — trending stays the same
- Render posts using **SpotlightCard** or **Bento layout**

---

# 2️⃣ `/posts/[id]/page.js` — Single Post Page

Fetch the post using:
GET /api/posts/:id


### Show:
- Title
- Author name
- Created date
- Tags
- Content (HTML / rich text)
- Like button → POST /api/likes/:postId

Update like count live.

### Comments
- Fetch: GET /api/comments/:postId

- Add comment:
POST /api/comments/:postId

- Delete comment (if owner):
DELETE /api/comments/:id


Use:
- ElectricBorder for comment box
- Loader when fetching
- Responsive reading layout

---

# 3️⃣ `/me/page.js` — Dashboard Home

### Top Section
- Use `Placeholder-Vanish-Input` component (import from UI folder)
- Acts as the dashboard search bar (filters user’s own posts)

### Stats Cards
Below search bar, display a row (or stacked on mobile) of **glassmorphic info cards**:

Fetch stats from:
GET /api/users/me/stats


Cards:
- Total Posts
- Total Likes (sum of all posts)
- Average Likes per Post
- Draft Count

Use React Bits components for styling:
- ElectricBorder
- SpotlightCard

Everything must be responsive.

---

# 4️⃣ `/me/new/page.js` — Create Post Page

### Requirements:
- Use the existing rich text editor component
- Fields:
  - Title
  - Content
  - Tags
  - Status (draft/published)

### On Submit:
POST /api/posts

Then redirect to `/me`.

### AI Tools (Optional Buttons)
Use the following endpoints:
- `/api/ai/generate-title`
- `/api/ai/tags`
- `/api/ai/summary`
- `/api/ai/outline`
- `/api/ai/rewrite`

Layout:
- Aurora background
- Glass editor card
- Fully responsive

---

# 5️⃣ `/me/[id]/page.js` — Edit Post Page

### Fetch initial data:
GET /api/posts/:id


Features:
- Editable fields
- Save → `PUT /api/posts/:id`
- Delete → `DELETE /api/posts/:id`
- Confirmation modal on delete
- Must check if user is owner using AuthContext

---

# 6️⃣ `/me/draft/page.js` — Drafts Page

### Fetch drafts:
Use:
GET /api/posts/user/:id

Then filter where `status = "draft"`.

Render:
- SpotlightCard or Bento layout
- Clicking draft → `/me/[id]`
- Empty state message

---

# 7️⃣ `/likes/page.js` — Liked Posts Page

Fetch:
GET /api/likes/user/:id


Show posts using:
- SpotlightCard
- AppleCardsCarousel if you want an alternate view

Responsive + loader + empty state.

---

# 8️⃣ `/comments/page.js` — My Comments Page

Fetch all comments made by user:
GET /api/comments/user/:id


For each comment show:
- Snippet of comment
- The post it belongs to (with link `/posts/[id]`)
- Date
- Delete button → `DELETE /api/comments/:id`

---

# 9️⃣ Add Sorting + Pagination (Where Needed)

### Sorting:
Apply to posts feed:
GET /api/posts?sort=likes_desc
GET /api/posts?sort=date_desc
GET /api/posts?sort=date_asc


### Pagination:
GET /api/posts?page=1&limit=10


Use “Previous / Next” buttons + loader.

---

# 🔟 Tag System (Global)

Whenever a tag appears:
- Render as a button
- Clicking navigates to:
/posts?tag=<tag>

- Then fetch:
GET /api/posts?tag=<tag>


---

# 🧩 Integration With Components Library

Use the following **React Bits components** to enhance UI:

| Component | Where to Use |
|----------|--------------|
| `AppleCardsCarousel` | Trending posts |
| `ContainerCover` | Explore-by-category section |
| `SpotlightCard` | Post cards, liked posts, drafts |
| `ElectricBorder` | Highlighted sections |
| `Loader` | All loading states |
| `GradualBlur` | Popups & modals |
| `BlurText` | Section titles |
| `Aurora` | Major background wrappers |

Do NOT recreate these components — import and use them.

---

# 🧩 General Design Rules

- Glass morphism
- Aurora gradients
- Heavy modern typography
- High contrast but not excessive
- Works on all screen sizes
- No horizontal overflow issues
- Keep consistent spacing & layout rhythm

---

# ✔️ FINAL INSTRUCTIONS FOR COPILOT

Every time you write a component or page:

1. **Check todo.md → Use ONLY those endpoints**
2. **Use axios from `lib/axios.js`**
3. **Use AuthContext where needed**
4. **Use components from `components/ui/`**
5. **Write clean, modular, responsive code**
6. **Do not hardcode anything**
7. **Do not modify backend logic**
8. **Follow the styling conventions above**

This completes the entire frontend roadmap.



