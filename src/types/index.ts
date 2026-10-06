// Official Roles of Resolva Fácil
export type UserRole = 'client' | 'partner' | 'admin';

// Official /users/{userId} document
export interface User {
  id: string; // matches auth.uid
  name?: string;
  phone?: string;
  email?: string;
  role: UserRole;
  avatarUrl?: string;
  photoUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  addresses?: Address[];
  favoriteProfessionals?: string[];
  isSubscribed?: boolean; // Clube Resolva Fácil Prime
}

// UserProfile alias for UI compatibility
export type UserProfile = User;

export interface Address {
  id: string;
  title: string; // ex: "Casa", "Trabalho"
  street: string;
  number: string;
  floor?: string;
  postalCode: string;
  city: string;
  notes?: string;
  isDefault?: boolean;
}

// Official /partners/{partnerId} document
export interface Partner {
  id: string; // REAL partner document ID in /partners
  userId?: string; // Firebase Auth UID
  name: string;
  phone?: string;
  email?: string;
  photoUrl?: string;
  documentUrl?: string;
  images?: string[];
  categories?: string[];
  specialties?: string[]; // e.g. ['Canalização', 'Eletricidade']
  rating?: number; // 4.9
  reviewCount?: number;
  completedJobs?: number;
  hourlyRate?: number;
  status?: 'pending' | 'approved' | 'suspended' | string;
  isActive?: boolean;
  verifiedDocuments?: boolean;
  bio?: string;
  badges?: string[]; // ['Top Profissional', 'Garantia Resolva Facil']
  createdAt?: string;
  updatedAt?: string;
}

// Professional alias for UI compatibility
export type Professional = Partner;

// Order & Booking Status
export type BookingStatus =
  | 'pending' // Aguarda confirmação / Atribuição
  | 'accepted' // Parceiro atribuído
  | 'on_the_way' // A caminho
  | 'in_progress' // A decorrer
  | 'completed' // Concluído
  | 'cancelled'; // Cancelado

// Official /orders/{orderId} document
export interface Order {
  id: string; // order document ID
  clientId: string; // Firebase Auth UID of client
  clientName?: string;
  clientPhone?: string;
  userName?: string;
  userPhone?: string;
  userId?: string;
  partnerId?: string; // REAL document ID of /partners (NOT necessarily auth.uid)
  partnerName?: string;
  partnerPhoto?: string;
  partnerPhone?: string;
  professionalId?: string;
  professionalName?: string;
  professionalPhoto?: string;
  professionalPhone?: string;
  serviceId?: string;
  serviceTitle?: string;
  category?: string;
  categoryName?: string;
  serviceImageUrl?: string;
  description?: string;
  urgency?: 'baixa' | 'normal' | 'alta' | 'urgente' | string;
  status: BookingStatus | string;
  commission?: number;
  price?: number;
  totalPrice?: number;
  date?: string; // YYYY-MM-DD
  scheduledDate?: string;
  timeSlot?: string; // e.g. "09:00 - 11:00"
  scheduledTime?: string;
  address?: Address | any;
  notes?: string;
  paymentMethod?: 'mbway' | 'card' | 'multibanco' | 'cash' | string;
  paymentStatus?: 'paid' | 'pending' | 'refunded' | string;
  createdAt: string;
  updatedAt?: string;
  review?: {
    rating: number;
    comment: string;
    createdAt: string;
  };
}

// Booking alias for UI compatibility
export type Booking = Order;

// Official /siteSettings/{settingId} document
export interface SiteSetting {
  id: string;
  siteName?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  maintenanceMode?: boolean;
  [key: string]: any;
}

// Official /socialLinks/global document
export interface SocialLinks {
  id?: string;
  instagram?: string;
  facebook?: string;
  whatsapp?: string;
  linkedin?: string;
  youtube?: string;
  tiktok?: string;
}

// Official /accessLogs/{logId} document
export interface AccessLog {
  id: string;
  userId?: string;
  userEmail?: string;
  role?: string;
  action: string;
  details?: string;
  timestamp: string;
}

// Official /documents/{docId} document
export interface DocumentItem {
  id: string;
  partnerId?: string;
  userId?: string;
  name: string;
  url: string; // Vercel Blob URL (https://...public.blob.vercel-storage.com/...)
  type?: string;
  status?: 'pending' | 'verified' | 'rejected';
  createdAt?: string;
}

// Legacy UI types for service catalog display
export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  description: string;
  serviceCount: number;
  popular?: boolean;
}

export interface ServiceItem {
  id: string;
  categoryId: string;
  categoryName: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number; // in BRL (R$)
  originalPrice?: number;
  discountPercentage?: number;
  durationMinutes: number;
  popular?: boolean;
  bestOffer?: boolean;
  includedItems?: string[];
  rating: number;
  reviewCount: number;
}

export interface CustomServiceRequest {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  description: string;
  estimatedHours: number;
  hourlyRate: number;
  preferredDate: string;
  preferredTime: string;
  address: Address;
  status: 'pending' | 'quoted' | 'accepted' | 'completed';
  createdAt: string;
}

export interface Review {
  id: string;
  bookingId: string;
  serviceId: string;
  professionalId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  userId?: string;
  title: string;
  message: string;
  type: 'booking' | 'promo' | 'system';
  read: boolean;
  createdAt?: string;
  timestamp?: string;
  bookingId?: string;
}
