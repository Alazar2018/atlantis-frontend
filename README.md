# Ethiopian Leather - E-commerce Frontend

A modern Next.js e-commerce website for Ethiopian leather products, built with TypeScript, Tailwind CSS, and a focus on showcasing authentic Ethiopian craftsmanship.

## Features

- 🛍️ **Product Catalog**: Browse and search through premium leather products
- 🛒 **Shopping Cart**: Add products to cart and manage quantities
- 🇪🇹 **Ethiopian Branding**: Beautiful design featuring Ethiopian colors and culture
- 📱 **Responsive Design**: Works perfectly on all devices
- ⚡ **Fast Performance**: Built with Next.js 14 for optimal performance
- 🎨 **Modern UI**: Clean, intuitive interface with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Package Manager**: npm

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Navigate to the project directory:
```bash
cd atlantis-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
atlantis-frontend/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── page.tsx      # Homepage
│   │   ├── products/     # Product pages
│   │   ├── cart/         # Shopping cart
│   │   ├── about/        # About page
│   │   └── contact/      # Contact page
│   ├── components/        # React components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   └── ...
│   └── ...
├── public/                # Static assets
├── package.json
└── tailwind.config.ts
```

## Features Overview

### Homepage
- Hero section with compelling call-to-action
- Featured products showcase
- "Why Choose Us" section highlighting Ethiopian values
- About section promoting local artisans

### Products
- Product listing with search and category filters
- Individual product detail pages
- Image galleries
- Add to cart functionality

### Shopping Cart
- View cart items
- Update quantities
- Remove items
- Order summary with totals

### Pages
- About: Mission, values, and community impact
- Contact: Contact form and business information

## Design Theme

The website uses Ethiopian flag colors and leather-inspired tones:
- **Primary Green**: #078930 (Ethiopian green)
- **Yellow**: #FCDD09 (Ethiopian yellow)
- **Red**: #DA1212 (Ethiopian red)
- **Leather Brown**: #8B4513
- **Tan**: #D2B48C

## API Integration

The frontend is designed to work with a backend API. Currently using mock data for development. Update API endpoints in:
- `/src/app/api/featured-products/route.ts`
- Product fetching in components

## Environment Variables

Create a `.env.local` file for environment-specific configuration:

```
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
NEXT_PUBLIC_PRIVATE_API_KEY=your_api_key_here
```

## Contributing

This project is built to support Ethiopian artisans and local communities. All development and delivery is proudly Ethiopian.

## License

Copyright © 2024 Ethiopian Leather. All rights reserved.

Made with ❤️ in Ethiopia
