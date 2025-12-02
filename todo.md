# 📌 WriteWise API Reference (Frontend–Backend Sync Guide)
### _All endpoints extracted from Capstone_FullStack_Proposal.pdf and structured for Copilot._

---

# 🔐 Auth & User Routes

### Authentication
| Endpoint             | Method | Description                       | Access          |
|----------------------|--------|-----------------------------------|------------------|
| `/api/auth/signup`   | POST   | Register a new user               | Public          |
| `/api/auth/login`    | POST   | Authenticate user                 | Public          |
| `/api/auth/logout`   | POST   | Logout user and clear token       | Authenticated   |

### User Profile
| Endpoint             | Method | Description                       | Access          |
|----------------------|--------|-----------------------------------|------------------|
| `/api/users/me`      | GET    | Get authenticated user's profile  | Authenticated   |
| `/api/users/:id`     | PUT    | Update user profile               | Authenticated   |
| `/api/users/:id`     | DELETE | Delete user account               | Authenticated   |

---

# 📝 Blog Post Routes

| Endpoint                       | Method | Description                                            | Access        |
|--------------------------------|--------|--------------------------------------------------------|---------------|
| `/api/posts`                   | GET    | Get all blog posts (search, sort, filter, pagination)  | Public        |
| `/api/posts/:id`               | GET    | Get a single post by ID                                | Public        |
| `/api/posts`                   | POST   | Create a blog post                                     | Authenticated |
| `/api/posts/:id`               | PUT    | Update a blog post                                     | Owner only    |
| `/api/posts/:id`               | DELETE | Delete a blog post                                     | Owner/Admin   |
| `/api/posts/user/:id`          | GET    | Get all posts by a specific user                       | Public        |
| `/api/posts/search?q=`         | GET    | Search posts by title, content, or tag                 | Public        |

### Example advanced query:

GET /api/posts?search=ai&sort=date_desc&filter=tech&page=2&limit=10


---

# 💬 Comment Routes

| Endpoint                     | Method | Description                   | Access        |
|------------------------------|--------|-------------------------------|---------------|
| `/api/comments/:postId`      | GET    | Get all comments on a post    | Public        |
| `/api/comments/:postId`      | POST   | Add a comment to a post       | Authenticated |
| `/api/comments/:id`          | DELETE | Delete a comment              | Owner/Admin   |

---

# ❤️ Like Routes

| Endpoint                     | Method | Description                    | Access        |
|------------------------------|--------|--------------------------------|---------------|
| `/api/likes/:postId`         | POST   | Like/unlike a post             | Authenticated |
| `/api/likes/user/:id`        | GET    | Get all liked posts by user    | Authenticated |

---

# 🤖 AI Routes

| Endpoint                       | Method | Description                     | Access        |
|--------------------------------|--------|---------------------------------|---------------|
| `/api/ai/generate-title`       | POST   | Generate a blog title           | Authenticated |
| `/api/ai/summary`              | POST   | Generate a summary              | Authenticated |
| `/api/ai/tags`                 | POST   | Generate SEO tags               | Authenticated |
| `/api/ai/outline`              | POST   | Generate blog outline           | Authenticated |
| `/api/ai/rewrite`              | POST   | Rewrite a paragraph             | Authenticated |

---

# 🧩 Suggested Additional Endpoints (needed for your new frontend)

### Trending posts (based on likes)

GET /api/posts/trending?limit=10

### Filter posts by category (tag)

GET /api/posts?tag=tech

### User stats for dashboard

GET /api/users/me/stats


Example expected response:
```json
{
  "totalPosts": 24,
  "totalLikes": 320,
  "averageLikes": 13.3,
  "drafts": 4
}

✔️ Instructions for Copilot

Use ONLY the above endpoints for all API calls.
Do NOT invent new ones unless clearly listed under "Suggested Additional Endpoints".
Match the exact parameter names and structure.

