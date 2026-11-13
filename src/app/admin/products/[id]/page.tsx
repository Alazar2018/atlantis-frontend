"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";
import ImageUpload from "@/components/ImageUpload";
import { convertBlobUrlsToDataUrls, blobToDataURL } from "@/lib/imageUtils";

export default function ProductEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === "new";

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    isPublished: false,
    isFeatured: false,
    isOnSale: false,
    salePrice: "",
    sizes: "",
    hides: [] as string[],
  });

  const hideChoices = [
    { value: "carmine", label: "Carmine" },
    { value: "noir", label: "Noir" },
    { value: "oxblood", label: "Oxblood" },
    { value: "wine", label: "Wine" },
    { value: "blush", label: "Blush" },
  ];

  const [introImage, setIntroImage] = useState<File[] | null>(null);
  const [introImagePreview, setIntroImagePreview] = useState<string>("");
  const [images, setImages] = useState<File[] | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew) {
      loadProduct();
    }
    loadCategories();
  }, [id, isNew]);

  const loadProduct = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      const headers: HeadersInit = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`/api/products/${id}`, {
        credentials: "include",
        headers,
      });
      if (response.ok) {
        const product = await response.json();
        
        setFormData({
          name: product.name || "",
          description: product.description || "",
          price: product.price?.toString() || "",
          category: product.category_id?.toString() || "",
          stock: product.stock?.toString() || "",
          isPublished: product.isPublished || product.is_published || false,
          isFeatured: product.isFeatured || product.is_featured || false,
          isOnSale: product.isOnSale || product.is_on_sale || false,
          salePrice: product.salePrice?.toString() || product.sale_price?.toString() || "",
          sizes: Array.isArray(product.sizes) ? product.sizes.join(", ") : "",
          hides: Array.isArray(product.hides) ? product.hides : [],
        });
        
        setIntroImagePreview(product.introImage || product.intro_image || "");
        
        // Handle images - can be array or JSON string
        let parsedImages: string[] = [];
        if (product.images) {
          if (Array.isArray(product.images)) {
            parsedImages = product.images;
          } else if (typeof product.images === 'string') {
            try {
              parsedImages = JSON.parse(product.images);
            } catch (e) {
              // If parsing fails, treat as single image URL
              parsedImages = product.images ? [product.images] : [];
            }
          }
        }
        setImagePreviews(parsedImages);
      }
    } catch (error) {
      console.error("Error loading product:", error);
      toast.error("Failed to load product");
    }
  };

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
        setCategories(data);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const handleIntroImageChange = (files: File[] | null) => {
    setIntroImage(files);
    if (files && files.length > 0) {
      setIntroImagePreview(URL.createObjectURL(files[0]));
    }
  };

  const handleImagesChange = (files: File[] | null) => {
    if (files && files.length > 0) {
      // Add new file previews
      const newPreviews = files.map((f) => URL.createObjectURL(f));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
      // Store files separately if needed
      setImages((prev) => prev ? [...prev, ...files] : files);
    } else {
      // If files is null, it means user cleared everything
      setImages(null);
    }
  };

  const handleRemoveImage = (index: number) => {
    // Remove from previews - this is the source of truth
    setImagePreviews((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      return updated;
    });
    
    // Note: We don't need to track files separately since imagePreviews
    // contains all images (both existing URLs and new blob URLs)
    // When submitting, we use imagePreviews directly
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.isOnSale && (!formData.salePrice || parseFloat(formData.salePrice) >= parseFloat(formData.price))) {
      toast.error("Sale price must be less than regular price");
      return;
    }

    setSaving(true);

    try {
      // Convert blob URLs to data URLs for storage
      let introImageUrl = "";
      if (introImagePreview) {
        if (introImagePreview.startsWith('blob:')) {
          introImageUrl = await blobToDataURL(introImagePreview);
        } else {
          introImageUrl = introImagePreview;
        }
      } else if (introImage && introImage[0]) {
        introImageUrl = await blobToDataURL(URL.createObjectURL(introImage[0]));
      }

      // Convert all image URLs from blob to data URLs
      const imageUrls = await convertBlobUrlsToDataUrls(imagePreviews.filter(url => url));

      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category_id: parseInt(formData.category) || null,
        stock: parseInt(formData.stock) || 0,
        intro_image: introImageUrl,
        images: Array.isArray(imageUrls) ? imageUrls : (imageUrls ? [imageUrls] : []),
        is_published: formData.isPublished,
        is_featured: formData.isFeatured,
        is_on_sale: formData.isOnSale,
        sale_price: formData.isOnSale && formData.salePrice ? parseFloat(formData.salePrice) : null,
        sizes: formData.sizes.split(",").map((size) => size.trim()).filter(Boolean),
        hides: formData.hides,
      };

      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const url = isNew ? "/api/products" : `/api/products/${id}`;
      const method = isNew ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers,
        credentials: "include",
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        toast.success(isNew ? "Product created successfully" : "Product updated successfully");
        router.push("/admin/products");
      } else {
        const data = await response.json();
        toast.error(data.error || `Failed to ${isNew ? "create" : "update"} product`);
      }
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error(`Failed to ${isNew ? "create" : "update"} product`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 md:space-x-4">
        <Link
          href="/admin/products"
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-secondary">
          {isNew ? "Add New Product" : "Edit Product"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-4 md:p-6 border border-gray-200 space-y-4 md:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name <span className="text-red-500">*</span>
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
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price (ETB) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Intro Image <span className="text-red-500">*</span>
          </label>
          <ImageUpload
            value={introImagePreview}
            onChange={handleIntroImageChange}
            multiple={false}
            enableCropping
            cropAspect={1}
            focusGuideText="This cover image is shown as a square. Center the product inside the frame."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Images
          </label>
          <ImageUpload
            value={imagePreviews}
            onChange={handleImagesChange}
            onRemove={handleRemoveImage}
            multiple={true}
            enableCropping
            cropAspect={1}
            focusGuideText="These images display as squares. Move and zoom to keep key details visible."
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Sizes</label>
          <input
            type="text"
            value={formData.sizes}
            onChange={(event) => setFormData({ ...formData, sizes: event.target.value })}
            placeholder="Leave blank to use the house sizes. Example: 36, 37, 38"
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
          />
        </div>
        <div>
          <p className="mb-2 text-sm font-medium text-gray-700">Hides</p>
          <div className="flex flex-wrap gap-3">
            {hideChoices.map((hide) => (
              <label key={hide.value} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={formData.hides.includes(hide.value)}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      hides: event.target.checked
                        ? [...formData.hides, hide.value]
                        : formData.hides.filter((value) => value !== hide.value),
                    })
                  }
                />
                {hide.label}
              </label>
            ))}
          </div>
          <p className="mt-2 text-xs text-gray-500">Leave every hide unchecked to offer the full set.</p>
        </div>

        <div className="flex items-center space-x-6">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.isPublished}
              onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <span className="text-sm font-medium text-gray-700">Published</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.isFeatured}
              onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <span className="text-sm font-medium text-gray-700">Featured</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.isOnSale}
              onChange={(e) => setFormData({ ...formData, isOnSale: e.target.checked })}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <span className="text-sm font-medium text-gray-700">On Sale</span>
          </label>
        </div>

        {formData.isOnSale && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sale Price <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.salePrice}
              onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter sale price"
              min="0"
              required={formData.isOnSale}
            />
            <p className="text-xs text-gray-500 mt-1">
              Sale price must be less than regular price ({formData.price ? `ETB ${parseFloat(formData.price).toLocaleString()}` : 'regular price'})
            </p>
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <Link
            href="/admin/products"
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center space-x-2 px-6 py-2 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-5 w-5" />
            <span>{saving ? "Saving..." : (isNew ? "Create Product" : "Save Changes")}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

