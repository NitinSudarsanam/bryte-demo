# BRYTE Website

Official website for BRYTE (Brown Refugee Youth Tutoring & Enrichment) - a student-run organization at Brown University dedicated to supporting refugee youth through academic tutoring and mentoring.

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** CSS Modules + Global CSS
- **CMS:** Cosmic CMS (Headless CMS)
- **UI Components:** Radix UI (Accordion, Navigation Menu, Dialog)
- **Fonts:** League Spartan

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Cosmic CMS account with two buckets:
  - Main content bucket (pages, sections, FAQs, resources)
  - Posts bucket (blog posts)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/fullstackatbrown/project-bryte.git
cd project-bryte
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with your Cosmic CMS credentials:
```env
# Main content bucket (server-side)
COSMIC_BUCKET_SLUG="your-main-bucket-slug"
COSMIC_READ_KEY="your-main-read-key"

# Posts bucket (client-side)
NEXT_PUBLIC_COSMIC_BUCKET_SLUG="your-posts-bucket-slug"
NEXT_PUBLIC_COSMIC_READ_KEY="your-posts-read-key"
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/app/
├── components/         # Reusable UI components
│   ├── accordion/     # FAQ accordion component
│   ├── header/        # Navigation header
│   ├── masthead/      # Page hero section
│   ├── section/       # Content section component
│   └── slideshow/     # Image slideshow
├── pages/             # Route pages
│   ├── about/        # About Us page
│   ├── calendar/     # Calendar page
│   ├── contact/      # Contact/Join Us page
│   ├── faqs/         # FAQ page
│   ├── media/        # Media page
│   ├── partners/     # Community Partners page
│   ├── posts/        # Blog posts listing
│   └── resources/    # Resources page
├── post/[slug]/       # Individual blog post page
├── lib/               # Utility functions
│   └── cosmic.ts     # Cosmic CMS client
└── globals.css        # Global styles
```

## Key Features

- **Dynamic Content Management:** All content (pages, sections, FAQs, resources, blog posts) is managed through Cosmic CMS, enabling non-technical team members to update the website without code changes
- **Responsive Design:** Mobile-first approach with responsive layouts across all devices
- **Smooth Animations:** Radix UI accordions with custom slide-down/slide-up animations for FAQs and resources
- **Blog System:** Full-featured blog with categories, filtering, search functionality, and individual post pages
- **Google Calendar Integration:** Embedded Google Calendar on the calendar page for event management
- **Resource Hub:** Organized resources for parents and tutors with collapsible sections
- **Image Slideshow:** Interactive slideshow component with smooth transitions and rounded images on the Partners page
- **Server-Side Rendering:** Next.js App Router with server components for optimal performance and SEO

## Site Navigation

The website is organized with the following main pages accessible from the navigation header:

### Public Pages
- **Home (`/`)** - Landing page with mission statement, statistics, and key sections
- **About (`/pages/about`)** - Organization information with expandable sections:
  - Our Mission
  - Our Values
  - Our Team
  - Community subsections
- **Calendar (`/pages/calendar`)** - Embedded Google Calendar showing upcoming events
- **FAQ (`/pages/faqs`)** - Frequently asked questions in accordion format
- **Media (`/pages/media`)** - Media coverage and press
- **Partners (`/pages/partners`)** - Community partners with image slideshow
- **Resources (`/pages/resources`)** - Combined parent and tutor resources with collapsible sections
- **Posts (`/pages/posts`)** - Blog listing page with search, category filtering, and pagination
- **Individual Post (`/post/[slug]`)** - Dynamic route for individual blog post pages
- **Contact (`/pages/contact`)** - Contact form and information for joining BRYTE

### Content Management with Cosmic CMS

All dynamic content is stored in Cosmic CMS buckets:

#### Main Bucket (`COSMIC_BUCKET_SLUG`)
Contains:
- **Pages** - Home page, About page, FAQ page content
- **Sections** - Reusable content blocks (What's BRYTE, Why BRYTE, etc.)
- **FAQs** - Frequently asked question items
- **Resources** - Parent resources and tutor resources
- **Images** - Slideshow images and section images

#### Posts Bucket (`NEXT_PUBLIC_COSMIC_BUCKET_SLUG`)
Contains:
- **Posts** - Individual blog posts with metadata, featured images, categories, and authors
- **Categories** - Blog post categories for filtering
- **Authors** - Author profiles with bios and photos

The Cosmic CMS integration uses:
- Server-side fetching for most pages (via `fetchCosmicObject` and `fetchCosmicObjects` in `lib/cosmic.ts`)
- Client-side fetching for the posts page (using `NEXT_PUBLIC_*` environment variables)
- Depth parameter for nested relationships (e.g., posts with authors and categories)

## Design System

### Colors
- `#fefae1` - Cream (background)
- `#fce794` - Yellow (accents)
- `#22300d` - Dark Green (text/sections)
- `#964238` - Maroon (pills/buttons)
- `#6e7e4a` - Olive Green (borders)

### Typography
- Primary Font: League Spartan (Google Fonts)
- Font weights: 400 (regular), 700 (bold)

## Deployment

### Recommended: Vercel

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com) and sign in with GitHub
3. Import your repository
4. Add environment variables from `.env.local`
5. Deploy!

### Environment Variables for Production

Make sure to add all four environment variables in your hosting platform:
- `COSMIC_BUCKET_SLUG`
- `COSMIC_READ_KEY`
- `NEXT_PUBLIC_COSMIC_BUCKET_SLUG`
- `NEXT_PUBLIC_COSMIC_READ_KEY`

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Cosmic CMS Documentation](https://www.cosmicjs.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/docs)

## Contributing

This project is maintained by students at Brown University. For questions or contributions, please contact Full Stack at Brown or the BRYTE organization.

## License

© 2025 BRYTE - Brown Refugee Youth Tutoring & Enrichment
