'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/services/api';
import { getCookieClient } from '@/lib/cookieClient';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CategoryProps, ProductProps, OrderProps } from '@/lib/order.type';
import { ShoppingCart, Plus, Minus, X } from 'lucide-react';

type OrderItemProps = {
  id: string;
  table: number;
};

function OrderPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const number = searchParams.get('number');
  const order_id = searchParams.get('order_id');

  const [category, setCategory] = useState<CategoryProps[]>([]);
  const [categorySelected, setCategorySelected] = useState<CategoryProps>();
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [productSelected, setProductSelected] = useState<ProductProps>();
  const [orders, setOrders] = useState<OrderItemProps[]>([]);
  const [orderSelected, setOrderSelected] = useState<OrderItemProps>();
  const [amount, setAmount] = useState('1');
  const [cartItems, setCartItems] = useState<
    Array<{
      product: ProductProps;
      amount: number;
    }>
  >([]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const token = await getCookieClient();
        const response = await api.get('/categories', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCategory(response.data);
        if (response.data.length > 0) {
          setCategorySelected(response.data[0]);
        }
      } catch (err) {
        console.log('Erro ao carregar categorias', err);
      }
    }

    async function loadOrders() {
      try {
        const token = await getCookieClient();
        const response = await api.get('/orders', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        let allOrders = response.data as OrderItemProps[];

        if (order_id && !allOrders.find(o => o.id === order_id)) {
          allOrders = [...allOrders, { id: order_id, table: Number(number) }];
        }

        setOrders(allOrders);

        if (order_id) {
          const mesa = allOrders.find(o => o.id === order_id);
          setOrderSelected(mesa || allOrders[0]);
        } else {
          setOrderSelected(allOrders[0]);
        }
      } catch (err) {
        console.log('Erro ao carregar mesas', err);
      }
    }

    loadCategories();
    loadOrders();
  }, [order_id, number]);

  useEffect(() => {
    async function loadProducts() {
      if (!categorySelected) return;

      try {
        const token = await getCookieClient();
        const response = await api.get('/category/product', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            category_id: categorySelected.id,
          },
        });
        setProducts(response.data);
        // Reset product selection when category changes
        setProductSelected(undefined);
      } catch (err) {
        console.log('Erro ao carregar produtos', err);
      }
    }

    loadProducts();
  }, [categorySelected]);

  function handleAddItem() {
    if (!orderSelected || !productSelected) {
      toast.error('Selecione uma mesa e um produto');
      return;
    }

    // Verificar se o produto já está no carrinho
    const existingItemIndex = cartItems.findIndex(
      item => item.product.id === productSelected.id
    );

    if (existingItemIndex >= 0) {
      // Se já existe, aumenta a quantidade
      setCartItems(prev =>
        prev.map((item, index) =>
          index === existingItemIndex
            ? { ...item, amount: item.amount + Number(amount) }
            : item
        )
      );
    } else {
      // Se não existe, adiciona novo item
      setCartItems(prev => [
        ...prev,
        {
          product: productSelected,
          amount: Number(amount),
        },
      ]);
    }

    toast.success('Item adicionado ao carrinho!');

    // Reset amount after adding item
    setAmount('1');
  }

  function removeFromCart(index: number) {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  }

  async function handleSendOrder() {
    if (!orderSelected) {
      toast.error('Selecione uma mesa');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Adicione pelo menos um item ao pedido');
      return;
    }

    try {
      const token = await getCookieClient();

      // Adicionar todos os itens do carrinho ao pedido
      for (const item of cartItems) {
        await api.post(
          '/order/add',
          {
            order_id: orderSelected.id,
            product_id: item.product.id,
            amount: item.amount,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      // Enviar o pedido para a cozinha
      await api.put(
        '/order/send',
        {
          order_id: orderSelected.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success('Pedido enviado para a cozinha!');

      // Limpar o carrinho
      setCartItems([]);

      router.push('/dashboard');
    } catch (err) {
      console.log(err);
      toast.error('Erro ao enviar pedido para a cozinha');
    }
  }

  return (
    <main className="container mx-auto max-w-6xl px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Seleção de Mesa */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
              Mesa
            </h2>
            {orders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-zinc-500 dark:text-zinc-400 mb-4">
                  Nenhuma mesa aberta
                </p>
                <Button
                  onClick={() => router.push('/dashboard/table')}
                  className="w-full bg-emerald-500 hover:bg-emerald-600"
                >
                  Abrir Mesa
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {orders.map(order => (
                  <button
                    key={order.id}
                    onClick={() => setOrderSelected(order)}
                    className={`w-full p-3 text-left rounded-lg border transition-colors ${
                      orderSelected?.id === order.id
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                        : 'border-zinc-200 dark:border-zinc-700 hover:border-emerald-300'
                    }`}
                  >
                    <span className="font-medium text-zinc-900 dark:text-white">
                      Mesa {order.table}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Seleção de Produtos */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
              Cardápio
            </h2>

            {/* Categorias */}
            <div className="mb-6">
              {category.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                    Nenhuma categoria cadastrada
                  </p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                    Cadastre categorias para exibir produtos
                  </p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {category.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setCategorySelected(cat)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        categorySelected?.id === cat.id
                          ? 'bg-emerald-500 text-white'
                          : 'bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/20'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Produtos */}
            {products.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-zinc-500 dark:text-zinc-400 mb-4">
                  {category.length === 0
                    ? 'Cadastre categorias e produtos primeiro'
                    : categorySelected
                    ? 'Nenhum produto nesta categoria'
                    : 'Selecione uma categoria para ver produtos'}
                </p>
                {category.length === 0 && (
                  <p className="text-sm text-zinc-400 dark:text-zinc-500">
                    Vá em "Categorias" e "Cardápio" para cadastrar
                  </p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {products.map(product => (
                  <div
                    key={product.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      productSelected?.id === product.id
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                        : 'border-zinc-200 dark:border-zinc-700 hover:border-emerald-300'
                    }`}
                    onClick={() => setProductSelected(product)}
                  >
                    <h3 className="font-medium text-zinc-900 dark:text-white mb-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                      {product.description}
                    </p>
                    <p className="font-semibold text-emerald-600">
                      R$ {product.price}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Quantidade e Adicionar */}
            {productSelected && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setAmount(String(Math.max(1, Number(amount) - 1)))
                    }
                    className="p-2 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700"
                  >
                    <Minus size={16} />
                  </button>
                  <Input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-20 text-center"
                    min="1"
                  />
                  <button
                    onClick={() => setAmount(String(Number(amount) + 1))}
                    className="p-2 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <Button
                  onClick={handleAddItem}
                  disabled={!orderSelected}
                  className="bg-emerald-500 hover:bg-emerald-600"
                >
                  <ShoppingCart size={16} className="mr-2" />
                  Adicionar
                </Button>
              </div>
            )}
          </div>

          {/* Carrinho de Itens */}
          {orderSelected && (
            <div className="mt-6 p-4 bg-zinc-50 dark:bg-zinc-700/50 rounded-lg border border-zinc-200 dark:border-zinc-600">
              <h3 className="text-sm font-medium text-zinc-900 dark:text-white mb-3">
                Pedido - Mesa {orderSelected.table}
              </h3>

              {cartItems.length === 0 ? (
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Nenhum item adicionado. Selecione produtos para adicionar ao
                  pedido.
                </p>
              ) : (
                <div className="space-y-2">
                  {cartItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center text-sm"
                    >
                      <div className="flex-1">
                        <span className="text-zinc-900 dark:text-white">
                          {item.product.name} x {item.amount}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-600 font-medium">
                          R${' '}
                          {(
                            item.amount * parseFloat(item.product.price)
                          ).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeFromCart(index)}
                          className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                          title="Remover item"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="border-t border-zinc-300 dark:border-zinc-600 pt-2 mt-2">
                    <div className="flex justify-between items-center font-medium">
                      <span className="text-zinc-900 dark:text-white">
                        Total:
                      </span>
                      <span className="text-emerald-600">
                        R${' '}
                        {cartItems
                          .reduce(
                            (sum, item) =>
                              sum +
                              item.amount * parseFloat(item.product.price),
                            0
                          )
                          .toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Enviar Pedido para Cozinha */}
          {orderSelected && (
            <div className="mt-6">
              <Button
                onClick={handleSendOrder}
                className="w-full bg-blue-500 hover:bg-blue-600"
                disabled={!orderSelected}
              >
                Enviar para Cozinha
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function OrderPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <OrderPageContent />
    </Suspense>
  );
}