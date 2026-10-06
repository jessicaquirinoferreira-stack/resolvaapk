import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Order, 
  Partner, 
  User, 
  SiteSetting, 
  SocialLinks, 
  AccessLog, 
  ServiceCategory, 
  ServiceItem, 
  AppNotification,
  Booking,
  CustomServiceRequest
} from '../types';
import { 
  subscribeOrdersByPartner, 
  subscribeOrdersByClient, 
  subscribeAllOrders, 
  subscribePartners, 
  subscribeUsers, 
  subscribeSiteSettings, 
  subscribeSocialLinks, 
  subscribeAccessLogs,
  subscribeServices,
  subscribeCategories,
  createOrderInFirestore,
  updateOrderStatusInFirestore,
  createCustomRequestInFirestore
} from '../lib/firebase';
import { INITIAL_CATEGORIES, INITIAL_SERVICES } from '../data/initialData';
import { useAuth } from './AuthContext';

export type ActiveTab = 'home' | 'discover' | 'request' | 'bookings' | 'profile' | 'admin' | 'partner';

interface AppContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (catId: string | null) => void;
  
  // Real Firestore Collections
  orders: Order[];
  bookings: Booking[]; // alias pointing to orders for UI compatibility
  partners: Partner[];
  professionals: Partner[]; // alias pointing to partners
  users: User[];
  siteSettings: SiteSetting | null;
  socialLinks: SocialLinks | null;
  accessLogs: AccessLog[];
  
  // UI Services & Categories for catalog browsing
  services: ServiceItem[];
  categories: ServiceCategory[];
  notifications: AppNotification[];
  
  // Order actions
  createNewBooking: (bookingData: any) => Promise<string>;
  submitCustomRequest: (requestData: any) => Promise<string>;
  changeBookingStatus: (bookingId: string, status: Order['status'], extra?: Partial<Order>) => Promise<void>;
  markNotificationRead: (id: string) => void;
  
  // Modals & Flows
  selectedServiceForBooking: ServiceItem | null;
  setSelectedServiceForBooking: (service: ServiceItem | null) => void;
  activeBookingDetail: Order | null;
  setActiveBookingDetail: (order: Order | null) => void;
  showCustomServiceModal: boolean;
  setShowCustomServiceModal: (show: boolean) => void;
  showAddressModal: boolean;
  setShowAddressModal: (show: boolean) => void;
  
  // PWA Prompt
  isInstallable: boolean;
  isStandalone: boolean;
  showInstallBanner: boolean;
  setShowInstallBanner: (show: boolean) => void;
  triggerInstallPrompt: () => void;

  // Splash
  showSplash: boolean;
  setShowSplash: (show: boolean) => void;
  replaySplash: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, currentPartner, isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Firestore Real-Time State Collections
  const [orders, setOrders] = useState<Order[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSetting | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLinks | null>(null);
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);

  // Catalog UI Fallback State
  const [services, setServices] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [categories, setCategories] = useState<ServiceCategory[]>(INITIAL_CATEGORIES);
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif_1',
      title: 'Banco de Dados Conectado',
      message: 'A sua aplicação PWA está conectada e sincronizada em tempo real com o banco de dados oficial.',
      timestamp: 'Agora mesmo',
      read: false,
      type: 'system'
    }
  ]);

  // Modal and Interaction States
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<ServiceItem | null>(null);
  const [activeBookingDetail, setActiveBookingDetail] = useState<Order | null>(null);
  const [showCustomServiceModal, setShowCustomServiceModal] = useState<boolean>(false);
  const [showAddressModal, setShowAddressModal] = useState<boolean>(false);

  // PWA & Splash State
  const [isInstallable, setIsInstallable] = useState<boolean>(false);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [showInstallBanner, setShowInstallBanner] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showSplash, setShowSplash] = useState<boolean>(false);

  const replaySplash = () => {
    setShowSplash(true);
  };

  // PWA Install Event Listeners
  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsStandalone(true);
      setShowInstallBanner(false);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
      if (!isStandalone) {
        setShowInstallBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.addEventListener('appinstalled', () => {
      setIsStandalone(true);
      setShowInstallBanner(false);
      setIsInstallable(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const triggerInstallPrompt = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setShowInstallBanner(false);
      }
      setDeferredPrompt(null);
    } else {
      alert('Para instalar o Resolva Fácil no seu ecrã inicial:\n1. Toque no botão Partilhar ou Menu do navegador\n2. Selecione "Adicionar ao ecrã principal"');
    }
  };

  // Auto switch view according to authenticated role
  useEffect(() => {
    if (currentUser?.role === 'admin' || isAdmin) {
      setActiveTab('admin');
    } else if (currentUser?.role === 'partner') {
      setActiveTab('partner');
    }
  }, [currentUser?.role, currentUser?.id, isAdmin]);

  // =========================================================================
  // REAL-TIME ORDERS LISTENER (Based on role)
  // Partner: where partnerId == partnerDoc.id
  // Client: where clientId == currentUser.id (auth.uid)
  // Admin: all orders
  // =========================================================================
  useEffect(() => {
    if (!currentUser) {
      setOrders([]);
      return;
    }

    let unsubscribe: () => void = () => {};

    if (currentUser.role === 'admin' || isAdmin) {
      unsubscribe = subscribeAllOrders((list) => {
        setOrders(list);
      });
    } else if (currentUser.role === 'partner' && currentPartner?.id) {
      unsubscribe = subscribeOrdersByPartner(currentPartner.id, (list) => {
        setOrders(list);
      });
    } else {
      unsubscribe = subscribeOrdersByClient(currentUser.id, (list) => {
        setOrders(list);
      });
    }

    return () => {
      unsubscribe();
    };
  }, [currentUser?.id, currentUser?.role, currentPartner?.id, isAdmin]);

  // Real-time Partners, Site Settings & Social Links
  useEffect(() => {
    const unsubPartners = subscribePartners((list) => {
      setPartners(list);
    });

    const unsubSettings = subscribeSiteSettings((settings) => {
      if (settings) setSiteSettings(settings);
    });

    const unsubSocial = subscribeSocialLinks((social) => {
      if (social) setSocialLinks(social);
    });

    const unsubServices = subscribeServices((srv) => setServices(srv));
    const unsubCategories = subscribeCategories((cat) => setCategories(cat));

    return () => {
      unsubPartners();
      unsubSettings();
      unsubSocial();
      unsubServices();
      unsubCategories();
    };
  }, []);

  // Admin-only listeners: Users & Access Logs
  useEffect(() => {
    if (isAdmin) {
      const unsubUsers = subscribeUsers((u) => setUsers(u));
      const unsubLogs = subscribeAccessLogs((l) => setAccessLogs(l));
      return () => {
        unsubUsers();
        unsubLogs();
      };
    }
  }, [isAdmin]);

  // =========================================================================
  // ORDER ACTIONS: REAL-TIME WRITE OPERATIONS TO FIRESTORE
  // =========================================================================

  const createNewBooking = async (bookingData: any): Promise<string> => {
    try {
      const docId = await createOrderInFirestore(bookingData);
      return docId;
    } catch (error) {
      console.error('Error creating order in Firestore:', error);
      throw error;
    }
  };

  const submitCustomRequest = async (requestData: any): Promise<string> => {
    try {
      const docId = await createCustomRequestInFirestore(requestData);
      return docId;
    } catch (error) {
      console.error('Error creating custom request in Firestore:', error);
      throw error;
    }
  };

  const changeBookingStatus = async (
    bookingId: string, 
    status: Order['status'], 
    extra?: Partial<Order>
  ) => {
    try {
      await updateOrderStatusInFirestore(bookingId, status, extra);
      // Optimistic local update
      setOrders((prev) =>
        prev.map((o) => (o.id === bookingId ? { ...o, status, updatedAt: new Date().toISOString(), ...(extra || {}) } : o))
      );
      if (activeBookingDetail && activeBookingDetail.id === bookingId) {
        setActiveBookingDetail({
          ...activeBookingDetail,
          status,
          updatedAt: new Date().toISOString(),
          ...(extra || {})
        });
      }
    } catch (error) {
      console.error('Error updating order status in Firestore:', error);
      throw error;
    }
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        orders,
        bookings: orders, // backward compatibility
        partners,
        professionals: partners, // backward compatibility
        users,
        siteSettings,
        socialLinks,
        accessLogs,
        services,
        categories,
        notifications,
        createNewBooking,
        submitCustomRequest,
        changeBookingStatus,
        markNotificationRead,
        selectedServiceForBooking,
        setSelectedServiceForBooking,
        activeBookingDetail,
        setActiveBookingDetail,
        showCustomServiceModal,
        setShowCustomServiceModal,
        showAddressModal,
        setShowAddressModal,
        isInstallable,
        isStandalone,
        showInstallBanner,
        setShowInstallBanner,
        triggerInstallPrompt,
        showSplash,
        setShowSplash,
        replaySplash
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
