export interface OrderProps {
  id: string;
  table: number;
  name: string;
  draft: boolean;
  status: boolean;
}

export interface OrderItemProps {
  id: string;
  amount: number;
  created_at: string;
  updated_at: string;
  order_id: string;
  product_id: string;
  product: {
    id: string;
    name: string;
    price: string;
    description: string;
    banner: string;
    category_id: string;
  };
  order: {
    id: string;
    table: number;
    status: boolean;
    draft: boolean;
    name: string;
  };
}

export interface CategoryProps {
  id: string;
  name: string;
  created_at: string;
  updated_at?: string;
}

export interface ProductProps {
  id: string;
  name: string;
  price: string;
  description: string;
  banner: string;
  category_id: string;
  created_at: string;
  updated_at: string;
}
