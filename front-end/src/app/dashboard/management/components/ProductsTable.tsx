'use client';

import { useState } from 'react';
import { ProductProps, CategoryProps } from '@/lib/order.type';
import { api } from '@/services/api';
import { getCookieClient } from '@/lib/cookieClient';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { EditProductModal } from './EditProductModal';

interface ProductsTableProps {
  products: ProductProps[];
  categories: CategoryProps[];
  onProductUpdated: () => void;
}

export function ProductsTable({
  products,
  categories,
  onProductUpdated,
}: ProductsTableProps) {
  const [deleting, setDeleting] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<ProductProps | null>(
    null
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) {
      return;
    }

    setDeleting(productId);

    try {
      const token = await getCookieClient();

      await api.delete(`/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('Produto excluído com sucesso!');
      onProductUpdated();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message;

      if (errorMessage.includes('itens em pedidos')) {
        toast.error(
          'Não é possível excluir produto que possui itens em pedidos ativos. Finalize os pedidos primeiro.'
        );
      } else {
        toast.error(`Erro ao excluir produto: ${errorMessage}`);
      }
    } finally {
      setDeleting(null);
    }
  };

  const handleEditProduct = (product: ProductProps) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingProduct(null);
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(parseFloat(price));
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Nenhum produto encontrado
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Crie seu primeiro produto para começar
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Produto
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Preço
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Categoria
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Data de Criação
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {products.map(product => (
            <tr
              key={product.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {product.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                    {product.description}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {formatPrice(product.price)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge variant="secondary">
                  {product.category?.name || 'Sem categoria'}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {product.created_at
                  ? new Date(product.created_at).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : 'Data não disponível'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditProduct(product)}
                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <Edit size={14} className="mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteProduct(product.id)}
                    disabled={deleting === product.id}
                    className="text-red-600 hover:text-red-800 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Trash2 size={14} className="mr-1" />
                    {deleting === product.id ? 'Excluindo...' : 'Excluir'}
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <EditProductModal
        product={editingProduct}
        categories={categories}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onProductUpdated={onProductUpdated}
      />
    </div>
  );
}
