# Froebel Site

A Next.js application built with the App Router and serverless APIs.

## Features

- **Next.js 14** with App Router
- **TypeScript** support
- **Serverless API routes** with examples
- **Modern UI** with Tailwind CSS
- **File-based routing**

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Routes

The project includes several example API routes:

- `GET/POST /api/hello` - Simple hello world API
- `GET/POST /api/users` - User management API
- `GET/PUT/DELETE /api/users/[id]` - Individual user operations
- `GET/POST /api/posts` - Blog posts API with filtering
- `GET/PUT/DELETE /api/posts/[id]` - Individual post operations

## Project Structure

```
app/
├── api/                 # API routes
│   ├── hello/          # Hello world API
│   ├── users/          # Users API
│   └── posts/          # Posts API
├── about/              # About page
├── globals.css         # Global styles
├── layout.tsx          # Root layout
└── page.tsx            # Home page
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [App Router Guide](https://nextjs.org/docs/app)
- [API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)


TODO:
1. Use session or JWT for user login