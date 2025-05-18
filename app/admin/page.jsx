"use client";

import { useState, useEffect } from "react";
import supabase from "@/lib/supabase";
import AdminItem from "@/components/AdminItem";
import ProductForm from "@/components/ProductForm";

export default function AdminPage() {
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Ürünleri getir
  const fetchItems = async () => {
    const { data, error } = await supabase
      .from("product_list")
      .select("*")
      .order("id", { ascending: false });
    if (!error && data) setItems(data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Formu aç/kapat, kapatılırken editingItem'ı sıfırla
  const handleToggleForm = () => {
    setShowForm((prev) => {
      if (prev) setEditingItem(null);
      return !prev;
    });
  };

  // Form gönderimi veya düzenleme bittiğinde
  const handleDone = () => {
    setShowForm(false);
    setEditingItem(null);
    fetchItems();
  };

  // Silme başarılı → listeden çıkar
  const handleDeleteSuccess = (deletedId) => {
    setItems((prev) => prev.filter((it) => it.id !== deletedId));
  };

  // Düzenle butonuna tıklanınca
  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button
        onClick={handleToggleForm}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        {showForm ? "İptal" : "Yeni Ürün Ekle"}
      </button>

      {showForm && (
        <ProductForm initialData={editingItem} onDone={handleDone} />
      )}

      <div className="space-y-4">
        {items.map((item) => (
          <AdminItem
            key={item.id}
            item={item}
            onEdit={() => handleEdit(item)}
            onDeleteSuccess={handleDeleteSuccess}
            // Düzenleme modundayken silmeyi disable et
            disableDelete={!!editingItem}
          />
        ))}
      </div>
    </div>
  );
}
