// Property Types
export const PROPERTY_TYPES = [
  { value: 'plot', label: 'Plot/Land', icon: 'MapPin' },
  { value: 'residential', label: 'Residential', icon: 'Home' },
  { value: 'commercial', label: 'Commercial', icon: 'Building2' },
  { value: 'apartment', label: 'Apartment', icon: 'Building' },
  { value: 'villa', label: 'Villa', icon: 'Castle' },
];

// Property Status
export const PROPERTY_STATUS = [
  { value: 'available', label: 'Available', color: 'green' },
  { value: 'sold', label: 'Sold', color: 'red' },
  { value: 'reserved', label: 'Reserved', color: 'yellow' },
];

// Area Units
export const AREA_UNITS = [
  { value: 'decimal', label: 'Decimal' },
  { value: 'sqft', label: 'Sq. Ft.' },
  { value: 'sqyd', label: 'Sq. Yard' },
  { value: 'acre', label: 'Acre' },
  { value: 'hectare', label: 'Hectare' },
];

// Currencies
export const CURRENCIES = [
  { value: 'INR', label: '₹ INR', symbol: '₹' },
  { value: 'USD', label: '$ USD', symbol: '$' },
];

// Inquiry Types
export const INQUIRY_TYPES = [
  { value: 'inquiry', label: 'General Inquiry' },
  { value: 'site_visit', label: 'Site Visit Request' },
  { value: 'callback', label: 'Request Callback' },
];

// Inquiry Status
export const INQUIRY_STATUS = [
  { value: 'new', label: 'New', color: 'blue' },
  { value: 'contacted', label: 'Contacted', color: 'yellow' },
  { value: 'qualified', label: 'Qualified', color: 'purple' },
  { value: 'closed', label: 'Closed', color: 'green' },
];

// Common Features
export const PROPERTY_FEATURES = [
  'Parking',
  'Garden',
  'Swimming Pool',
  'Gym',
  'Security',
  'Power Backup',
  'Water Supply',
  'Road Access',
  'Corner Plot',
  'Park Facing',
  'Main Road Facing',
  'Gated Community',
  'Club House',
  'Children Play Area',
  'Rainwater Harvesting',
];

// Testimonials
export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Rajesh Sharma',
    role: 'Home Buyer',
    content: 'Found my dream plot through PlotVastu. The team was extremely helpful and professional throughout the process.',
    rating: 5,
    image: '/testimonials/person1.jpg',
  },
  {
    id: 2,
    name: 'Priya Patel',
    role: 'Investor',
    content: 'Excellent selection of properties. The website made it easy to compare different options and make an informed decision.',
    rating: 5,
    image: '/testimonials/person2.jpg',
  },
  {
    id: 3,
    name: 'Amit Kumar',
    role: 'Property Owner',
    content: 'Listed my property and got genuine inquiries within days. The platform really works!',
    rating: 5,
    image: '/testimonials/person3.jpg',
  },
];

// Navigation Links
export const PUBLIC_NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/properties', label: 'Properties' },
  { href: '/contact', label: 'Contact' },
];

export const ADMIN_NAV_LINKS = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { href: '/admin/properties', label: 'Properties', icon: 'Home' },
  { href: '/admin/leads', label: 'Leads', icon: 'Users' },
  { href: '/admin/settings', label: 'Settings', icon: 'Settings' },
];
