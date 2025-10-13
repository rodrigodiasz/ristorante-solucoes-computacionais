"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/services/api";
import { getCookieClient } from "@/lib/cookieClient";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  CategoryProps, 
  ProductProps, 
  OrderProps 
} from "@/lib/order.type";
import { ShoppingCart, Plus, Minus } from "lucide-react";

type OrderItemProps = {
  id: string;
  table: number;
};

function OrderPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const number = searchParams.get("number");
  const order_id = searchParams.get("order_id");

  const [category, setCategory] = useState<CategoryProps[]>([]);
  const [categorySelected, setCategorySelected] = useState<CategoryProps>();
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [productSelected, setProductSelected] = useState<ProductProps>();
  const [orders, setOrders] = useState<OrderItemProps[]>([]);
  const [orderSelected, setOrderSelected] = useState<OrderItemProps>();
  const [amount, setAmount] = useState("1");

  useEffect(() => {
    async function loadCategories() {
      try {
        const token = await getCookieClient();
        const response = await api.get("/category", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCategory(response.data);
        setCategorySelected(response.data[0]);
      } catch (err) {
        console.log("Erro ao carregar categorias", err);
      }
    }

    async function loadOrders() {
      try {
        const token = await getCookieClient();
        const response = await api.get("/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        let allOrders = response.data as OrderItemProps[];

        if (order_id && !allOrders.find((o) => o.id === order_id)) {
          allOrders = [...allOrders, { id: order_id, table: Number(number) }];
        }

        setOrders(allOrders);

        if (order_id) {
          const mesa = allOrders.find((o) => o.id === order_id);
          setOrderSelected(mesa || allOrders[0]);
        } else {
          setOrderSelected(allOrders[0]);
        }
      } catch (err) {
        console.log("Erro ao carregar mesas", err);
      }
    }

    loadCategories();
    loadOrders();
  }, []);

  useEffect(() => {
    async function loadProducts() {
      if (!categorySelected) return;

      try {
        const token = await getCookieClient();
        const response = await api.get("/category/product", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            category_id: categorySelected.id,
          },
        });
        setProducts(response.data);
      } catch (err) {
        console.log("Erro ao carregar produtos", err);
      }
    }

    loadProducts();
  }, [categorySelected]);

  async function handleAddItem() {
    if (!orderSelected || !productSelected) {
      toast.error("Selecione uma mesa e um produto");
      return;
    }

    try {
      const token = await getCookieClient();
      await api.post(
        "/order/add",
        {
          order_id: orderSelected.id,
          product_id: productSelected.id,
          amount: Number(amount),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Item adicionado ao pedido!");
    } catch (err) {
      console.log(err);
      toast.error("Erro ao adicionar item");
    }
  }

  async function handleSendOrder() {
    if (!orderSelected) {
      toast.error("Selecione uma mesa");
      return;
    }

    try {
      const token = await getCookieClient();
      await api.put(
        "/order/send",
        {
          order_id: orderSelected.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Pedido enviado!");
      router.push("/dashboard");
    } catch (err) {
      console.log(err);
      toast.error("Erro ao enviar pedido");
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
            <div className="space-y-2">
              {orders.map((order) => (
                <button
                  key={order.id}
                  onClick={() => setOrderSelected(order)}
                  className={`w-full p-3 text-left rounded-lg border transition-colors ${
                    orderSelected?.id === order.id
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                      : "border-zinc-200 dark:border-zinc-700 hover:border-emerald-300"
                  }`}
                >
                  <span className="font-medium text-zinc-900 dark:text-white">
                    Mesa {order.table}
                  </span>
                </button>
              ))}
            </div>
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
              <div className="flex flex-wrap gap-2">
                {category.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategorySelected(cat)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      categorySelected?.id === cat.id
                        ? "bg-emerald-500 text-white"
                        : "bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/20"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Produtos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    productSelected?.id === product.id
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                      : "border-zinc-200 dark:border-zinc-700 hover:border-emerald-300"
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

            {/* Quantidade e Adicionar */}
            {productSelected && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setAmount(String(Math.max(1, Number(amount) - 1)))}
                    className="p-2 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700"
                  >
                    <Minus size={16} />
                  </button>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
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

          {/* Enviar Pedido */}
          {orderSelected && (
            <div className="mt-6">
              <Button
                onClick={handleSendOrder}
                className="w-full bg-blue-500 hover:bg-blue-600"
              >
                Enviar Pedido
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
