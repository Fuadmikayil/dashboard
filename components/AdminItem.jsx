"use client";

import Image from "next/image";
import { Trash2, Edit3 } from "lucide-react";
import supabase from "@/lib/supabase";

export default function AdminItem({
  item,
  onEdit,
  onDeleteSuccess,
  disableDelete = false,  // Düzenleme moduysa true gelecek
}) {
  // Storage’daki public URL’i oluştur
  const publicUrl = supabase
    .storage
    .from("product")
    .getPublicUrl(item.image_url)
    .data?.publicUrl;

  const handleDelete = async () => {
    if (disableDelete) return;              // Düzenleme modunda asla silme
    if (!confirm("Bu ürünü silmek istediğine emin misin?")) return;

    // 1️⃣ Storage’dan sil
    const { error: storageError } = await supabase
      .storage
      .from("product")
      .remove([item.image_url]);
    if (storageError) {
      return alert("Dosya silinirken hata: " + storageError.message);
    }

    // 2️⃣ Veritabanından sil
    const { error: dbError } = await supabase
      .from("product_list")
      .delete()
      .eq("id", item.id);
    if (dbError) {
      return alert("Kayıt silinirken hata: " + dbError.message);
    }

    // 3️⃣ Parent’a bildir
    onDeleteSuccess(item.id);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center">
        {publicUrl ? (
          <div className="w-16 h-16 relative flex-shrink-0">
            <Image
              src={publicUrl}
              alt={item.title}
              fill
              className="object-cover rounded-md"
              unoptimized
            />
          </div>
        ) : (
          <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center">
            <span className="text-gray-400 text-sm">No Image</span>
          </div>
        )}

        <div className="ml-4 flex-1">
          <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
          <p className="text-sm text-gray-500">{item.subtitle}</p>
        </div>

        <div className="ml-4 flex items-center space-x-2">
          <span className="text-base font-bold text-indigo-600">
            {item.price}₼
          </span>

          <button
            onClick={onEdit}
            aria-label="Düzenle"
            className="p-2 rounded hover:bg-indigo-50 transition"
          >
            <Edit3 size={18} className="text-indigo-500" />
          </button>

          <button
            onClick={handleDelete}
            disabled={disableDelete}
            aria-label="Sil"
            className={`
              p-2 rounded transition
              ${disableDelete 
                ? "opacity-50 cursor-not-allowed" 
                : "hover:bg-red-50"}
            `}
          >
            <Trash2 size={18} className="text-red-500" />
          </button>
        </div>
      </div>
    </div>
  );
}
