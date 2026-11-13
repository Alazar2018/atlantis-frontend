"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import ImageUpload from "@/components/ImageUpload";
import { blobToDataURL } from "@/lib/imageUtils";
import { useStaffRole } from "@/components/StaffRole";

interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
}

export default function CategoriesPage() {
  const role = useStaffRole();
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState<File[] | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      const headers: HeadersInit = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch("/api/categories", {
        credentials: "include",
        headers,
      });
      if (response.ok) {
        const data = await response.json();
        setCategories(data.map((cat: any) => ({
          id: cat.id.toString(),
          name: cat.name,
          description: cat.description || "",
          image: cat.image || "",
        })));
      } else {
        toast.error("Failed to load categories");
      }
    } catch (error) {
      console.error("Error loading categories:", error);
      toast.error("Failed to load categories");
    }
  };

  const handleImageChange = (files: File[] | null) => {
    setImageFile(files);
    if (files && files.length > 0) {
      setImagePreview(URL.createObjectURL(files[0]));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error("Please enter a category name");
      return;
    }

    try {
      // Convert blob URLs to data URLs before saving
      let imageUrl = "";
      
      if (imagePreview) {
        // If it's already a data URL, use it directly
        if (imagePreview.startsWith('data:')) {
          imageUrl = imagePreview;
        } 
        // If it's a blob URL, convert it
        else if (imagePreview.startsWith('blob:')) {
          imageUrl = await blobToDataURL(imagePreview);
        }
        // Otherwise, it might be an existing image URL
        else {
          imageUrl = imagePreview;
        }
      } 
      // If there's a new file but no preview yet, create data URL from file
      else if (imageFile && imageFile[0]) {
        const blobUrl = URL.createObjectURL(imageFile[0]);
        imageUrl = await blobToDataURL(blobUrl);
        URL.revokeObjectURL(blobUrl); // Clean up
      }
      // Otherwise, use existing image if editing
      else if (editingCategory?.image) {
        imageUrl = editingCategory.image;
      }

      const categoryData = {
        name: formData.name,
        description: formData.description,
        image_url: imageUrl,
      };

      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const url = editingCategory ? `/api/categories/${editingCategory.id}` : "/api/categories";
      const method = editingCategory ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers,
        credentials: "include",
        body: JSON.stringify(categoryData),
      });

      if (response.ok) {
        toast.success(editingCategory ? "Category updated successfully" : "Category created successfully");
        loadCategories(); // Reload categories
        resetForm();
      } else {
        const data = await response.json();
        toast.error(data.error || `Failed to ${editingCategory ? "update" : "create"} category`);
      }
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error(`Failed to ${editingCategory ? "update" : "create"} category`);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
    });
    setImagePreview(category.image);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
        const headers: HeadersInit = {};
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(`/api/categories/${id}`, {
          method: "DELETE",
          credentials: "include",
          headers,
        });
        if (response.ok) {
          toast.success("Category deleted successfully");
          loadCategories(); // Reload categories
        } else {
          const data = await response.json();
          toast.error(data.error || "Failed to delete category");
        }
      } catch (error) {
        console.error("Error deleting category:", error);
        toast.error("Failed to delete category");
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: "", description: "" });
    setImageFile(null);
    setImagePreview("");
    setEditingCategory(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-secondary mb-2">Categories</h1>
          <p className="text-sm md:text-base text-gray-600">Manage product categories</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-all text-sm md:text-base"
        >
          <Plus className="h-4 w-4 md:h-5 md:w-5" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Category Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-secondary mb-4">
            {editingCategory ? "Edit Category" : "Add New Category"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Image
              </label>
              <ImageUpload
                value={imagePreview}
                onChange={handleImageChange}
                multiple={false}
                enableCropping
                cropAspect={1}
                focusGuideText="Keep the primary subject inside the square to prevent it from being cropped."
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-all"
              >
                {editingCategory ? "Update" : "Create"} Category
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all"
          >
            <div className="relative h-48 bg-gray-200">
              {category.image ? (
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{category.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{category.description}</p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => handleEdit(category)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit className="h-5 w-5" />
                </button>
                {role === "admin" && (
                <button
                  onClick={() => handleDelete(category.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

