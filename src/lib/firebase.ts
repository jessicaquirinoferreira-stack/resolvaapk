import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  initializeFirestore, 
  memoryLocalCache,
  collection, 
  doc, 
  getDoc,
  getDocs, 
  onSnapshot, 
  query, 
  where, 
  orderBy,
  limit,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut as fbSignOut, 
  onAuthStateChanged, 
  User as FbUser 
} from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import firebaseAppletConfig from '../../firebase-applet-config.json';
import { 
  Order, 
  Partner, 
  User, 
  SiteSetting, 
  SocialLinks, 
  AccessLog, 
  ServiceCategory, 
  ServiceItem, 
  CustomServiceRequest 
} from '../types';
import { INITIAL_CATEGORIES, INITIAL_SERVICES } from '../data/initialData';

// Production Firebase Configuration synchronized with the official website
export const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID || firebaseAppletConfig.projectId;
export const firestoreDatabaseId = import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || firebaseAppletConfig.firestoreDatabaseId;

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || firebaseAppletConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseAppletConfig.authDomain || `${projectId}.firebaseapp.com`,
  projectId: projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || firebaseAppletConfig.storageBucket || `${projectId}.firebasestorage.app`,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseAppletConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || firebaseAppletConfig.appId,
};

// Singleton Firebase App Initialization
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Conecta diretamente ao banco de dados Firestore especificado
let firestoreDb;
try {
  firestoreDb = initializeFirestore(
    app,
    {
      localCache: memoryLocalCache(),
      experimentalForceLongPolling: true,
      experimentalAutoDetectLongPolling: true
    } as any,
    firestoreDatabaseId
  );
} catch (e) {
  firestoreDb = getFirestore(app, firestoreDatabaseId);
}

// Exported Firestore connected to the synchronized database
export const db = firestoreDb;

// Firebase Authentication Instance
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Firebase Storage Instance (Safe fallback)
export const storage = (() => {
  try {
    return getStorage(app);
  } catch {
    return null as any;
  }
})();

// Connection test
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    const testDoc = doc(db, 'siteSettings', 'global');
    await getDoc(testDoc);
    console.log('[Firestore] Conectado e sincronizado com o banco:', firestoreDatabaseId);
    return true;
  } catch (err: any) {
    console.log('[Firestore] Status da conexão:', err?.message || err);
    return false;
  }
}
testFirestoreConnection();

// =========================================================================
// REAL-TIME LISTENERS - OFFICIAL SHARED COLLECTIONS
// =========================================================================

/**
 * 1. Subscribe to orders assigned to a specific Partner.
 */
export function subscribeOrdersByPartner(
  partnerId: string, 
  callback: (orders: Order[]) => void
) {
  if (!partnerId) {
    callback([]);
    return () => {};
  }

  try {
    const ordersCol = collection(db, 'orders');
    const q1 = query(ordersCol, where('partnerId', '==', partnerId));

    return onSnapshot(q1, (snapshot) => {
      const ordersMap = new Map<string, Order>();
      
      snapshot.docs.forEach((d) => {
        const data = d.data();
        const rawStatus = data.status || 'pending';
        let mappedStatus = rawStatus;
        if (rawStatus === 'em_andamento') mappedStatus = 'in_progress';
        if (rawStatus === 'pendente') mappedStatus = 'pending';
        if (rawStatus === 'concluido' || rawStatus === 'finalizado') mappedStatus = 'completed';
        if (rawStatus === 'cancelado') mappedStatus = 'cancelled';

        ordersMap.set(d.id, {
          id: d.id,
          ...data,
          serviceTitle: data.title || data.serviceTitle || data.serviceType || data.category || data.description || 'Chamado Solicitado',
          status: mappedStatus,
          totalPrice: data.finalValue ?? data.estimatedValue ?? data.totalPrice ?? data.price ?? 0,
          price: data.finalValue ?? data.estimatedValue ?? data.totalPrice ?? data.price ?? 0,
          scheduledDate: data.scheduledDate || data.date || data.createdAt || new Date().toISOString(),
          createdAt: data.createdAt || new Date().toISOString()
        } as Order);
      });

      callback(Array.from(ordersMap.values()));
    }, (error) => {
      console.warn('Orders by partner listener notice:', error);
      callback([]);
    });
  } catch (err) {
    console.error('Error setting up orders by partner subscription:', err);
    return () => {};
  }
}

