"use client";
import { FormEditarItem } from "@/components/autoral/item/formEditarItem";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function EditarItemPage() {
    const params = useParams();
    const id = params.id as string;

    return (
        <div className="container mx-auto py-10">
            <div className="text-sm text-gray-600 mb-5">
                <Link href="/" className="text-gray-500 hover:text-gray-700">
                    Home
                </Link>
                <span className="mx-2">&gt;</span>
                <Link href="/item" className="text-gray-500 hover:text-gray-700">
                    Item
                </Link>
                <span className="mx-2">&gt;</span>
                <span className="text-[#10476E] font-semibold">Editar Item</span>
            </div>
            <h1 className="text-2xl font-bold mb-5">Editar Item</h1>
            <FormEditarItem id={Number(id)} />
        </div>
    );
}
