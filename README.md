# WriteWise ✨  
**AI-powered writing platform for modern storytellers.**

WriteWise is a full-stack, production-ready blogging platform built with **Next.js**, **Express.js**, **Prisma**, and **PostgreSQL**, designed to help writers create, refine, and publish content with the power of AI.  
It blends a minimal, modern design with Aurora-inspired visuals, glassmorphism UI, and smooth animated interactions using React Bits.

---

## 🚀 Features

### **Rich Writing Experience**
- Modern, distraction-free editor   
- Commenting & likes  

###  **AI-Powered Tools**
- Generate blog **titles**, **summaries**, **outlines**, and **SEO tags**  
- AI-driven content suggestions integrated directly into the editor  

###  **Authentication**
- Email & password login/signup  
- **OAuth 2.0 Google Sign-In**  
- Secure JWT-based sessions stored in **HTTP-only cookies**

### **Dashboard**
- Create, edit, delete posts  
- Manage drafts  
- Access all AI features  
- Profile management  

### **Public Blog**
- View all posts  
- Read author-specific posts  
- Fully responsive UI  

### **UI & Interaction**
- Aurora backgrounds across pages  
- Glassmorphism design language  
- Animated interactions using React Bits  
- Dark mode built-in  
- Curated components: CardSwap, SpotlightCard, ElectricBorder, GradualBlur, etc.


---


## 🛠️ Tech Stack

### **Frontend**
- Next.js 14+ (App Router)  
- TailwindCSS  
- React Bits (custom animated components)  
- React Hook Form  
- Axios  

### **Backend**
- Node.js + Express.js  
- Prisma ORM  
- PostgreSQL  
- JWT Authentication  
- Google OAuth 2.0  
- OpenRouter (or compatible) API for AI tools  

---

## ⚙️ Installation & Setup

### Clone the repository

```bash
git clone https://github.com/vks-g/WriteWise.git
cd WriteWise
```

### Backend Setup

#### Install Dependencies

```bash
cd backend
npm install
```

#### Environment Variables

Create a `.env` file inside `backend/`

```ini

DATABASE_URL="mysql://user:password@localhost:3306/writewise"
JWT_SECRET="your_jwt_secret"
CLIENT_ID="your_google_client_id"
CLIENT_SECRET="your_google_client_secret"
AI_API_KEY="your_ai_api_key"
FRONTEND_URL="your_frontend_port"
BACKEND_URL="your_backend_port"
REDIRECT_PATH="your_redirect_path"

```

#### Prisma migration

```bash
npx prisma migrate dev
npx prisma generate
```

#### Run backend

```bash
npm start
```

## Frontend Setup

#### Install dependencies

```bash
cd frontend
npm install
```

#### Environment variables

Create `.env.local`

```ini
BACKEND_URL="your_backend_url"
```

#### Start frontend

```bash
npm run dev
```

## 🙌 Acknowledgements

- **React Bits** for providing animated UI components
- **Prisma** for clean database workflows
- **Google** for OAuth 2.0
- **OpenRouter** for free api key ( will update soon)