/**
 * 2. Subscribe to orders created by a specific Client.
 */
export function subscribeOrdersByClient(
  clientId: string, 
  callback: (orders: Order[]) => void
) {
  if (!clientId) {
    callback([]);
    return () => {};
  }

  try {
    const ordersCol = collection(db, 'orders');
    const q1 = query(ordersCol, where('clientId', '==', clientId));

    return onSnapshot(q1, (snapshot) => {
      const orders = snapshot.docs.map((d) => {
        const data = d.data();
        const rawStatus = data.status || 'pending';
        let mappedStatus = rawStatus;
        if (rawStatus === 'em_andamento') mappedStatus = 'in_progress';
        if (rawStatus === 'pendente') mappedStatus = 'pending';
        if (rawStatus === 'concluido' || rawStatus === 'finalizado') mappedStatus = 'completed';
        if (rawStatus === 'cancelado') mappedStatus = 'cancelled';

        return {
          id: d.id,
          ...data,
          serviceTitle: data.title || data.serviceTitle || data.serviceType || data.category || data.description || 'Pedido de Serviço',
          status: mappedStatus,
          totalPrice: data.finalValue ?? data.estimatedValue ?? data.totalPrice ?? data.price ?? 0,
          price: data.finalValue ?? data.estimatedValue ?? data.totalPrice ?? data.price ?? 0,
          scheduledDate: data.scheduledDate || data.date || data.createdAt || new Date().toISOString(),
          createdAt: data.createdAt || new Date().toISOString()
        } as Order;
      });
      callback(orders);
    }, (error) => {
      console.warn('Orders by client listener notice:', error);
      callback([]);
    });
  } catch (err) {
    console.error('Error setting up orders by client subscription:', err);
    return () => {};
  }
}

/**
 * 3. Subscribe to all orders (Admin only, /orders).
 */
export function subscribeAllOrders(callback: (orders: Order[]) => void) {
  try {
    const ordersCol = collection(db, 'orders');
    return onSnapshot(ordersCol, (snapshot) => {
      const orders = snapshot.docs.map((d) => {
        const data = d.data();
        const rawStatus = data.status || 'pending';
        let mappedStatus = rawStatus;
        if (rawStatus === 'em_andamento') mappedStatus = 'in_progress';
        if (rawStatus === 'pendente') mappedStatus = 'pending';
        if (rawStatus === 'concluido' || rawStatus === 'finalizado') mappedStatus = 'completed';
        if (rawStatus === 'cancelado') mappedStatus = 'cancelled';

        return {
          id: d.id,
          ...data,
          serviceTitle: data.title || data.serviceTitle || data.serviceType || data.category || data.description || 'Chamado de Serviço',
          status: mappedStatus,
          totalPrice: data.finalValue ?? data.estimatedValue ?? data.totalPrice ?? data.price ?? 0,
          price: data.finalValue ?? data.estimatedValue ?? data.totalPrice ?? data.price ?? 0,
          scheduledDate: data.scheduledDate || data.date || data.createdAt || new Date().toISOString(),
          createdAt: data.createdAt || new Date().toISOString()
        } as Order;
      });
      callback(orders);
    }, (error) => {
      console.warn('All orders listener notice:', error);
      callback([]);
    });
  } catch (err) {
    console.error('Error setting up all orders subscription:', err);
    return () => {};
  }
}

/**
 * 4. Subscribe to partners list (Real /partners collection).
 */
export function subscribePartners(callback: (partners: Partner[]) => void) {
  try {
    const partnersCol = collection(db, 'partners');
    return onSnapshot(partnersCol, (snapshot) => {
      const list = snapshot.docs.map((d) => {
        const data = d.data();
        const categories = Array.isArray(data.categories) ? data.categories : [];
        const specialties = Array.isArray(data.specialties) && data.specialties.length > 0 
          ? data.specialties 
          : (categories.length > 0 ? categories : ['Serviços Gerais']);
        const isApproved = data.status === 'aprovado' || data.status === 'approved' || data.status === 'active';
        
        return {
          id: d.id,
          ...data,
          name: data.fullName || data.name || 'Prestador Resolva Fácil',
          categories,
          specialties,
          isActive: data.isActive !== undefined ? !!data.isActive : isApproved,
          status: isApproved ? 'approved' : (data.status === 'rejeitado' || data.status === 'rejected' ? 'rejected' : 'pending'),
          completedJobs: data.completedServicesCount ?? data.completedJobs ?? 0,
          rating: data.rating || 5.0,
          photoUrl: data.photoUrl || data.avatarUrl || data.documents?.selfieUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80',
          hourlyRate: data.hourlyRate || 35
        } as Partner;
      });
      callback(list);
    }, (error) => {
      console.warn('Partners listener notice:', error);
      callback([]);
    });
  } catch (err) {
    return () => {};
  }
}

