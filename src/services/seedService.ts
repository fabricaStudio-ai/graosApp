import { collection, getDocs, addDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const initialCategories = [
  { name: 'Sementes', icon: 'Sprout', color: 'bg-sage-100 text-sage-600', order: 1 },
  { name: 'Grãos', icon: 'Wheat', color: 'bg-amber-100 text-amber-700', order: 2 },
  { name: 'Insumos', icon: 'Droplets', color: 'bg-blue-100 text-blue-700', order: 3 },
  { name: 'Fertilizantes', icon: 'FlaskConical', color: 'bg-copper/10 text-copper', order: 4 },
  { name: 'Maquinário', icon: 'Tractor', color: 'bg-sage-900 text-white shadow-lg', order: 5 },
];

const initialProducts = [
  { 
    name: 'Soja Premium TAS - Safra 2026', 
    price: 'R$ 138,50 / saca', 
    numericPrice: 138.5,
    rating: 5.0, 
    image: 'https://images.pexels.com/photos/259280/pexels-photo-259280.jpeg?auto=format&fit=crop&q=80&w=400',
    tag: 'Seleção Ouro',
    category: 'Oleaginosas',
    status: 'Ativo',
    stock: '45.000t'
  },
  { 
    name: 'Milho Hibrido Alta Produtividade', 
    price: 'R$ 72,90 / saca', 
    numericPrice: 72.9,
    rating: 4.9, 
    image: 'https://images.pexels.com/photos/54084/corn-field-corn-on-the-cob-corn-corn-cob-54084.jpeg?auto=format&fit=crop&q=80&w=400',
    tag: 'Alta Performance',
    category: 'Cereais',
    status: 'Ativo',
    stock: '12.000t'
  },
  { 
    name: 'Fertilizante Mineral NPK 04-14-08', 
    price: 'Sob consulta', 
    numericPrice: 0,
    rating: 4.8, 
    image: 'https://images.pexels.com/photos/2132250/pexels-photo-2132250.jpeg?auto=format&fit=crop&q=80&w=400',
    tag: 'Insumo',
    category: 'Insumos',
    status: 'Ativo',
    stock: '8.000t'
  },
];

const initialCoupons = [
  { code: 'AGROVANTAGEM', discount: 'R$ 1.500', status: 'Ativo', usage: '12/50', expires: '30 Mai, 2026' },
  { code: 'TASGRAO2026', discount: '5%', status: 'Ativo', usage: '89/∞', expires: 'Ilimitado' },
];

const initialTransactions = [
  { id: 'TRX-9821', customer: 'João Oliveira', date: '2026-05-14T14:20:00Z', amount: 152.40, type: 'in', method: 'PIX', status: 'Confirmado', weight: 1.2 },
  { id: 'TRX-9820', customer: 'Amazon Cloud', date: '2026-05-14T09:12:00Z', amount: 45.00, type: 'out', method: 'Boleto', status: 'Pago', weight: 0 },
  { id: 'TRX-9819', customer: 'Maria Santos', date: '2026-05-13T18:45:00Z', amount: 42.90, type: 'in', method: 'Crédito', status: 'Confirmado', weight: 0.8 },
  { id: 'TRX-9818', customer: 'Fornecedor Grãos', date: '2026-05-13T10:00:00Z', amount: 1200.00, type: 'out', method: 'Transferência', status: 'Pago', weight: 5.0 },
  { id: 'TRX-9817', customer: 'Ricardo Dias', date: '2026-05-11T12:30:00Z', amount: 210.00, type: 'in', method: 'PIX', status: 'Confirmado', weight: 2.1 },
];

const initialPartners = [
  { name: 'Fazenda Bonanza', meta: 'R$ 1.2M', growth: '+12%', color: 'from-sage-400 to-sage-600', value: 1200000, active: true },
  { name: 'AgroTec Solutions', meta: 'R$ 840K', growth: '+8%', color: 'from-gold/40 to-gold', value: 840000, active: true },
  { name: 'Cooperativa Sul', meta: 'R$ 720K', growth: '+15%', color: 'from-white/20 to-white/10', value: 720000, active: true },
  { name: 'Sementes Elite', meta: 'R$ 510K', growth: '+5%', color: 'from-copper/40 to-copper', value: 510000, active: true },
];

const initialOrders = [
  { customerId: 'admin', customerName: 'João Silva', date: '2026-05-14T10:00:00Z', amount: 45000, status: 'Concluído', weight: 15.5 },
  { customerId: 'admin', customerName: 'Maria Santos', date: '2026-05-13T15:30:00Z', amount: 12500, status: 'Pendente', weight: 8.2 },
  { customerId: 'admin', customerName: 'Pedro Aguiar', date: '2026-05-12T09:00:00Z', amount: 89000, status: 'Concluído', weight: 24.0 },
];

export const seedDatabase = async () => {
  const productsSnap = await getDocs(collection(db, 'products'));
  if (productsSnap.empty) {
    console.log('Seeding products...');
    for (const prod of initialProducts) {
      await addDoc(collection(db, 'products'), prod);
    }
  }

  const categoriesSnap = await getDocs(collection(db, 'categories'));
  if (categoriesSnap.empty) {
    console.log('Seeding categories...');
    for (const cat of initialCategories) {
      await addDoc(collection(db, 'categories'), cat);
    }
  }

  const couponsSnap = await getDocs(collection(db, 'coupons'));
  if (couponsSnap.empty) {
    console.log('Seeding coupons...');
    for (const cp of initialCoupons) {
      await addDoc(collection(db, 'coupons'), cp);
    }
  }

  const transactionsSnap = await getDocs(collection(db, 'transactions'));
  if (transactionsSnap.empty) {
    console.log('Seeding transactions...');
    for (const trx of initialTransactions) {
      await addDoc(collection(db, 'transactions'), trx);
    }
  }

  const partnersSnap = await getDocs(collection(db, 'partners'));
  if (partnersSnap.empty) {
    console.log('Seeding partners...');
    for (const partner of initialPartners) {
      await addDoc(collection(db, 'partners'), partner);
    }
  }

  const ordersSnap = await getDocs(collection(db, 'orders'));
  if (ordersSnap.empty) {
    console.log('Seeding orders...');
    for (const order of initialOrders) {
      await addDoc(collection(db, 'orders'), order);
    }
  }
};
