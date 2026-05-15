import { motion, AnimatePresence } from 'motion/react';
import { Plus, Search, Filter, Edit2, Trash2, MoreHorizontal, X, Upload, Check, Image as ImageIcon, Loader2, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/src/lib/utils';
import { searchPexelsPhotos, PexelsPhoto } from '@/src/services/pexelsService';
import { subscribeProducts, addProduct, updateProduct, deleteProduct } from '../../services/firestoreService';

interface Product {
  id: string | number;
  name: string;
  category: string;
  price: string;
  stock: string;
  image: string;
  status: 'Ativo' | 'Inativo';
}

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('Grãos e Sementes');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductStock, setNewProductStock] = useState('');
  const [newProductUnit, setNewProductUnit] = useState('Gramas (100g)');
  const [newProductDescription, setNewProductDescription] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeProducts((data) => {
      setProducts(data as Product[]);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | string | null>(null);
  const [productToDelete, setProductToDelete] = useState<number | string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pexels integration states
  const [pexelsQuery, setPexelsQuery] = useState('');
  const [pexelsPhotos, setPexelsPhotos] = useState<PexelsPhoto[]>([]);
  const [isSearchingPexels, setIsSearchingPexels] = useState(false);
  const [selectedPexelsImage, setSelectedPexelsImage] = useState<string | null>(null);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePexelsSearch = async () => {
    if (!pexelsQuery.trim()) return;
    setIsSearchingPexels(true);
    const photos = await searchPexelsPhotos(pexelsQuery);
    setPexelsPhotos(photos);
    setIsSearchingPexels(false);
  };

  const handleEditClick = (product: Product) => {
    setEditingProductId(product.id);
    setNewProductName(product.name);
    setNewProductCategory(product.category);
    setNewProductPrice(product.price.replace('R$ ', ''));
    setNewProductStock(product.stock);
    setNewProductUnit('Gramas (100g)'); // Default or you can read from product if available
    setNewProductDescription(''); // No description in interface, using default
    setSelectedPexelsImage(product.image);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (id: number | string) => {
    setProductToDelete(id);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteProduct(productToDelete.toString());
    } catch (error) {
      console.error(error);
    } finally {
      setProductToDelete(null);
    }
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName || !newProductPrice) return;
    setIsAdding(true);
    try {
      const priceVal = parseFloat(newProductPrice.replace(',', '.'));
      const productData = {
        name: newProductName,
        numericPrice: isNaN(priceVal) ? 0 : priceVal,
        category: newProductCategory,
        status: 'Ativo',
        price: `R$ ${newProductPrice}`,
        stock: newProductStock,
        unit: newProductUnit,
        description: newProductDescription,
        image: selectedPexelsImage || 'https://images.pexels.com/photos/1640778/pexels-photo-1640778.jpeg?auto=compress&cs=tinysrgb&w=800'
      };

      if (editingProductId) {
        await updateProduct(editingProductId.toString(), productData);
      } else {
        await addProduct(productData);
      }
      
      setIsModalOpen(false);
      setEditingProductId(null);
      setNewProductName('');
      setNewProductPrice('');
      setNewProductStock('');
      setNewProductDescription('');
      setSelectedPexelsImage(null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 mb-1">Produtos</h2>
          <p className="text-gray-400 font-medium">Gerencie seu catálogo de produtos naturais.</p>
        </div>
        <button 
          onClick={() => {
            setEditingProductId(null);
            setNewProductName('');
            setNewProductCategory('Grãos e Sementes');
            setNewProductPrice('');
            setNewProductStock('');
            setNewProductDescription('');
            setSelectedPexelsImage(null);
            setIsModalOpen(true);
          }}
          className="bg-sage-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-sage-700 transition-all shadow-lg shadow-sage-600/20"
        >
          <Plus size={20} />
          Adicionar Novo Produto
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-sage-600 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Pesquisar por nome ou categoria..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border-none rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-sage-500 transition-all font-medium text-sm"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex items-center gap-2 px-4 py-3 bg-gray-50 text-gray-600 rounded-xl font-bold text-sm border border-transparent hover:border-gray-200 transition-all w-full md:w-auto justify-center">
            <Filter size={18} />
            Recentes
          </button>
          <button className="flex items-center gap-2 px-4 py-3 bg-gray-50 text-gray-600 rounded-xl font-bold text-sm border border-transparent hover:border-gray-200 transition-all w-full md:w-auto justify-center">
            Categoria
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center w-24">Foto</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Produto</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Categoria</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Preço</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Estoque</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="group hover:bg-gray-50/80 transition-colors">
                  <td className="px-8 py-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 mx-auto">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900 text-sm">{product.name}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">SKU: TAS-{product.id}00{product.id}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold px-3 py-1 bg-sage-50 text-sage-600 rounded-lg">{product.category}</span>
                  </td>
                  <td className="px-6 py-4 text-center font-black text-gray-900 text-sm truncate">{product.price}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={cn(
                      "text-sm font-bold",
                      product.stock === '0un' ? "text-red-500" : "text-gray-900"
                    )}>{product.stock}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                       <span className={cn(
                         "w-2 h-2 rounded-full",
                         product.status === 'Ativo' ? "bg-green-500" : "bg-gray-300"
                       )} />
                       <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">{product.status}</span>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEditClick(product)} className="p-2 text-gray-400 hover:text-sage-600 hover:bg-sage-50 rounded-lg transition-all"><Edit2 size={16} /></button>
                      <button onClick={() => handleDeleteProduct(product.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                      <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-all"><MoreHorizontal size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredProducts.length === 0 && (
          <div className="p-20 text-center text-gray-400 font-bold">Nenhum produto encontrado.</div>
        )}
      </div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-sage-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl p-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-extrabold text-gray-900">{editingProductId ? 'Editar Produto' : 'Adicionar Novo Produto'}</h3>
                <button onClick={() => {
                  setIsModalOpen(false);
                  setEditingProductId(null);
                  setNewProductName('');
                  setNewProductCategory('Grãos e Sementes');
                  setNewProductPrice('');
                  setNewProductStock('');
                  setNewProductDescription('');
                  setSelectedPexelsImage(null);
                }} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><X size={24} /></button>
              </div>

              <form className="space-y-6" onSubmit={handleSubmitProduct}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Nome do Produto</label>
                    <input 
                      type="text" 
                      value={newProductName} 
                      onChange={(e) => setNewProductName(e.target.value)} 
                      required 
                      className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 focus:ring-2 focus:ring-sage-500 font-medium" 
                      placeholder="Ex: Mix de Nozes" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Categoria</label>
                    <select 
                      value={newProductCategory} 
                      onChange={(e) => setNewProductCategory(e.target.value)} 
                      className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 focus:ring-2 focus:ring-sage-500 font-medium"
                    >
                      <option>Grãos e Sementes</option>
                      <option>Suplementos</option>
                      <option>Adoçantes</option>
                      <option>Cereais</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Descrição</label>
                  <textarea 
                    rows={3} 
                    value={newProductDescription} 
                    onChange={(e) => setNewProductDescription(e.target.value)} 
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 focus:ring-2 focus:ring-sage-500 font-medium resize-none text-sm" 
                    placeholder="Descreva as propriedades e benefícios..." 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Preço (R$)</label>
                    <input 
                      type="text" 
                      value={newProductPrice} 
                      onChange={(e) => setNewProductPrice(e.target.value)} 
                      required 
                      className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 focus:ring-2 focus:ring-sage-500 font-medium text-center" 
                      placeholder="0,00" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Quantidade Estoque</label>
                    <input 
                      type="text" 
                      value={newProductStock} 
                      onChange={(e) => setNewProductStock(e.target.value)} 
                      className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 focus:ring-2 focus:ring-sage-500 font-medium text-center" 
                      placeholder="Ex: 50kg" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Unidade</label>
                    <select 
                      value={newProductUnit} 
                      onChange={(e) => setNewProductUnit(e.target.value)} 
                      className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 focus:ring-2 focus:ring-sage-500 font-medium"
                    >
                      <option>Gramas (100g)</option>
                      <option>Unidade</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Imagem do Produto</label>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Manual Upload Placement */}
                    <div className="p-6 border-2 border-dashed border-gray-100 rounded-3xl flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition-colors cursor-pointer group">
                      <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-300 group-hover:text-sage-500 transition-colors">
                        <Upload size={20} />
                      </div>
                      <p className="text-[10px] font-bold text-gray-400 text-center">Upload Manual</p>
                    </div>

                    {/* Pexels Integration */}
                    <div className="flex flex-col gap-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                        <input 
                          type="text" 
                          placeholder="Buscar no Pexels..."
                          value={pexelsQuery}
                          onChange={(e) => setPexelsQuery(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handlePexelsSearch())}
                          className="w-full bg-gray-50 border-none rounded-xl py-3 pl-10 pr-3 focus:ring-2 focus:ring-sage-500 text-xs font-medium"
                        />
                        <button 
                          type="button"
                          onClick={handlePexelsSearch}
                          disabled={isSearchingPexels}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-sage-600 text-white p-1.5 rounded-lg hover:bg-sage-700 transition-all"
                        >
                          {isSearchingPexels ? <Loader2 size={12} className="animate-spin" /> : <ChevronRight size={12} />}
                        </button>
                      </div>

                      {selectedPexelsImage && (
                        <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-sm group">
                          <img src={selectedPexelsImage} alt="Selected" className="w-full h-full object-cover" />
                          <button 
                            type="button"
                            onClick={() => setSelectedPexelsImage(null)}
                            className="absolute top-2 right-2 p-1 bg-white/80 backdrop-blur-md rounded-lg text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pexels Results Grid */}
                  <AnimatePresence>
                    {pexelsPhotos.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-gray-50 rounded-3xl p-4 overflow-hidden"
                      >
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Sugestões Pexels</p>
                        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                          {pexelsPhotos.map((photo) => (
                            <button
                              key={photo.id}
                              type="button"
                              onClick={() => setSelectedPexelsImage(photo.src.medium)}
                              className={cn(
                                "aspect-square rounded-lg overflow-hidden border-2 transition-all",
                                selectedPexelsImage === photo.src.medium ? "border-sage-600 scale-95" : "border-transparent hover:border-gray-200"
                              )}
                            >
                              <img src={photo.src.tiny} alt={photo.photographer} className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex items-center gap-3 p-4 bg-sage-50 rounded-2xl">
                  <div className="flex h-6 w-11 items-center rounded-full bg-sage-500 p-1 cursor-pointer">
                    <div className="h-4 w-4 rounded-full bg-white transition-all ml-auto" />
                  </div>
                  <span className="text-sm font-bold text-sage-900">Marcar como "Mais Vendido" / Destaque</span>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 font-bold text-gray-400 hover:text-gray-600 transition-colors">Cancelar</button>
                  <button type="submit" disabled={isAdding} className="flex-[2] bg-sage-900 text-white rounded-2xl py-4 font-bold flex items-center justify-center gap-2 hover:bg-sage-800 transition-all disabled:opacity-75 disabled:cursor-not-allowed">
                    {isAdding ? <Loader2 size={20} className="animate-spin" /> : <Check size={20} />}
                    {isAdding ? 'Salvando...' : 'Salvar Produto'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {productToDelete && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setProductToDelete(null)}
              className="absolute inset-0 bg-sage-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 text-center"
            >
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                <Trash2 size={24} />
              </div>
              <h3 className="text-xl font-extrabold text-gray-900 mb-2">Excluir Produto</h3>
              <p className="text-gray-500 text-sm mb-6 font-medium">
                Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setProductToDelete(null)} 
                  className="flex-1 py-3 font-bold text-gray-500 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={confirmDelete} 
                  className="flex-1 py-3 font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors"
                >
                  Excluir
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