/**
 * 5. Subscribe to users list (Admin only, /users collection).
 */
export function subscribeUsers(callback: (users: User[]) => void) {
  try {
    const usersCol = collection(db, 'users');
    return onSnapshot(usersCol, (snapshot) => {
      const list = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data()
      } as User));
      callback(list);
    }, (error) => {
      console.warn('Users listener notice:', error);
      callback([]);
    });
  } catch (err) {
    return () => {};
  }
}

/**
 * 6. Subscribe to shared Site Settings (/siteSettings/main with fallback to /siteSettings/global).
 */
export function subscribeSiteSettings(callback: (settings: SiteSetting | null) => void) {
  try {
    // In live Firestore, the primary document is /siteSettings/main
    const settingsDoc = doc(db, 'siteSettings', 'main');
    return onSnapshot(settingsDoc, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        callback({
          id: snap.id,
          ...data,
          phone: data.phone || data.contactPhone || '',
          email: data.email || data.contactEmail || '',
          siteName: data.siteName || 'Resolva Fácil'
        } as SiteSetting);
      } else {
        // Fallback to /siteSettings/global or /settings/global
        const globalDoc = doc(db, 'siteSettings', 'global');
        getDoc(globalDoc).then((gSnap) => {
          if (gSnap.exists()) {
            const data = gSnap.data();
            callback({
              id: gSnap.id,
              ...data,
              phone: data.phone || data.contactPhone || '',
              email: data.email || data.contactEmail || '',
              siteName: data.siteName || 'Resolva Fácil'
            } as SiteSetting);
          } else {
            callback(null);
          }
        }).catch(() => callback(null));
      }
    }, () => {
      callback(null);
    });
  } catch (err) {
    return () => {};
  }
}

/**
 * 7. Subscribe to shared Social Links (/socialLinks/global with fallback to /socialLinks/main).
 */
export function subscribeSocialLinks(callback: (links: SocialLinks | null) => void) {
  try {
    // In live Firestore, the primary document is /socialLinks/global
    const linksDoc = doc(db, 'socialLinks', 'global');
    return onSnapshot(linksDoc, (snap) => {
      if (snap.exists()) {
        callback({ id: snap.id, ...snap.data() } as SocialLinks);
      } else {
        const mainDoc = doc(db, 'socialLinks', 'main');
        getDoc(mainDoc).then((mSnap) => {
          if (mSnap.exists()) {
            callback({ id: mSnap.id, ...mSnap.data() } as SocialLinks);
          } else {
            callback(null);
          }
        }).catch(() => callback(null));
      }
    }, () => {
      callback(null);
    });
  } catch (err) {
    return () => {};
  }
}

/**
 * 8. Subscribe to access logs (/accessLogs).
 */
export function subscribeAccessLogs(callback: (logs: AccessLog[]) => void) {
  try {
    const logsCol = collection(db, 'accessLogs');
    const q = query(logsCol, limit(50));
    return onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as AccessLog));
      callback(list);
    }, () => {
      callback([]);
    });
  } catch (err) {
    return () => {};
  }
}

/**
 * 9. Subscribe to Services from Firestore /services.
 */
export function subscribeServices(callback: (services: ServiceItem[]) => void) {
  try {
    const servicesCol = collection(db, 'services');
    return onSnapshot(servicesCol, (snapshot) => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data()
        } as ServiceItem));
        callback(list);
      } else {
        callback(INITIAL_SERVICES);
      }
    }, () => {
      callback(INITIAL_SERVICES);
    });
  } catch (e) {
    callback(INITIAL_SERVICES);
    return () => {};
  }
}

/**
 * 10. Subscribe to Categories from Firestore /categories.
 */
