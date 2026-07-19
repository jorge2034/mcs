export interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  image?: string;
}

export interface Mineral {
  id: number;
  name: string;
  symbol: string;
  description: string;
  image?: string;
  uses: string[];
}

export interface LMEPrice {
  id: number;
  metal: string;
  symbol: string;
  price: number;
  currency: string;
  change: number;
  changePercent: number;
  date: string;
  time: string;
}

export interface NewsItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image?: string;
  category: string;
  publishedAt: string;
  author?: string;
  tags?: string[];
  documents?: Document[];
  gallery?: string[];
}

export interface Client {
  id: number;
  name: string;
  logo: string;
  url?: string;
}

export interface TeamMember {
  id: number;
  name: string;
  position: string;
  photo?: string;
  linkedin?: string;
}

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

export interface ContactForm {
  name: string;
  company?: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  phone: string;
  phone2?: string;
  email: string;
  address: string;
  city: string;
  country: string;
  whatsapp: string;
  googleMapsEmbed: string;
  socialNetworks: SocialNetwork[];
}

export interface SocialNetwork {
  platform: string;
  url: string;
  icon: string;
}

export interface Document {
  title: string;
  url: string;
  type: 'pdf' | 'excel' | 'doc';
}
