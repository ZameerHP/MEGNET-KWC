/* =====================================================================
   MAGNETICS KWC — SITE CONFIG
   ---------------------------------------------------------------------
   Every piece of copy, every price and every link lives here.
   Search for "PLACEHOLDER" to find the values you need to replace.
   ===================================================================== */

const IMG = '/images'
const PHOTO = (name, sm = false) => `${IMG}/photos/${name}${sm ? '-sm' : ''}.webp`

export const SITE = {
  name: 'Magnetics KWC',
  url: 'https://magneticskwc.com', // PLACEHOLDER — your live domain (used for SEO / OG)
  email: 'hello@magneticskwc.com', // PLACEHOLDER
  // PLACEHOLDER — WhatsApp number in international format, digits only (no +, spaces or dashes)
  whatsappNumber: '920000000000',
  instagram: 'https://instagram.com/magneticskwc', // PLACEHOLDER
  instagramHandle: '@magneticskwc', // PLACEHOLDER
  whatsappCommunity: 'https://chat.whatsapp.com/', // PLACEHOLDER — community / channel invite link
  // PLACEHOLDER — newsletter endpoint (Formspree, Mailchimp, ConvertKit form action…).
  // Leave empty to show the success message without sending anywhere.
  newsletterEndpoint: '',
  year: 2026,
}

export const waLink = (text = '') =>
  `https://wa.me/${SITE.whatsappNumber}${text ? `?text=${encodeURIComponent(text)}` : ''}`

