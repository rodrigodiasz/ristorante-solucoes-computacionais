'use client';

import { useState } from 'react';
import { CategoryProps, ProductProps } from '@/lib/order.type';
import { CategoriesTable } from './CategoriesTable';
import { ProductsTable } from './ProductsTable';
import { api } from '@/services/api';
import { getCookieClient } from '@/lib/cookieClient';
import { toast } from 'sonner';
import { Package, Tag } from 'lucide-react';

interface ManagementClientProps {
  initialCategories: CategoryProps[];
  initialProducts: ProductProps[];
}

export function ManagementClient({
  initialCategories,
  initialProducts,
}: ManagementClientProps) {
  const [categories, setCategories] =
    useState<CategoryProps[]>(initialCategories);
  const [products, setProducts] = useState<ProductProps[]>(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'categories' | 'products'>(
    'categories'
  );

  const refreshCategories = async () => {
    setIsLoading(true);
    try {
      const token = await getCookieClient();
      const response = await api.get('/categories', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(response.data);
    } catch (error) {
      console.error('Erro ao atualizar categorias:', error);
      toast.error('Erro ao atualizar categorias');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProducts = async () => {
    setIsLoading(true);
    try {
      const token = await getCookieClient();
      const response = await api.get('/products', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Erro ao atualizar produtos:', error);
      toast.error('Erro ao atualizar produtos');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-5 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Gerenciamento
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Gerencie categorias e produtos do sistema
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('categories')}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === 'categories'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Tag size={16} />
              Categorias
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === 'products'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Package size={16} />
              Produtos
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'categories' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Categorias
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Total de categorias: {categories.length}
              </p>
            </div>
            <button
              onClick={refreshCategories}
              disabled={isLoading}
              className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Atualizando...' : 'Atualizar Lista'}
            </button>
          </div>
          <CategoriesTable
            categories={categories}
            onCategoryUpdated={refreshCategories}
          />
        </div>
      )}

      {activeTab === 'products' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Produtos
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Total de produtos: {products.length}
              </p>
            </div>
            <button
              onClick={refreshProducts}
              disabled={isLoading}
              className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Atualizando...' : 'Atualizar Lista'}
            </button>
          </div>
          <ProductsTable
            products={products}
            categories={categories}
            onProductUpdated={refreshProducts}
          />
        </div>
      )}
    </div>
  );
}
