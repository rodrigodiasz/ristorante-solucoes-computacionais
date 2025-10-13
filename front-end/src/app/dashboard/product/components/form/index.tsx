'use client';
import { UploadCloud, PackageIcon } from 'lucide-react';
import { ChangeEvent, useState } from 'react';
import Image from 'next/image';
import { api } from '@/services/api';
import { getCookieClient } from '@/lib/cookieClient';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CategoryProps {
  id: string;
  name: string;
}

interface Props {
  categories: CategoryProps[];
}

export function Form({ categories }: Props) {
  const router = useRouter();
  const [image, setImage] = useState<File>();
  const [previewImage, setPreviewImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const image = e.target.files[0];

      if (image.type !== 'image/jpeg' && image.type !== 'image/png') {
        toast.warning('Formato proibido!');
        return;
      }

      setImage(image);
      setPreviewImage(URL.createObjectURL(image));
    }
  }

  async function handleRegisterProduct(formData: FormData) {
    const categoryIndex = formData.get('category');
    const name = formData.get('name');
    const price = formData.get('price');
    const description = formData.get('description');

    if (!name || !categoryIndex || !price || !description || !image) {
      toast.warning('Preencha todos os campos');
      return;
    }

    setIsLoading(true);
    const data = new FormData();

    data.append('name', name);
    data.append('price', price);
    data.append('description', description);
    data.append('category_id', categories[Number(categoryIndex)].id);
    data.append('file', image);

    console.log('=== Frontend Debug ===');
    console.log('Form data being sent:');
    console.log('name:', name);
    console.log('price:', price);
    console.log('description:', description);
    console.log('category_id:', categories[Number(categoryIndex)].id);
    console.log('image:', image);
    console.log('FormData entries:');
    for (let [key, value] of data.entries()) {
      console.log(key, value);
    }

    const token = await getCookieClient();
    console.log('Token:', token);

    try {
      console.log('Making API request to /products');
      const response = await api.post('/products', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('API response:', response);
      toast.success('Produto registrado com sucesso');
      router.push('/dashboard');
    } catch (err) {
      console.log(err);
      toast.warning('Falha ao cadastrar esse produto!');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex flex-col items-center mb-8">
        <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-4">
          <PackageIcon className="w-8 h-8 text-emerald-500" />
        </div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
          Novo Produto
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Adicione um novo produto ao seu cardápio
        </p>
      </div>

      <form
        className="space-y-6 bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 transition-colors"
        action={handleRegisterProduct}
      >
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Imagem do Produto
          </label>
          <div className="relative w-full aspect-[4/3] rounded-lg border-2 border-dashed border-zinc-200 dark:border-zinc-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors">
            <input
              type="file"
              accept="image/png, image/jpeg"
              required
              onChange={handleFile}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />

            {previewImage ? (
              <Image
                src={previewImage}
                alt="Preview"
                fill
                className="object-cover rounded-lg"
                quality={100}
                priority
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-zinc-500 dark:text-zinc-400">
                <UploadCloud size={32} />
                <span className="text-sm">
                  Clique para fazer upload da imagem
                </span>
                <span className="text-xs">PNG ou JPEG</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Categoria
          </label>
          <Select name="category" onValueChange={value => console.log(value)}>
            <SelectTrigger className="w-full dark:bg-zinc-800 bg-white text-zinc-900 dark:text-white border-zinc-200 dark:border-zinc-700 h-9 transition-colors">
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 transition-colors">
              {categories.map((category, index) => (
                <SelectItem
                  key={category.id}
                  value={String(index)}
                  className="text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-700"
                >
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Nome do Produto
          </label>
          <Input
            className="w-full dark:bg-zinc-800 bg-white text-zinc-900 dark:text-white border-zinc-200 dark:border-zinc-700 transition-colors"
            type="text"
            name="name"
            required
            placeholder="Ex: Pizza Margherita"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Preço
          </label>
          <Input
            className="w-full dark:bg-zinc-800 bg-white text-zinc-900 dark:text-white border-zinc-200 dark:border-zinc-700 transition-colors"
            type="text"
            name="price"
            required
            placeholder="Ex: 45.90"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Descrição
          </label>
          <Textarea
            className="w-full min-h-[120px] dark:bg-zinc-800 bg-white text-zinc-900 dark:text-white border-zinc-200 dark:border-zinc-700 transition-colors"
            name="description"
            required
            placeholder="Descreva os detalhes do produto..."
          />
        </div>

        <Button
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2.5 transition-colors"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Cadastrando...' : 'Cadastrar Produto'}
        </Button>
      </form>
    </main>
  );
}
