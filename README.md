# NestBoard - Web Frontend

## Overview

The **NestBoard** web frontend is a property rental and co-living platform built with **React 19** and **TypeScript**, designed for browsing, booking, and managing co-living spaces across Sri Lanka. It features a clean, responsive interface styled with **Tailwind CSS v4** and **shadcn/ui** components, with **TanStack Query** handling all server state and **Zustand** managing lightweight client state like search filters. The app covers two distinct experiences in one codebase: a public-facing tenant side and a protected admin dashboard, each with its own layout and navigation.

## Features

- **Property Listings**: Browse co-living properties with live search, category filters (House, Villa, Apartment, Hotel), and a paginated results grid.
- **Property Details**: View full property info, room types, amenities, and real-time seat availability before committing to a booking.
- **Room Type and Seat Selection**: Drill down into a specific room type, pick a room and seat number, set a lease start date and duration in months, and see the total price before confirming.
- **Stripe Payments**: Booking confirmation triggers a redirect to a Stripe-hosted checkout page. Success and cancel pages handle the redirect back.
- **Favourites**: Tenants can heart a property from any listing card to save it, and view all saved properties on a dedicated page.
- **My Bookings**: A full booking history for the current tenant, with statuses - Pending, Confirmed, Cancelled, and Expired.
- **Tenant Dashboard**: Quick stats on booking counts and fast navigation links to the most-used sections.
- **Google OAuth**: Sign in with a Google account in addition to the standard email and password flow.
- **Admin Dashboard**: Overview cards with total properties, rooms, active bookings, monthly revenue in LKR, and recent booking activity.
- **Admin Property Management**: Full CRUD for properties with cover image uploads, room type creation, and individual room management all on one page.
- **Admin Bookings**: View and manage all bookings across every property from a single table.
- **Admin Settings**: Update the admin display name.
- **Theme Support**: Light and dark mode via a theme provider that respects system preference.

## Repositories

- **Backend API**: [NestBoard Backend Repository](#)
- **Mobile App**: [NestBoard Mobile Repository](#)

## Tech Stack

- **React 19**: Core UI framework.
- **TypeScript**: Strict mode throughout.
- **Vite 7**: Development server and production build tool.
- **Tailwind CSS v4**: Utility-first styling.
- **shadcn/ui**: Pre-built accessible components built on Radix UI primitives.
- **TanStack Query v5**: Server state management - fetching, caching, and mutations.
- **Zustand v5**: Client state for search and filter values.
- **React Router v7**: Client-side routing.
- **@react-oauth/google**: Google OAuth sign-in integration.
- **Lucide React**: Icon library.
- **Netlify**: Deployment platform (netlify.toml included).

## Installation & Setup

### Prerequisites

- Node.js v18 or later

### Steps

#### 1. Clone the Repository

```sh
git clone https://github.com/ZafraZiaudeen/nest-board-fe.git
cd nest-board-fe
```

#### 2. Install Dependencies

```sh
npm install
```

#### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_API_URL=http://localhost:3001
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

`VITE_GOOGLE_CLIENT_ID` is optional. If not set, the Google sign-in button is hidden and only email/password login is shown.

#### 4. Start the Development Server

```sh
npm run dev
```

The app runs at **http://localhost:5173**.

## Usage

- **Home Page**: Displays all active properties. Use the search bar or category tabs to filter results. Each card shows the property image, location, price per month, and a favourite toggle.
- **Property Details**: Click any property card to see the full listing, including available room types with price and amenities.
- **Room Booking**: Select a room type, pick a seat, choose your lease start date and duration, then confirm the booking. You are redirected to Stripe to complete payment.
- **My Bookings**: View the full history of your bookings, including payment status and lease dates. Accessible from the navigation bar after signing in.
- **Saved Properties**: Click the heart icon on any property to save it. View your full list from the saved icon in the nav.
- **Dashboard**: A quick overview of your active and past bookings with shortcut links.
- **Admin Area**: Sign in with an ADMIN account to access the admin dashboard at `/admin`. From there, manage properties, room types, rooms, and bookings.
- **Authentication**: Sign in or register from `/sign-in` and `/sign-up`. Google OAuth is supported.

## Contributing

Fork the repository.

Create a branch:

```sh
git checkout -b feature/your-feature
```

Commit your changes:

```sh
git commit -m "Add your feature"
```

Push to your branch:

```sh
git push origin feature/your-feature
```

Open a pull request.

## Contact

For any inquiries, feel free to reach out: zafraziaudeen@gmail.com