export const NAV = [
  { label: 'Home', href: '#home' },
  { label: 'Shop', href: '#shop' },
  { label: 'Customize', href: '#customize' },
  { label: 'How It Works', href: '#how' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Gifts', href: '#gifts' },
  { label: 'Contact', href: '#contact' },
]

export const PHOTOS = {
  family: PHOTO('photo-family'),
  travel: PHOTO('photo-travel'),
  pet: PHOTO('photo-pet'),
  wedding: PHOTO('photo-wedding'),
  baby: PHOTO('photo-baby'),
  birthday: PHOTO('photo-birthday'),
  friends: PHOTO('photo-friends'),
}
export const PHOTOS_SM = {
  family: PHOTO('photo-family', true),
  travel: PHOTO('photo-travel', true),
  pet: PHOTO('photo-pet', true),
  wedding: PHOTO('photo-wedding', true),
  baby: PHOTO('photo-baby', true),
  birthday: PHOTO('photo-birthday', true),
  friends: PHOTO('photo-friends', true),
}

export const IMAGES = {
  heroPoster: `${IMG}/hero-magnet.webp`,
  heroFallback: `${IMG}/hero-magnet-fallback.webp`,
  mockupWhite: `${IMG}/mockup-white-fridge.webp`,
  mockupWhiteSm: `${IMG}/mockup-white-fridge-sm.webp`,
  mockupSteel: `${IMG}/mockup-steel-fridge.webp`,
  mockupSteelSm: `${IMG}/mockup-steel-fridge-sm.webp`,
}

export const HERO = {
  eyebrow: 'Handmade with love · Made just for you',
  titleLines: ['Turn Your', 'Favourite Moments', 'Into Fridge Magnets'],
  highlight: 'Fridge Magnets',
  subline: 'Stick your memories. Smile every time you open the fridge. Glossy, chunky, and made just for you.',
  primaryCta: { label: 'Create My Magnet', href: '#customize' },
  secondaryCta: { label: 'See Designs', href: '#shop' },
  chips: ['Glossy Epoxy Finish', 'Strong Magnetic Grip', 'Made To Order'],
  proof: { rating: '4.9', text: 'from happy fridges everywhere' }, // PLACEHOLDER — your real rating
}

export const MARQUEE = [
  { src: PHOTOS_SM.family, alt: 'Family photo magnet', shape: 'rounded' },
  { src: PHOTOS_SM.pet, alt: 'Puppy photo magnet', shape: 'circle' },
  { src: PHOTOS_SM.travel, alt: 'Travel souvenir magnet', shape: 'square' },
  { src: PHOTOS_SM.wedding, alt: 'Wedding favour magnet', shape: 'heart' },
  { src: PHOTOS_SM.baby, alt: 'Baby photo magnet', shape: 'rounded' },
  { src: PHOTOS_SM.birthday, alt: 'Birthday photo magnet', shape: 'circle' },
  { src: PHOTOS_SM.friends, alt: 'Friends photo magnet', shape: 'square' },
]

/* Magnet types (Shop section). `texture` is either a photo URL or a built-in
   generated design: 'quote' | 'promo'. `shape`: square | rounded | circle | heart */
export const MAGNET_TYPES = [
  {
    id: 'photo', name: 'Photo Magnets', emoji: '📸', accent: 'var(--coral)',
    texture: PHOTOS.family, image: PHOTOS_SM.family, shape: 'rounded',
    rating: 4.9, reviews: '1.2k', // PLACEHOLDER
    from: 350, // PLACEHOLDER price — "from" price shown on the card
    blurb: 'Your favourite snap, sealed under a glossy candy-like dome. The one everyone asks about.',
  },
  {
    id: 'quote', name: 'Quote & Gift Magnets', emoji: '💌', accent: 'var(--sun)',
    texture: 'quote', image: null, shape: 'square',
    rating: 4.8, reviews: '640', from: 300,
    blurb: 'Sweet words, inside jokes, little love notes. A tiny gift that says a lot.',
  },
  {
    id: 'travel', name: 'Travel Magnets', emoji: '✈️', accent: 'var(--teal)',
    texture: PHOTOS.travel, image: PHOTOS_SM.travel, shape: 'rounded',
    rating: 4.9, reviews: '820', from: 350,
    blurb: 'Bring the beach home. Turn every trip into a souvenir you will actually look at.',
  },
  {
    id: 'pet', name: 'Pet Magnets', emoji: '🐶', accent: 'var(--mint)',
    texture: PHOTOS.pet, image: PHOTOS_SM.pet, shape: 'circle',
    rating: 5.0, reviews: '910', from: 350,
    blurb: 'Your best furry friend, smiling back at you every time you grab a snack.',
  },
  {
    id: 'wedding', name: 'Wedding & Event Favours', emoji: '💍', accent: 'var(--coral)',
    texture: PHOTOS.wedding, image: PHOTOS_SM.wedding, shape: 'heart',
    rating: 4.9, reviews: '430', from: 250,
    blurb: 'Favours your guests keep forever. Names, dates and your happiest photo.',
  },
  {
    id: 'promo', name: 'Business / Promo', emoji: '🏷️', accent: 'var(--purple)',
    texture: 'promo', image: null, shape: 'rounded',
    rating: 4.8, reviews: '210', from: 180,
    blurb: 'Your logo on every fridge in town. Bulk pricing, fast turnaround, zero fuss.',
  },
]

/* Built-in generated designs (drawn on canvas, so no image file is needed) */
export const GENERATED_DESIGNS = {
  quote: { lines: ['You make', 'my heart', 'smile'], from: '#FFC531', to: '#FF7A6E', ink: '#2A1B7A' },
  promo: { lines: ['YOUR', 'LOGO', 'HERE'], from: '#6B4EFF', to: '#2A1B7A', ink: '#FFFFFF' },
}

/* Pinned "Stick It. Smile." story */
export const STORY = {
  title: 'Stick It. Smile.',
  kicker: 'Every fridge has a story',
  endLine: 'Open the fridge. See your people. Smile. Repeat.',
  cta: { label: 'Start My Fridge Wall', href: '#customize' },
  magnets: [
    { src: PHOTOS_SM.family, alt: 'Family hug', shape: 'rounded', x: 14, y: 20, r: -8, from: 'left' },
    { src: PHOTOS_SM.pet, alt: 'Happy puppy', shape: 'circle', x: 70, y: 16, r: 6, from: 'right' },
    { src: PHOTOS_SM.travel, alt: 'Island holiday', shape: 'square', x: 42, y: 34, r: 3, from: 'top' },
    { src: PHOTOS_SM.wedding, alt: 'Wedding day', shape: 'heart', x: 78, y: 56, r: -6, from: 'right' },
    { src: PHOTOS_SM.baby, alt: 'Baby giggles', shape: 'rounded', x: 12, y: 60, r: 7, from: 'left' },
    { src: PHOTOS_SM.birthday, alt: 'Birthday candles', shape: 'circle', x: 46, y: 68, r: -4, from: 'bottom' },
    { src: PHOTOS_SM.friends, alt: 'Beach selfie', shape: 'square', x: 28, y: 44, r: -10, from: 'left' },
  ],
}

/* ---------------------------------------------------------------------
   PRICING — PLACEHOLDERS. Edit freely; the customizer recalculates live.
   price per magnet = size.price + shape.extra + finish.extra + (text ? textExtra : 0)
   total            = price per magnet × pack.qty × (1 − pack.discount)
   --------------------------------------------------------------------- */
export const PRICING = {
  currency: 'Rs ', // PLACEHOLDER — e.g. '$', '£', 'Rs ', 'AED '
  sizes: [
    { id: 's', label: 'Small', dims: '2" × 2"', price: 300, scale: 0.86 },
    { id: 'm', label: 'Medium', dims: '2.5" × 2.5"', price: 400, scale: 1 },
    { id: 'l', label: 'Large', dims: '3" × 3"', price: 500, scale: 1.12 },
  ],
  shapes: [
    { id: 'square', label: 'Square', extra: 0 },
    { id: 'rounded', label: 'Rounded', extra: 0 },
    { id: 'circle', label: 'Circle', extra: 0 },
    { id: 'heart', label: 'Heart', extra: 50 },
  ],
  finishes: [
    { id: 'glossy', label: 'Glossy Epoxy', note: 'Candy-shine dome', extra: 0 },
    { id: 'matte', label: 'Matte', note: 'Soft, no glare', extra: 0 },
  ],
  textExtra: 50,
  packs: [
    { id: 'p1', qty: 1, label: 'Single', discount: 0 },
    { id: 'p4', qty: 4, label: 'Mini Pack', discount: 0.1, badge: 'Save 10%' },
    { id: 'p9', qty: 9, label: 'Fridge Wall', discount: 0.15, badge: 'Popular' },
    { id: 'p16', qty: 16, label: 'Big Family', discount: 0.2, badge: 'Save 20%' },
  ],
}

export const HOW_IT_WORKS = [
  { title: 'Upload', text: 'Pick your happiest photo and send it our way.', icon: 'upload', color: 'var(--coral)' },
  { title: 'Design', text: 'Choose shape, size, finish and a cute message.', icon: 'design', color: 'var(--sun)' },
  { title: 'We Print & Craft', text: 'Printed in rich colour, sealed in glossy epoxy by hand.', icon: 'craft', color: 'var(--mint)' },
  { title: 'Delivered', text: 'Packed with love, straight to your door. Stick. Smile.', icon: 'deliver', color: 'var(--teal)' },
]

/* PLACEHOLDER REVIEWS — replace with your real customer reviews */
export const REVIEWS = [
  { name: 'Ayesha K.', place: 'Karachi', rating: 5, text: 'My mum cried happy tears. The gloss looks like candy and the magnet grip is seriously strong!', color: 'var(--mint)' },
  { name: 'Daniel R.', place: 'Lahore', rating: 5, text: 'Ordered 9 travel magnets from our honeymoon. Our fridge is now our favourite wall in the house.', color: 'var(--sun)' },
  { name: 'Sana M.', place: 'Islamabad', rating: 5, text: 'Wedding favours were a hit. Guests kept asking where we got them. Super fast on WhatsApp too.', color: 'var(--coral)' },
  { name: 'Omar F.', place: 'Karachi', rating: 4, text: 'Got our dog on a round magnet. He is now officially the boss of the kitchen. Lovely quality.', color: 'var(--teal)' },
  { name: 'Hira A.', place: 'Hyderabad', rating: 5, text: 'Cutest birthday gift ever. Chunky, shiny and the colours pop like crazy. Ordering more!', color: 'var(--purple)' },
  { name: 'Bilal S.', place: 'Multan', rating: 5, text: 'Used them as promo magnets for my café. Customers literally take them home and stick them up.', color: 'var(--mint)' },
]

export const OCCASIONS = [
  { title: 'Birthdays', tag: 'Party favourite', text: 'Cake, candles and a magnet they keep forever.', img: PHOTOS_SM.birthday, color: 'var(--sun)' },
  { title: 'Weddings', tag: 'Guest favours', text: 'Names, dates and your happiest photo.', img: PHOTOS_SM.wedding, color: 'var(--coral)' },
  { title: 'Baby Showers', tag: 'Tiny & sweet', text: 'Little feet, big smiles, softest memories.', img: PHOTOS_SM.baby, color: 'var(--mint)' },
  { title: 'Travel Souvenirs', tag: 'Wander & stick', text: 'Every trip, one shiny square at a time.', img: PHOTOS_SM.travel, color: 'var(--teal)' },
  { title: 'Corporate Gifts', tag: 'Bulk friendly', text: 'Your brand, smiling on every fridge.', img: IMAGES.mockupSteelSm, color: 'var(--purple)' },
  { title: 'Anniversaries', tag: 'Love notes', text: 'Celebrate the years with your favourite faces.', img: PHOTOS_SM.friends, color: 'var(--coral)' },
]

export const BULK = {
  title: 'Bulk Orders',
  text: 'Events, cafés, schools, brands. 50+ magnets? Get special pricing and a free design mock-up.',
  cta: 'Get A Bulk Quote',
  message: 'Hi Magnetics KWC! I would like a quote for a bulk order of magnets.',
}

export const COMMUNITY = {
  title: 'Join the Magnet Club',
  text: 'First dibs on new designs, secret discount drops and fridge-wall inspo from our happy community.',
  newsletterTitle: 'Get Offers In Your Inbox',
  newsletterText: 'One cheerful email a month. No spam, only smiles.',
}

export const FAQ = [
  { q: 'How big are the magnets?', a: 'We offer Small (2"), Medium (2.5") and Large (3"). Need something custom? Just ask us on WhatsApp.' },
  { q: 'What is the glossy epoxy finish?', a: 'A crystal-clear resin dome poured over your print. It makes colours pop, feels like candy and protects your photo from splashes and scratches.' },
  { q: 'Will it really hold on my fridge?', a: 'Yes! Every magnet has a strong flexible magnetic back that grips fridges, whiteboards and any steel surface. It can hold a note or two as well.' },
  { q: 'How do I send my photo?', a: 'Use the customizer to preview, then tap "Order on WhatsApp". We will reply in chat and you can send your photos there in full quality.' },
  { q: 'How long does delivery take?', a: 'Most orders are crafted in 2–4 days and delivered within a week. Bulk orders get a timeline with your quote.' }, // PLACEHOLDER — your real timeline
  { q: 'Can I order for an event or my business?', a: 'Absolutely. We make wedding favours, birthday party packs and branded promo magnets with special bulk pricing.' },
  { q: 'What if my photo is low quality?', a: 'We check every photo before printing. If something looks blurry we will tell you and help you pick a better one.' },
]

export const FOOTER = {
  tagline: 'Stick your memories. Smile every time you open the fridge.',
  links: [
    { label: 'Terms', href: '#' }, // PLACEHOLDER
    { label: 'Privacy', href: '#' }, // PLACEHOLDER
    { label: 'Customer Support', href: '#contact' },
  ],
}
