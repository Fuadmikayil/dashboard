//app/admin/edit/[id]/page.jsx
import EditForm from "@/components/EditForm";
import supabase from "@/lib/supabase";

export default async function EditPage({ params }) {
  const { id } = params;

  // 1️⃣ Server-side fetch
  const { data: item, error } = await supabase
    .from("product_list")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return <p className="text-red-600">Ürün yüklenirken hata: {error.message}</p>;
  }
  if (!item) {
    return <p>Ürün bulunamadı.</p>;
  }

  // 2️⃣ Pass it into your client component
  return <EditForm item={item} />;
}