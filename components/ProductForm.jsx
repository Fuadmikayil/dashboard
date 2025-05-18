"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase";
import Image from "next/image";

export default function ProductForm({ initialData = null, onDone }) {
  const router = useRouter();
  const isEdit = Boolean(initialData);

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Populate fields in edit mode
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setSubtitle(initialData.subtitle);
      setPrice(initialData.price);
      if (initialData.image_url) {
        const { data } = supabase
          .storage
          .from("product")
          .getPublicUrl(initialData.image_url);
        setPreviewUrl(data?.publicUrl);
      }
    }
  }, [initialData]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let image_url = initialData?.image_url || null;

    if (imageFile) {
      const fileName = `${Date.now()}_${imageFile.name}`;
      const { data, error: uploadError } = await supabase
        .storage
        .from("product")
        .upload(fileName, imageFile);
      if (uploadError) return alert(uploadError.message);

      // Delete old image in edit mode
      if (isEdit && initialData.image_url) {
        await supabase
          .storage
          .from("product")
          .remove([initialData.image_url]);
      }
      image_url = data.path;
    }

    const query = isEdit
      ? supabase
          .from("product_list")
          .update({ title, subtitle, price, image_url })
          .eq("id", initialData.id)
      : supabase
          .from("product_list")
          .insert({ title, subtitle, price, image_url });

    const { error } = await query;
    if (error) return alert(error.message);

    onDone?.();
    router.refresh();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md space-y-6"
    >
      <h2 className="text-2xl font-semibold text-gray-800">
        {isEdit ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Başlık
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ürün Başlığı"
          required
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
          required
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {previewUrl && (
        <div className="w-32 h-32 relative mx-auto">
          <Image
            src={previewUrl}
            alt="Önizleme"
            fill
            className="object-cover rounded-md"
            unoptimized
          />
        </div>
      )}

      <div>
        <label
          htmlFor="image"
          className="inline-block text-sm font-medium text-indigo-600 hover:underline cursor-pointer"
        >
          {imageFile ? "Resmi Değiştir" : "Resim Seç"}
        </label>
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="sr-only"
          {...(!isEdit && { required: true })}
        />
      </div>

      <button
        type="submit"
        className={`w-full py-2 rounded-md text-white transition-colors ${
          isEdit ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {isEdit ? "Güncelle" : "Ekle"}
      </button>
    </form>
  );
}