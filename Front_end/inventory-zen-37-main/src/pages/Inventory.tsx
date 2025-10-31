import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductTable, { Product } from "@/components/inventory/ProductTable";
import ProductDialog from "@/components/inventory/ProductDialog";
import { toast } from "sonner";

const Inventory = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/items');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        
        // Transform backend data to match frontend format
        const transformedProducts = (data.items || []).map(item => ({
          id: item.id.toString(),
          name: item.name,
          sku: item.id.toString().padStart(3, '0'),
          category: item.category,
          quantity: item.quantity,
          price: item.price,
          status: item.quantity === 0 ? 'out-of-stock' : 
                 item.quantity < 10 ? 'low-stock' : 'in-stock'
        }));

        setProducts(transformedProducts);
      } catch (error) {
        toast.error('Failed to fetch products');
        console.error('Error:', error);
      }
    };

    fetchProducts();
    const interval = setInterval(fetchProducts, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast.success("Product deleted successfully");
  };

  const handleSave = (product: Omit<Product, "id" | "status">) => {
    const getStatus = (quantity: number): Product["status"] => {
      if (quantity === 0) return "out-of-stock";
      if (quantity <= 10) return "low-stock";
      return "in-stock";
    };

    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? { ...product, id: p.id, status: getStatus(product.quantity) }
            : p
        )
      );
      toast.success("Product updated successfully");
    } else {
      const newProduct: Product = {
        ...product,
        id: Date.now().toString(),
        status: getStatus(product.quantity),
      };
      setProducts((prev) => [newProduct, ...prev]);
      toast.success("Product added successfully");
    }

    setIsDialogOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Inventory
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your products and stock levels
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingProduct(null);
            setIsDialogOpen(true);
          }}
          className="gap-2 shadow-glow"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      <ProductTable
        products={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ProductDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingProduct(null);
        }}
        product={editingProduct}
        onSave={handleSave}
      />
    </div>
  );
};

export default Inventory;
