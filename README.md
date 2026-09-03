# Shira's Strokes

> **Handmade with Love**

A modern, elegant, and responsive website for **Shira's Strokes**, a handmade creative brand established in 2025. The platform showcases handmade and customised creations while providing an admin dashboard for managing products, images, and customer reviews.

## ✨ Features

### Customer Experience

- Responsive multi-page website
- Home, Products, Our Story, Reviews, and Contact sections
- Product browsing and category filtering
- Product details and enquiry experience
- Custom order enquiries
- Customer review display
- WhatsApp/contact integration
- Smooth page transitions and UI animations
- Mobile-first responsive experience
- Accessible navigation and UI components

### Admin Dashboard

- Secure admin authentication
- Dashboard overview and statistics
- Product management
- Add, edit, and delete products
- Product image uploads
- Cloudinary image storage integration
- Local upload fallback when Cloudinary is unavailable
- Customer review management
- System integration and service status information
- Cloudinary storage and usage monitoring

## 🛠️ Tech Stack

### Frontend

- **Next.js 15** — React framework and application routing
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** — animations and transitions
- **Lucide React** — icons
- **React Hook Form** — form management
- **Zod** — validation
- **Sonner** — toast notifications

### Backend

- **Node.js**
- **Express.js**
- **MongoDB**
- **Mongoose**
- **JWT** — authentication
- **bcryptjs** — password hashing
- **Multer** — file uploads
- **Cloudinary** — cloud image storage
- **dotenv** — environment configuration
- **CORS**

## 📁 Project Structure

```text
shiras-strokes/
├── app/                    # Next.js application routes and pages
├── components/             # Reusable React components
├── lib/                    # Frontend utilities and application logic
├── public/                 # Static assets
├── backend/
│   ├── config/             # Database and Cloudinary configuration
│   ├── controllers/        # API controllers
│   ├── middleware/         # Backend middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # Express API routes
│   ├── utils/              # Backend utilities and seed data
│   └── server.js           # Express server entry point
├── .env                    # Local environment variables
├── next.config.*           # Next.js configuration
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- MongoDB
- A Cloudinary account for cloud image storage

### Installation

Clone the repository:

```bash
git clone https://github.com/Aqib1239/shiras-strokes-studio
cd shiras-strokes-studio
```

Install dependencies:

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root and configure the required environment variables.

Example:

```env
# Frontend
NEXT_PUBLIC_API_URL=http://localhost:5000

# Backend
PORT=5000
MONGODB_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_jwt_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

> **Important:** Never commit real credentials, API keys, database credentials, or JWT secrets to Git.

## 💻 Development

Run both the frontend and backend together:

```bash
npm run dev
```

The frontend will run at:

```text
http://localhost:3000
```

The backend API will run at:

```text
http://localhost:5000
```

### Run Frontend Only

```bash
npm run dev:frontend
```

### Run Backend Only

```bash
npm run dev:backend
```

## 🗄️ Database

The application uses **MongoDB** with **Mongoose** for data persistence.

The backend manages application data such as:

- Products
- Reviews
- Admin/authentication data

### Seed Database

The project includes a seed script:

```bash
npm run seed
```

Use this command when you need to populate the database with the project's initial data.

## ☁️ Cloudinary Image Storage

The application uses **Cloudinary** for cloud-based image storage.

The admin dashboard provides Cloudinary integration information, including:

- Cloudinary connection status
- Storage currently used
- Number of images/resources currently stored
- Cloudinary usage
- Current Cloudinary plan

If Cloudinary is not configured, the application can use the available local upload fallback for supported upload functionality.

## 🔐 Authentication

The admin dashboard uses token-based authentication.

The backend uses:

- **JWT** for authentication
- **bcryptjs** for password hashing
- Protected API routes and middleware

Authentication secrets should only be stored in environment variables.

## 📦 Production Build

Create a production build:

```bash
npm run build
```

Start the Next.js production server:

```bash
npm start
```

Start the Express backend:

```bash
npm run start:backend
```

## 📋 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start frontend and backend together |
| `npm run dev:frontend` | Start the Next.js development server |
| `npm run dev:backend` | Start the Express backend |
| `npm run build` | Create a production Next.js build |
| `npm start` | Start the Next.js production server |
| `npm run start:backend` | Start the Express backend |
| `npm run seed` | Seed the database with initial data |

## 🎨 Design & UI

The website follows a warm, elegant, handmade aesthetic designed specifically for a creative artisan brand.

The visual direction focuses on:

- Warm ivory and cream tones
- Soft blush and dusty rose accents
- Lavender and sage tones
- Elegant typography
- Organic shapes
- Subtle shadows
- Artistic details
- Generous whitespace
- Smooth animations
- Responsive layouts

The goal is to provide a boutique handmade-studio experience rather than a generic e-commerce interface.

## 📱 Responsive Design

The application is optimized for different screen sizes, including:

- Mobile devices
- Small mobile screens
- Tablets
- Laptops
- Desktop displays

The interface is designed to prevent horizontal overflow and provide touch-friendly controls on mobile devices.

## ♿ Accessibility

The project follows common accessibility practices, including:

- Semantic HTML
- Keyboard-friendly navigation
- Visible focus states
- Accessible buttons and forms
- Image alternative text
- Appropriate color contrast
- Skip-to-content navigation
- Responsive and touch-friendly UI

## 🔎 SEO

The application includes Next.js metadata for:

- Page titles
- Meta descriptions
- Open Graph information
- Social sharing metadata
- Website icons and favicon

Example homepage title:

```text
Shira's Strokes | Handmade With Love
```

## 🌸 About Shira's Strokes

**Shira's Strokes** is a handmade creative brand established in **2025**, focused on creating unique handmade and customised products.

The brand offers creative products such as:

- Crochet creations
- Handmade paintings and artworks
- Flowers and bouquets
- Earrings and accessories
- Rakhis
- Handmade crafts
- Customised gifts
- Creative art and craft products

> *Turning creativity into handmade happiness.*

## 🚀 Deployment

The frontend and backend can be deployed separately.

### Frontend

The Next.js frontend can be deployed to platforms that support Next.js, such as Vercel.

Configure:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

### Backend

The Express backend can be deployed to a Node.js-compatible hosting platform.

Configure the backend environment variables:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Make sure the backend CORS configuration allows requests from the deployed frontend domain.

## 🔒 Security

For production deployments:

- Keep `.env` files out of version control
- Use strong JWT secrets
- Never expose Cloudinary API secrets in frontend code
- Never expose MongoDB credentials publicly
- Use HTTPS
- Configure CORS for trusted frontend domains
- Protect admin-only API routes
- Validate incoming request data
- Hash passwords before storing them

## 📄 License

This project is maintained for **Shira's Strokes**.

© 2026 Shira's Strokes. All rights reserved.