export function subscribeCategories(callback: (categories: ServiceCategory[]) => void) {
  try {
    const catCol = collection(db, 'categories');
    return onSnapshot(catCol, (snapshot) => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data()
        } as ServiceCategory));
        callback(list);
      } else {
        callback(INITIAL_CATEGORIES);
      }
    }, () => {
      callback(INITIAL_CATEGORIES);
    });
  } catch (e) {
    callback(INITIAL_CATEGORIES);
    return () => {};
  }
}

// =========================================================================
// REAL-TIME WRITE OPERATIONS (ORDERS, USERS, SETTINGS, LOGS)
// =========================================================================

/**
 * Creates an order directly in the shared /orders collection.
 */
export async function createOrderInFirestore(orderData: Partial<Order>): Promise<string> {
  const ordersCol = collection(db, 'orders');
  const now = new Date().toISOString();

  const cleanData: Record<string, any> = {
    clientId: orderData.clientId || orderData.userId || '',
    userId: orderData.userId || orderData.clientId || '',
    clientName: orderData.clientName || orderData.userName || 'Cliente Resolva Fácil',
    userName: orderData.userName || orderData.clientName || 'Cliente Resolva Fácil',
    clientPhone: orderData.clientPhone || orderData.userPhone || '',
    userPhone: orderData.userPhone || orderData.clientPhone || '',
    partnerId: orderData.partnerId || orderData.professionalId || '',
    professionalId: orderData.professionalId || orderData.partnerId || '',
    partnerName: orderData.partnerName || orderData.professionalName || '',
    professionalName: orderData.professionalName || orderData.partnerName || '',
    partnerPhoto: orderData.partnerPhoto || orderData.professionalPhoto || '',
    professionalPhoto: orderData.professionalPhoto || orderData.partnerPhoto || '',
    partnerPhone: orderData.partnerPhone || orderData.professionalPhone || '',
    professionalPhone: orderData.professionalPhone || orderData.partnerPhone || '',
    serviceId: orderData.serviceId || 'srv_custom',
    serviceTitle: orderData.serviceTitle || 'Serviço',
    category: orderData.category || orderData.categoryName || 'Geral',
    categoryName: orderData.categoryName || orderData.category || 'Geral',
    serviceImageUrl: orderData.serviceImageUrl || '',
    description: orderData.description || '',
    status: orderData.status || 'pending',
    totalPrice: orderData.totalPrice ?? orderData.price ?? 0,
    price: orderData.price ?? orderData.totalPrice ?? 0,
    date: orderData.date || orderData.scheduledDate || now.split('T')[0],
    scheduledDate: orderData.scheduledDate || orderData.date || now.split('T')[0],
    timeSlot: orderData.timeSlot || orderData.scheduledTime || '09:00 - 11:00',
    scheduledTime: orderData.scheduledTime || orderData.timeSlot || '09:00 - 11:00',
    address: orderData.address || null,
    notes: orderData.notes || '',
    paymentMethod: orderData.paymentMethod || 'mbway',
    paymentStatus: orderData.paymentStatus || 'pending',
    createdAt: now,
    updatedAt: now
  };

  const docRef = await addDoc(ordersCol, cleanData);

  logAccessEvent({
    userId: cleanData.clientId,
    action: 'create_order',
    details: `Novo chamado criado: ${cleanData.serviceTitle} (#${docRef.id})`
  });

  return docRef.id;
}

/**
 * Updates an order status in /orders directly.
 */
export async function updateOrderStatusInFirestore(
  orderId: string, 
  status: Order['status'], 
  extraData: Partial<Order> = {}
): Promise<void> {
  const orderRef = doc(db, 'orders', orderId);
  await updateDoc(orderRef, {
    status,
    updatedAt: new Date().toISOString(),
    ...extraData
  });

  logAccessEvent({
    action: 'update_order_status',
    details: `Estado do chamado #${orderId} alterado para ${status}`
  });
}

/**
 * Saves a custom request in /orders and /customRequests.
 */
