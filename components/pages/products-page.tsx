"use client";

import { useEffect, useState } from "react";
import { SearchIcon, PlusIcon, XIcon, ImageIcon, DollarSignIcon, PackageIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { motion, AnimatePresence } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { seedProducts } from "@/lib/seed-data";
import type { NewProductPayload, ProductRecord } from "@/lib/types";
import { useI18n } from "@/lib/use-i18n";

const categories = ["Electronics", "Footwear", "Accessories", "Bags", "Clothing", "Home & Living"];
const statusOptions = ["In Stock", "Low Stock", "Out of Stock"] as const;

export default function Products() {
  const {
    tx,
    formatCurrency,
    countLabel,
    productCategoryLabel,
    productStatusLabel,
  } = useI18n();
  const [products, setProducts] = useState<ProductRecord[]>(seedProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "Electronics",
    price: "",
    stock: "",
    status: "In Stock" as "In Stock" | "Low Stock" | "Out of Stock",
    sku: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    let active = true;

    const loadProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error("Failed to load products.");
        }
        const data = (await response.json()) as { products: ProductRecord[] };
        if (active) {
          setProducts(data.products);
          setRequestError(null);
        }
      } catch {
        if (active) {
          setRequestError("Could not load products from API. Showing local data.");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void loadProducts();
    return () => {
      active = false;
    };
  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.sku || !newProduct.price) {
      return;
    }

    const parsedPrice = Number.parseFloat(newProduct.price);
    const parsedStock = Number.parseInt(newProduct.stock || "0", 10);

    const payload: NewProductPayload = {
      image: newProduct.image || undefined,
      name: newProduct.name.trim(),
      category: newProduct.category,
      price: Number.isNaN(parsedPrice) ? 0 : parsedPrice,
      stock: Number.isNaN(parsedStock) ? 0 : parsedStock,
      status: newProduct.status,
      sku: newProduct.sku.trim(),
    };

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to create product.");
      }

      const data = (await response.json()) as { product: ProductRecord };
      setProducts((prev) => [data.product, ...prev]);
      setIsDrawerOpen(false);
      setNewProduct({
        name: "",
        category: "Electronics",
        price: "",
        stock: "",
        status: "In Stock",
        sku: "",
        description: "",
        image: "",
      });
      setRequestError(null);
    } catch {
      setRequestError("Could not create product. Please try again.");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({ ...newProduct, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "In Stock":
        return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30";
      case "Low Stock":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/30";
      case "Out of Stock":
        return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30";
      default:
        return "";
    }
  };

  return (
    <>
      <div className='w-full sticky top-0 z-50 bg-white dark:bg-neutral-950 flex-shrink-0 flex flex-row h-16 items-center px-8 border-b border-neutral-200 dark:border-neutral-800'>
        <h1 className='text-lg font-bold'>{tx("products.title")}</h1>
        <div className="ml-4 flex gap-2">
          <Badge variant="outline" className="text-xs">
            {countLabel("products", products.length)}
          </Badge>
        </div>
        <div className="ml-auto flex gap-2">
          <Button size="sm" onClick={() => setIsDrawerOpen(true)}>
            <PlusIcon className="w-4 h-4 mr-2" />
            {tx("products.addProduct")}
          </Button>
        </div>
      </div>

      <div className="max-w-5xl w-full mx-auto flex-1 p-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder={tx("products.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11"
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {tx("products.showing", { shown: filteredProducts.length, total: products.length })}
          </p>
          {isLoading && <p className="text-xs text-muted-foreground mt-1">{tx("products.loading")}</p>}
          {requestError && <p className="text-xs text-red-500 mt-1">{requestError}</p>}
        </div>

        {/* Desktop Table - Hidden on Mobile */}
        <div className="hidden md:block rounded-lg w-full border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-900">
                <TableHead className="w-[100px]">{tx("common.image")}</TableHead>
                <TableHead>{tx("products.product")}</TableHead>
                <TableHead>{tx("common.category")}</TableHead>
                <TableHead>{tx("common.price")}</TableHead>
                <TableHead>{tx("common.stock")}</TableHead>
                <TableHead>{tx("common.status")}</TableHead>
                <TableHead className="text-right">{tx("common.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    {tx("products.noResults")}
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                    <TableCell>
                      <div className="relative w-16 h-16 rounded-md overflow-hidden border border-neutral-200 dark:border-neutral-800">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="64px"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-semibold text-sm">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.sku}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{productCategoryLabel(product.category)}</TableCell>
                    <TableCell className="text-sm font-medium">{formatCurrency(product.price)}</TableCell>
                    <TableCell className="text-sm">{product.stock}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-xs ${getStatusBadge(product.status)}`}>
                        {productStatusLabel(product.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 cursor-pointer"
                              aria-label="Edit product"
                            >
                              <PackageIcon className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{tx("products.viewDetails")}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards - Hidden on Desktop */}
        <div className="md:hidden space-y-2">
          {filteredProducts.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground border-none">
              {tx("products.noResults")}
            </Card>
          ) : (
            filteredProducts.map((product) => (
              <Card key={product.id} className="p-4 border-none">
                <div className="flex items-start gap-4">
                  {/* Product Image */}
                  <div className="relative w-20 h-20 rounded-md overflow-hidden border border-neutral-200 dark:border-neutral-800 flex-shrink-0">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="80px"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-sm truncate">{product.name}</h3>
                        <p className="text-xs text-muted-foreground">{product.sku}</p>
                        <p className="text-xs text-muted-foreground mt-1">{productCategoryLabel(product.category)}</p>
                      </div>
                      <Badge variant="outline" className={`text-xs flex-shrink-0 ${getStatusBadge(product.status)}`}>
                        {productStatusLabel(product.status)}
                      </Badge>
                    </div>

                    {/* Price, Stock and Actions */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-3">
                        <p className="text-sm font-semibold">{formatCurrency(product.price)}</p>
                        <span className="text-xs text-muted-foreground">{tx("products.stockLabel", { count: product.stock })}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        aria-label="View product details"
                      >
                        <PackageIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Drawer for adding product */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setIsDrawerOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full md:w-[500px] bg-white dark:bg-neutral-950 shadow-xl z-50 border-l border-neutral-200 dark:border-neutral-800 flex flex-col">
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-800">
                <h2 className="text-lg font-semibold">{tx("products.addNewProduct")}</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsDrawerOpen(false)}
                >
                  <XIcon className="w-4 h-4" />
                </Button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="space-y-4">
                  {/* Product Image */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">{tx("products.productImage")}</label>
                    <div className="flex items-center gap-4">
                      <div className="relative w-24 h-24 rounded-lg border-2 border-dashed border-neutral-300 dark:border-neutral-700 overflow-hidden">
                        {newProduct.image ? (
                          <Image
                            src={newProduct.image}
                            alt="Preview"
                            fill
                            sizes="96px"
                            unoptimized
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-neutral-50 dark:bg-neutral-900">
                            <ImageIcon className="w-8 h-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          id="product-image-upload"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById('product-image-upload')?.click()}
                        >
                          {tx("products.chooseImage")}
                        </Button>
                        <p className="text-xs text-muted-foreground mt-2">
                          JPG, PNG or WEBP. Max 5MB.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Product Name */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">{tx("products.productName")}</label>
                    <Input
                      type="text"
                      placeholder={tx("products.enterProductName")}
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    />
                  </div>

                  {/* SKU */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">{tx("products.sku")}</label>
                    <Input
                      type="text"
                      placeholder={tx("products.enterSku")}
                      value={newProduct.sku}
                      onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                    />
                  </div>

                  {/* Category Dropdown */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">{tx("common.category")}</label>
                    <select
                      className="w-full h-10 px-3 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-sm"
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {productCategoryLabel(cat)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">{tx("common.price")}</label>
                    <div className="relative">
                      <DollarSignIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="number"
                        placeholder="0.00"
                        className="pl-10"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Stock */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">{tx("products.stockQuantity")}</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">{tx("common.status")}</label>
                    <div className="flex gap-2">
                      {statusOptions.map((status) => (
                        <Button
                          key={status}
                          variant={newProduct.status === status ? "default" : "outline"}
                          size="sm"
                          className="flex-1"
                          onClick={() => setNewProduct({ ...newProduct, status })}
                        >
                          {productStatusLabel(status)}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">{tx("products.description")}</label>
                    <Textarea
                      placeholder={tx("products.enterDescription")}
                      rows={4}
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-6 border-t border-neutral-200 dark:border-neutral-800 flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsDrawerOpen(false)}
                >
                  {tx("common.cancel")}
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleAddProduct}
                  disabled={!newProduct.name || !newProduct.sku || !newProduct.price}
                >
                  {tx("products.addProduct")}
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
