'use client';

import { useState } from 'react';
import { CategoryProps } from '@/lib/order.type';
import { api } from '@/services/api';
import { getCookieClient } from '@/lib/cookieClient';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { EditCategoryModal } from './EditCategoryModal';

interface CategoriesTableProps {
  categories: CategoryProps[];
  onCategoryUpdated: () => void;
}

export function CategoriesTable({
  categories,
  onCategoryUpdated,
}: CategoriesTableProps) {
  const [deleting, setDeleting] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<CategoryProps | null>(
    null
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) {
      return;
    }

    setDeleting(categoryId);

    try {
      const token = await getCookieClient();

      await api.delete(`/categories/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('Categoria excluída com sucesso!');
      onCategoryUpdated();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message;

      if (errorMessage.includes('produtos com itens em pedidos ativos')) {
        toast.error(
          'Não é possível excluir categoria que possui produtos com itens em pedidos ativos. Finalize os pedidos primeiro.'
        );
      } else if (errorMessage.includes('produtos associados')) {
        toast.error(
          'Não é possível excluir categoria que possui produtos associados. Remova os produtos primeiro.'
        );
      } else {
        toast.error(`Erro ao excluir categoria: ${errorMessage}`);
      }
    } finally {
      setDeleting(null);
    }
  };

  const handleEditCategory = (category: CategoryProps) => {
    setEditingCategory(category);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingCategory(null);
  };

  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Nenhuma categoria encontrada
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Crie sua primeira categoria para começar
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
              Nome
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Data de Criação
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {categories.map(category => (
            <tr
              key={category.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {category.name}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {category.created_at
                  ? new Date(category.created_at).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : 'Data não disponível'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge
                  variant="default"
                  className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200"
                >
                  Ativa
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditCategory(category)}
                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <Edit size={14} className="mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteCategory(category.id)}
                    disabled={deleting === category.id}
                    className="text-red-600 hover:text-red-800 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Trash2 size={14} className="mr-1" />
                    {deleting === category.id ? 'Excluindo...' : 'Excluir'}
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <EditCategoryModal
        category={editingCategory}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onCategoryUpdated={onCategoryUpdated}
      />
    </div>
  );
}
