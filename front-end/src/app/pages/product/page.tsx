import { Form } from "./components/form";
import { api } from "@/services/api";
import { getCookieServer } from "@/lib/cookieServer";

export default async function Product() {
  const token = await getCookieServer();
  const response = await api.get("/categories", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return (
    <main className="container mx-auto p-5 items-center justify-center">
      <Form categories={response.data} />
    </main>
  );
}