export async function createCustomRequestInFirestore(req: Partial<CustomServiceRequest>): Promise<string> {
  const now = new Date().toISOString();
  const orderId = await createOrderInFirestore({
    clientId: req.userId,
    userId: req.userId,
    clientName: req.userName,
    userName: req.userName,
    clientPhone: req.userPhone,
    userPhone: req.userPhone,
    serviceTitle: 'Serviço Sob Medida',
    category: 'Sob Medida',
    categoryName: 'Sob Medida',
    description: req.description,
    status: 'pending',
    totalPrice: (req.estimatedHours || 2) * (req.hourlyRate || 49.9),
    date: req.preferredDate,
    scheduledDate: req.preferredDate,
    timeSlot: req.preferredTime,
    scheduledTime: req.preferredTime,
    address: req.address,
    notes: `Horas estimadas: ${req.estimatedHours || 2}h. Tarifa: R$ ${(req.hourlyRate || 49.9).toFixed(2).replace('.', ',')}/h.`
  });

  try {
    const customCol = collection(db, 'customRequests');
    await addDoc(customCol, {
      ...req,
      orderId,
      status: 'pending',
      createdAt: now
    });
  } catch (e) {
    console.warn('customRequests write notice:', e);
  }

  return orderId;
}

/**
 * Updates a partner's approval status in Firestore.
 */
export async function updatePartnerStatus(
  partnerId: string, 
  status: 'pending' | 'approved' | 'rejected'
): Promise<void> {
  const partnerRef = doc(db, 'partners', partnerId);
  await updateDoc(partnerRef, {
    status,
    updatedAt: new Date().toISOString()
  });

  logAccessEvent({
    action: 'update_partner_status',
    details: `Status do parceiro #${partnerId} alterado para ${status}`
  });
}

/**
 * Deletes a partner from Firestore.
 */
export async function deletePartner(partnerId: string): Promise<void> {
  const partnerRef = doc(db, 'partners', partnerId);
  await deleteDoc(partnerRef);

  logAccessEvent({
    action: 'delete_partner',
    details: `Parceiro #${partnerId} removido do banco de dados`
  });
}

/**
 * Updates site settings in /siteSettings/main and /siteSettings/global.
 */
export async function updateSiteSettings(data: Partial<SiteSetting>): Promise<void> {
  const mainSettingsRef = doc(db, 'siteSettings', 'main');
  await setDoc(mainSettingsRef, {
    ...data,
    updatedAt: new Date().toISOString()
  }, { merge: true });

  try {
    const globalSettingsRef = doc(db, 'siteSettings', 'global');
    await setDoc(globalSettingsRef, {
      ...data,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (e) {
    // Non-critical fallback sync
  }

  logAccessEvent({
    action: 'update_site_settings',
    details: 'Configurações oficiais do site atualizadas no Firestore'
  });
}

/**
 * Updates social links in /socialLinks/global and /socialLinks/main.
 */
export async function updateSocialLinks(data: Partial<SocialLinks>): Promise<void> {
  const globalSocialRef = doc(db, 'socialLinks', 'global');
  await setDoc(globalSocialRef, {
    ...data,
    updatedAt: new Date().toISOString()
  }, { merge: true });

  try {
    const mainSocialRef = doc(db, 'socialLinks', 'main');
    await setDoc(mainSocialRef, {
      ...data,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (e) {
    // Non-critical fallback sync
  }

  logAccessEvent({
    action: 'update_social_links',
    details: 'Redes sociais atualizadas no Firestore'
  });
}

/**
 * Updates user profile directly in /users/{userId}.
 */
export async function updateUserProfileInFirestore(userId: string, data: Partial<User>): Promise<void> {
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, {
    ...data,
    updatedAt: new Date().toISOString()
  }, { merge: true });
}

/**
 * Updates partner profile directly in /partners/{partnerId}.
 */
export async function updatePartnerProfileInFirestore(partnerId: string, data: Partial<Partner>): Promise<void> {
  const partnerRef = doc(db, 'partners', partnerId);
  await setDoc(partnerRef, {
    ...data,
    updatedAt: new Date().toISOString()
  }, { merge: true });
}

/**
 * Record an audit access log in /accessLogs.
 */
export async function logAccessEvent(log: Omit<AccessLog, 'id' | 'timestamp'>) {
  try {
    const logsCol = collection(db, 'accessLogs');
    await addDoc(logsCol, {
      ...log,
      timestamp: new Date().toISOString()
    });
  } catch (e) {
    console.warn('Access log write notice:', e);
  }
}

export function subscribeProfessionals(callback: (pros: Partner[]) => void) {
  return subscribePartners(callback);
}

export { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup, 
  fbSignOut,
  fbSignOut as signOut, 
  onAuthStateChanged 
};
