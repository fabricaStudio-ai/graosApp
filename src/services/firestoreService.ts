import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc,
  serverTimestamp,
  orderBy,
  limit
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw error; // Permite que o chamador saiba que falhou
  // Do not throw the error globally, just log it, so that app can recover gracefully.
}

// Products
export const subscribeProducts = (callback: (products: any[]) => void) => {
  const q = query(collection(db, 'products'), orderBy('name'));
  return onSnapshot(q, (snapshot) => {
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(products);
  }, (error) => handleFirestoreError(error, OperationType.GET, 'products'));
};

export const addProduct = async (product: any) => {
  try {
    await addDoc(collection(db, 'products'), {
      ...product,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'products');
  }
};

export const updateProduct = async (productId: string, productData: any) => {
  try {
    const docRef = doc(db, 'products', productId);
    await updateDoc(docRef, productData);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `products/${productId}`);
  }
};

export const deleteProduct = async (productId: string) => {
  try {
    const docRef = doc(db, 'products', productId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `products/${productId}`);
  }
};

// Categories
export const subscribeCategories = (callback: (categories: any[]) => void) => {
  const q = query(collection(db, 'categories'), orderBy('order', 'asc'));
  return onSnapshot(q, (snapshot) => {
    const categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(categories);
  }, (error) => handleFirestoreError(error, OperationType.GET, 'categories'));
};

// Orders
export const subscribeOrders = (callback: (orders: any[]) => void, onError?: (error: any) => void) => {
  let q;
  if (auth.currentUser) {
    // If not admin, the backend only allows query with where('customerId', '==', uid)
    // Here we read localStorage to check role temporarily, or we could fetch it.
    // For safety, we query everything but if they aren't admin, it'll fail. Let's fix the query:
    const role = localStorage.getItem('tas_user_role');
    if (role === 'manager') {
      q = query(collection(db, 'orders'), orderBy('date', 'desc'));
    } else {
      q = query(collection(db, 'orders'), where('customerId', '==', auth.currentUser.uid), orderBy('date', 'desc'));
    }
  } else {
    q = query(collection(db, 'orders'), orderBy('date', 'desc')); // will fail if not signed in, which is fine
  }
  
  return onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(orders);
  }, (error) => {
    if (onError) onError(error);
    handleFirestoreError(error, OperationType.GET, 'orders');
  });
};

// Transactions
export const subscribeTransactions = (callback: (transactions: any[]) => void, onError?: (error: any) => void) => {
  const q = query(collection(db, 'transactions'), orderBy('date', 'desc'), limit(50));
  return onSnapshot(q, (snapshot) => {
    const transactions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(transactions);
  }, (error) => {
    if (onError) onError(error);
    handleFirestoreError(error, OperationType.GET, 'transactions');
  });
};

// Coupons
export const subscribeCoupons = (callback: (coupons: any[]) => void, onError?: (error: any) => void) => {
  const q = query(collection(db, 'coupons'), orderBy('code'));
  return onSnapshot(q, (snapshot) => {
    const coupons = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(coupons);
  }, (error) => {
    if (onError) onError(error);
    handleFirestoreError(error, OperationType.GET, 'coupons');
  });
};

// Partners
export const subscribePartners = (callback: (partners: any[]) => void, onError?: (error: any) => void) => {
  const q = query(collection(db, 'partners'), orderBy('value', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const partners = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(partners);
  }, (error) => {
    if (onError) onError(error);
    handleFirestoreError(error, OperationType.GET, 'partners');
  });
};
