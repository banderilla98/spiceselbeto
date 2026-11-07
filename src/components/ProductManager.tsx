"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Product = {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  description: string | null;
  price: number;
  weight: string | null;
  image_url: string | null;
  category_id: string | null;
  stock_quantity: number;
  is_active: boolean;
  is_featured: boolean;
};

type Category = {
  id: string;
  name: string;
};

type ProductManagerProps = {
  initialProducts: Product[];
  categories: Category[];
};

const emptyForm = {
  name: "",
  sku: "",
  description: "",
  price: "",
  weight: "",
  category_id: "",
  stock_quantity: "0",
  is_active: true,
  is_featured: false,
};

function createSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getProductImagePath(imageUrl: string | null) {
  if (!imageUrl || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return null;
  }

  const publicUrlPrefix = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/`;

  if (!imageUrl.startsWith(publicUrlPrefix)) {
    return null;
  }

  const encodedPath = imageUrl.slice(publicUrlPrefix.length).split("?")[0];

  try {
    return encodedPath ? decodeURIComponent(encodedPath) : null;
  } catch {
    return null;
  }
}

export default function ProductManager({
  initialProducts,
  categories,
}: ProductManagerProps) {
  const [products, setProducts] = useState(initialProducts);
  const [form, setForm] = useState(emptyForm);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const supabase = createClient();

  const filteredProducts = products.filter((product) =>
    `${product.name} ${product.sku ?? ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  function updateField(field: keyof typeof emptyForm, value: string | boolean) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function openNewProductForm() {
    setEditingProduct(null);
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview(null);
    setError("");
    setMessage("");
    setShowForm(true);
  }

  function openEditForm(product: Product) {
    setEditingProduct(product);

    setForm({
      name: product.name,
      sku: product.sku ?? "",
      description: product.description ?? "",
      price: String(product.price),
      weight: product.weight ?? "",
      category_id: product.category_id ?? "",
      stock_quantity: String(product.stock_quantity),
      is_active: product.is_active,
      is_featured: product.is_featured,
    });

    setImageFile(null);
    setImagePreview(null);
    setError("");
    setMessage("");
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingProduct(null);
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview(null);
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setMessage("");

    const price = Number(form.price);
    const stock = Number(form.stock_quantity);

    if (!form.name.trim()) {
      setError("Please enter a product name.");
      setSaving(false);
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      setError("Please enter a valid price.");
      setSaving(false);
      return;
    }

    if (!Number.isInteger(stock) || stock < 0) {
      setError("Stock must be a whole number of zero or greater.");
      setSaving(false);
      return;
    }

    const productData = {
      name: form.name.trim(),
      slug: createSlug(form.name),
      sku: form.sku.trim() || null,
      description: form.description.trim() || null,
      price,
      weight: form.weight.trim() || null,
      category_id: form.category_id || null,
      stock_quantity: stock,
      is_active: form.is_active,
      is_featured: form.is_featured,
    };

    let uploadedImagePath: string | null = null;

    try {
      let imageUrl = editingProduct?.image_url ?? null;

      if (imageFile) {
        const extension =
          imageFile.type === "image/jpeg"
            ? "jpg"
            : imageFile.type === "image/png"
              ? "png"
              : "webp";

        const filePath = `products/${crypto.randomUUID()}.${extension}`;

        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(filePath, imageFile, {
            cacheControl: "3600",
            upsert: false,
            contentType: imageFile.type,
          });

        if (uploadError) {
          throw uploadError;
        }

        uploadedImagePath = filePath;

        const { data: publicUrlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(filePath);

        imageUrl = publicUrlData.publicUrl;
      }

      const finalProductData = {
        ...productData,
        image_url: imageUrl,
      };

      let savedProduct: Product;

      if (editingProduct) {
        const { data, error: updateError } = await supabase
          .from("products")
          .update(finalProductData)
          .eq("id", editingProduct.id)
          .select(
            "id, name, slug, sku, description, price, weight, image_url, category_id, stock_quantity, is_active, is_featured"
          )
          .single();

        if (updateError) {
          throw updateError;
        }

        savedProduct = data;

        setProducts((previous) =>
          previous.map((product) =>
            product.id === editingProduct.id ? savedProduct : product
          )
        );
      } else {
        const { data, error: insertError } = await supabase
          .from("products")
          .insert(finalProductData)
          .select(
            "id, name, slug, sku, description, price, weight, image_url, category_id, stock_quantity, is_active, is_featured"
          )
          .single();

        if (insertError) {
          throw insertError;
        }

        savedProduct = data;

        setProducts((previous) => [savedProduct, ...previous]);
      }

      uploadedImagePath = null;

      if (editingProduct && imageFile && editingProduct.image_url) {
        const oldImagePath = getProductImagePath(editingProduct.image_url);

        if (oldImagePath) {
          const { error: deleteError } = await supabase.storage
            .from("product-images")
            .remove([oldImagePath]);

          if (deleteError) {
            console.error("Old image cleanup error:", deleteError);
          }
        }
      }

      closeForm();

      setMessage(
        editingProduct
          ? "Product updated successfully."
          : "Product created successfully."
      );
    } catch (err) {
      console.error("Product save error:", err);

      if (uploadedImagePath) {
        const { error: cleanupError } = await supabase.storage
          .from("product-images")
          .remove([uploadedImagePath]);

        if (cleanupError) {
          console.error("Image cleanup error:", cleanupError);
        }
      }

      setError(
        "Unable to save the product. Check the product details and try again."
      );
    } finally {
      setSaving(false);
    }
  }

  async function toggleProductStatus(product: Product) {
    setError("");
    setMessage("");

    const { error: updateError } = await supabase
      .from("products")
      .update({ is_active: !product.is_active })
      .eq("id", product.id);

    if (updateError) {
      setError("Unable to update product status.");
      console.error(updateError);
      return;
    }

    setProducts((previous) =>
      previous.map((item) =>
        item.id === product.id ? { ...item, is_active: !item.is_active } : item
      )
    );

    setMessage(product.is_active ? "Product deactivated." : "Product activated.");
  }

  const activeCount = products.filter((product) => product.is_active).length;

  return (
    <main className="min-h-screen bg-[#f8f5ef]">
      <header className="border-b border-[#e8dfd2] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <Link
              href="/admin"
              className="text-sm font-semibold tracking-[0.25em] text-[#a65d3f]"
            >
              SPICES BETO
            </Link>
            <p className="mt-1 text-xs text-[#94877e]">Product management</p>
          </div>

          <Link
            href="/admin"
            className="text-sm font-medium text-[#713b29] hover:underline"
          >
            Back to dashboard
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-[#a65d3f]">STORE INVENTORY</p>
            <h1 className="mt-2 text-3xl font-semibold text-[#38271f]">
              Products
            </h1>
            <p className="mt-2 text-sm text-[#78685e]">
              Add, edit and manage your store products.
            </p>
          </div>

          <button
            type="button"
            onClick={openNewProductForm}
            className="rounded-lg bg-[#8f4d35] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#713b29]"
          >
            + Add product
          </button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-[#e8dfd2] bg-white p-5">
            <p className="text-sm text-[#78685e]">Total products</p>
            <p className="mt-2 text-3xl font-semibold text-[#38271f]">
              {products.length}
            </p>
          </div>

          <div className="rounded-xl border border-[#e8dfd2] bg-white p-5">
            <p className="text-sm text-[#78685e]">Active products</p>
            <p className="mt-2 text-3xl font-semibold text-[#38271f]">
              {activeCount}
            </p>
          </div>

          <div className="rounded-xl border border-[#e8dfd2] bg-white p-5">
            <p className="text-sm text-[#78685e]">Inactive products</p>
            <p className="mt-2 text-3xl font-semibold text-[#38271f]">
              {products.length - activeCount}
            </p>
          </div>
        </div>

        {message && (
          <p
            role="status"
            className="mt-6 rounded-lg bg-green-50 p-4 text-sm text-green-800"
          >
            {message}
          </p>
        )}

        {error && (
          <p
            role="alert"
            className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        {showForm && (
          <section className="mt-8 rounded-xl border border-[#e8dfd2] bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#38271f]">
                {editingProduct ? "Edit product" : "Add a new product"}
              </h2>

              <button
                type="button"
                onClick={closeForm}
                className="text-sm text-[#78685e] hover:text-[#38271f]"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#38271f]">
                  Product name *
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  placeholder="Example: Golden Turmeric"
                  className="w-full rounded-lg border border-[#e3d8cb] px-4 py-3 text-sm text-[#38271f] outline-none focus:border-[#a65d3f]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#38271f]">
                  SKU
                </label>
                <input
                  value={form.sku}
                  onChange={(event) => updateField("sku", event.target.value)}
                  placeholder="Example: SP-001"
                  className="w-full rounded-lg border border-[#e3d8cb] px-4 py-3 text-sm text-[#38271f] outline-none focus:border-[#a65d3f]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#38271f]">
                  Price (USD) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={form.price}
                  onChange={(event) => updateField("price", event.target.value)}
                  placeholder="5.99"
                  className="w-full rounded-lg border border-[#e3d8cb] px-4 py-3 text-sm text-[#38271f] outline-none focus:border-[#a65d3f]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#38271f]">
                  Weight
                </label>
                <input
                  value={form.weight}
                  onChange={(event) => updateField("weight", event.target.value)}
                  placeholder="100g"
                  className="w-full rounded-lg border border-[#e3d8cb] px-4 py-3 text-sm text-[#38271f] outline-none focus:border-[#a65d3f]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#38271f]">
                  Category
                </label>
                <select
                  value={form.category_id}
                  onChange={(event) =>
                    updateField("category_id", event.target.value)
                  }
                  className="w-full rounded-lg border border-[#e3d8cb] bg-white px-4 py-3 text-sm text-[#38271f] outline-none focus:border-[#a65d3f]"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#38271f]">
                  Stock quantity *
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  required
                  value={form.stock_quantity}
                  onChange={(event) =>
                    updateField("stock_quantity", event.target.value)
                  }
                  className="w-full rounded-lg border border-[#e3d8cb] px-4 py-3 text-sm text-[#38271f] outline-none focus:border-[#a65d3f]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-[#38271f]">
                  Product photo
                </label>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) => {
                    const file = event.target.files?.[0] ?? null;

                    if (!file) {
                      setImageFile(null);
                      setImagePreview(null);
                      return;
                    }

                    const allowedTypes = [
                      "image/jpeg",
                      "image/png",
                      "image/webp",
                    ];

                    if (!allowedTypes.includes(file.type)) {
                      setError("Please select a JPEG, PNG, or WebP image.");
                      event.target.value = "";
                      return;
                    }

                    if (file.size > 5 * 1024 * 1024) {
                      setError("The image must be smaller than 5 MB.");
                      event.target.value = "";
                      return;
                    }

                    setError("");
                    setImageFile(file);

                    const reader = new FileReader();

                    reader.onload = () => {
                      if (typeof reader.result === "string") {
                        setImagePreview(reader.result);
                      }
                    };

                    reader.readAsDataURL(file);
                  }}
                  className="block w-full rounded-lg border border-[#e3d8cb] bg-white p-3 text-sm text-[#38271f] file:mr-4 file:rounded-md file:border-0 file:bg-[#f8f5ef] file:px-4 file:py-2 file:text-sm file:font-medium file:text-[#713b29]"
                />

                <p className="mt-2 text-xs text-[#94877e]">
                  JPEG, PNG, or WebP. Maximum file size: 5 MB.
                </p>

                {(imagePreview || editingProduct?.image_url) && (
                  <div className="mt-4">
                    <p className="mb-2 text-sm font-medium text-[#38271f]">
                      {imagePreview ? "New photo preview" : "Current product photo"}
                    </p>

                    <Image
                      src={imagePreview || editingProduct?.image_url || ""}
                      alt="Product preview"
                      width={192}
                      height={192}
                      unoptimized
                      className="h-48 w-48 rounded-xl border border-[#e8dfd2] bg-[#f8f5ef] object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-[#38271f]">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(event) =>
                    updateField("description", event.target.value)
                  }
                  placeholder="Describe the product..."
                  className="w-full rounded-lg border border-[#e3d8cb] px-4 py-3 text-sm text-[#38271f] outline-none focus:border-[#a65d3f]"
                />
              </div>

              <div className="flex flex-wrap gap-6 sm:col-span-2">
                <label className="flex items-center gap-2 text-sm text-[#38271f]">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(event) =>
                      updateField("is_active", event.target.checked)
                    }
                    className="accent-[#8f4d35]"
                  />
                  Active product
                </label>

                <label className="flex items-center gap-2 text-sm text-[#38271f]">
                  <input
                    type="checkbox"
                    checked={form.is_featured}
                    onChange={(event) =>
                      updateField("is_featured", event.target.checked)
                    }
                    className="accent-[#8f4d35]"
                  />
                  Featured product
                </label>
              </div>

              <div className="flex flex-wrap gap-3 sm:col-span-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-[#8f4d35] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#713b29] disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingProduct
                      ? "Save changes"
                      : "Create product"}
                </button>

                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-lg border border-[#e3d8cb] px-6 py-3 text-sm font-medium text-[#713b29] hover:bg-[#f8f5ef]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="mt-10">
          <div className="mb-5">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products by name or SKU..."
              className="w-full max-w-md rounded-lg border border-[#e3d8cb] bg-white px-4 py-3 text-sm text-[#38271f] outline-none focus:border-[#a65d3f]"
            />
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#e8dfd2] bg-white">
            <table className="w-full min-w-[750px] text-left text-sm">
              <thead className="border-b border-[#e8dfd2] bg-[#fbf9f5]">
                <tr className="text-[#78685e]">
                  <th className="px-5 py-4 font-medium">Product</th>
                  <th className="px-5 py-4 font-medium">SKU</th>
                  <th className="px-5 py-4 font-medium">Price</th>
                  <th className="px-5 py-4 font-medium">Stock</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 text-right font-medium">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#eee7de]">
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="px-5 py-4">
                      <p className="font-medium text-[#38271f]">
                        {product.name}
                      </p>
                      <p className="mt-1 text-xs text-[#94877e]">
                        {product.weight || "No weight specified"}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-[#78685e]">
                      {product.sku || "—"}
                    </td>

                    <td className="px-5 py-4 font-medium text-[#38271f]">
                      ${Number(product.price).toFixed(2)}
                    </td>

                    <td className="px-5 py-4 text-[#78685e]">
                      {product.stock_quantity}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={
                          product.is_active
                            ? "rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700"
                            : "rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
                        }
                      >
                        {product.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => openEditForm(product)}
                          className="font-medium text-[#8f4d35] hover:underline"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleProductStatus(product)}
                          className="font-medium text-[#78685e] hover:underline"
                        >
                          {product.is_active ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredProducts.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-12 text-center text-[#94877e]"
                    >
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  );
}