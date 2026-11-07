
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  product_count: number;
};

type CategoryManagerProps = {
  initialCategories: Category[];
};

const emptyForm = {
  name: "",
  description: "",
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

export default function CategoryManager({
  initialCategories,
}: CategoryManagerProps) {
  const [categories, setCategories] = useState(initialCategories);
  const [form, setForm] = useState(emptyForm);
  const [editingCategory, setEditingCategory] =
    useState<Category | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();
  const supabase = createClient();

  function openNewForm() {
    setEditingCategory(null);
    setForm(emptyForm);
    setMessage("");
    setError("");
    setShowForm(true);
  }

  function openEditForm(category: Category) {
    setEditingCategory(category);
    setForm({
      name: category.name,
      description: category.description ?? "",
    });
    setMessage("");
    setError("");
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingCategory(null);
    setForm(emptyForm);
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setMessage("");

    const name = form.name.trim();
    const slug = createSlug(name);

    if (!name || !slug) {
      setError("Please enter a valid category name.");
      setSaving(false);
      return;
    }

    const categoryData = {
      name,
      slug,
      description: form.description.trim() || null,
    };

    try {
      if (editingCategory) {
        const { data, error: updateError } = await supabase
          .from("categories")
          .update(categoryData)
          .eq("id", editingCategory.id)
          .select("id, name, slug, description, is_active")
          .single();

        if (updateError) throw updateError;

        setCategories((previous) =>
          previous.map((category) =>
            category.id === editingCategory.id
              ? { ...data, product_count: category.product_count }
              : category
          )
        );

        setMessage("Category updated successfully.");
      } else {
        const { data, error: insertError } = await supabase
          .from("categories")
          .insert({
            ...categoryData,
            is_active: true,
          })
          .select("id, name, slug, description, is_active")
          .single();

        if (insertError) throw insertError;

        setCategories((previous) => [
          ...previous,
          { ...data, product_count: 0 },
        ]);

        setMessage("Category created successfully.");
      }

      closeForm();
      router.refresh();
    } catch (err) {
  console.error("Category save error:", err);

  const dbError = err as { code?: string };

  if (dbError.code === "23505") {
    setError(
      "A category with this name or URL slug already exists. Please choose another name."
    );
  } else {
    setError("Unable to save the category. Please try again.");
  }
}
      finally {
      setSaving(false);
    }
  }

  async function toggleCategoryStatus(category: Category) {
    setSavingId(category.id);
    setError("");
    setMessage("");

    try {
      const { error: updateError } = await supabase
        .from("categories")
        .update({ is_active: !category.is_active })
        .eq("id", category.id);

      if (updateError) throw updateError;

      setCategories((previous) =>
        previous.map((item) =>
          item.id === category.id
            ? { ...item, is_active: !item.is_active }
            : item
        )
      );

      setMessage(
        category.is_active
          ? "Category deactivated."
          : "Category activated."
      );

      router.refresh();
    } catch (err) {
      console.error("Category status error:", err);
      setError("Unable to update category status. Please try again.");
    } finally {
      setSavingId(null);
    }
  }

  const activeCount = categories.filter(
    (category) => category.is_active
  ).length;

  const totalProducts = categories.reduce(
    (total, category) => total + category.product_count,
    0
  );

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
            <p className="mt-1 text-xs text-[#94877e]">
              Category management
            </p>
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
            <p className="text-sm font-medium text-[#a65d3f]">
              STORE ORGANIZATION
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-[#38271f]">
              Categories
            </h1>
            <p className="mt-2 text-sm text-[#78685e]">
              Organize your spices and manage your product categories.
            </p>
          </div>

          <button
            type="button"
            onClick={openNewForm}
            className="rounded-lg bg-[#8f4d35] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#713b29]"
          >
            + Add category
          </button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-[#e8dfd2] bg-white p-5">
            <p className="text-sm text-[#78685e]">Total categories</p>
            <p className="mt-2 text-3xl font-semibold text-[#38271f]">
              {categories.length}
            </p>
          </div>

          <div className="rounded-xl border border-[#e8dfd2] bg-white p-5">
            <p className="text-sm text-[#78685e]">Active categories</p>
            <p className="mt-2 text-3xl font-semibold text-[#38271f]">
              {activeCount}
            </p>
          </div>

          <div className="rounded-xl border border-[#e8dfd2] bg-white p-5">
            <p className="text-sm text-[#78685e]">
              Products assigned to categories
            </p>
            <p className="mt-2 text-3xl font-semibold text-[#38271f]">
              {totalProducts}
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
                {editingCategory ? "Edit category" : "Add a new category"}
              </h2>

              <button
                type="button"
                onClick={closeForm}
                className="text-sm text-[#78685e] hover:text-[#38271f]"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#38271f]">
                  Category name *
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      name: event.target.value,
                    }))
                  }
                  placeholder="Example: Ground Spices"
                  className="w-full rounded-lg border border-[#e3d8cb] px-4 py-3 text-sm text-[#38271f] outline-none focus:border-[#a65d3f]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#38271f]">
                  URL slug
                </label>
                <p className="rounded-lg bg-[#f8f5ef] px-4 py-3 text-sm text-[#78685e]">
                  {createSlug(form.name) || "category-name"}
                </p>
                <p className="mt-2 text-xs text-[#94877e]">
                  Automatically generated from the category name.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#38271f]">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      description: event.target.value,
                    }))
                  }
                  placeholder="Describe this category..."
                  className="w-full rounded-lg border border-[#e3d8cb] px-4 py-3 text-sm text-[#38271f] outline-none focus:border-[#a65d3f]"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-[#8f4d35] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#713b29] disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingCategory
                      ? "Save changes"
                      : "Create category"}
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
          <div className="overflow-x-auto rounded-xl border border-[#e8dfd2] bg-white">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead className="border-b border-[#e8dfd2] bg-[#fbf9f5]">
                <tr className="text-[#78685e]">
                  <th className="px-5 py-4 font-medium">Category</th>
                  <th className="px-5 py-4 font-medium">Slug</th>
                  <th className="px-5 py-4 font-medium">Products</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 text-right font-medium">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#eee7de]">
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td className="px-5 py-4">
                      <p className="font-medium text-[#38271f]">
                        {category.name}
                      </p>
                      <p className="mt-1 max-w-xs truncate text-xs text-[#94877e]">
                        {category.description || "No description"}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-[#78685e]">
                      {category.slug}
                    </td>

                    <td className="px-5 py-4 text-[#78685e]">
                      {category.product_count}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={
                          category.is_active
                            ? "rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700"
                            : "rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
                        }
                      >
                        {category.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => openEditForm(category)}
                          className="font-medium text-[#8f4d35] hover:underline"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          disabled={savingId === category.id}
                          onClick={() => toggleCategoryStatus(category)}
                          className="font-medium text-[#78685e] hover:underline disabled:opacity-50"
                        >
                          {savingId === category.id
                            ? "Saving..."
                            : category.is_active
                              ? "Deactivate"
                              : "Activate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {categories.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-12 text-center text-[#94877e]"
                    >
                      No categories found. Create your first category to get started.
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
