// components/MenuItem.jsx
import Image from "next/image";
import supabase from "@/lib/supabase";

export default function MenuItem({ item }) {
const publicUrl = supabase
.storage
.from("product")
.getPublicUrl(item.image_url)
.data?.publicUrl;

return ( <div className="flex border-b py-2">
{publicUrl && ( <Image
       src={publicUrl}
       width={60}
       height={60}
       alt={item.title}
       unoptimized
       className="rounded-full"
     />
)} <div className="ml-4"> <h2 className="font-medium">{item.title}</h2> <p className="text-sm text-gray-600">{item.subtitle}</p> </div> <div className="ml-auto font-bold">{item.price}</div> </div>
);
}
