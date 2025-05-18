"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase";
import Image from "next/image";

export default function EditForm({ item }) {
  const router = useRouter();
  const [title, setTitle] = useState(item.title);
  const [subtitle, setSubtitle] = useState(item.subtitle);
  const [price, setPrice] = useState(item.price);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(
    item.image_url
      ? supabase.storage.from("product").getPublicUrl(item.image_url).data?.publicUrl
      : null
  );

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let image_url = item.image_url;
    if (imageFile) {
      const fileName = `${Date.now()}_${imageFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from("product")
        .upload(fileName, imageFile);
      if (uploadError) return alert(uploadError.message);
      image_url = uploadData.path;
    }

    const { error } = await supabase
      .from("product_list")
      .update({ title, subtitle, price, image_url })
      .eq("id", item.id);

    if (error) {
      return alert("Güncelleme hatası: " + error.message);
    }

    router.push("/admin");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md space-y-6"
    >
      <h1 className="text-2xl font-semibold text-gray-800">Ürünü Düzenle</h1>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Başlık
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ürün Başlığı"
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Alt Başlık
        </label>
        <input
          type="text"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          placeholder="Ürün Açıklaması"
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Fiyat (₼)
        </label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="0"
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {previewUrl && (
        <div className="w-32 h-32 relative mx-auto">
          <Image
            src={previewUrl}
            alt="Önizleme" fill
            className="object-cover rounded-md"
            unoptimized
          />
        </div>
      )}

      <div>
        <label
          htmlFor="image"
          className="inline-block cursor-pointer text-sm font-medium text-indigo-600 hover:underline"
        >
          {imageFile ? "Resmi Değiştir" : "Resim Seç"}
        </label>
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="sr-only"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
      >
        Kaydet
      </button>
    </form>
  );
}