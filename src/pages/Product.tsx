import { useParams, Link } from "react-router-dom";
// using manual fetch instead of react-query for simplicity
import { getProduct } from "@/integrations/db/client";
import { useCart } from "@/hooks/useCart";
import { useState, useEffect } from "react";

const Product = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();

  const [product, setProduct] = useState<Awaited<ReturnType<typeof getProduct>> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    getProduct(id)
      .then((p) => setProduct(p))
      .catch((e) => console.error("Failed to load product", e))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-16 text-center">
        <p>Loading…</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-6 py-16 text-center">
        <p>Product not found.</p>
        <Link to="/shop" className="text-primary underline">
          Back to shop
        </Link>
      </div>
    );
  }

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image_url: product.image_url,
    });
  };

  return (
    <div className="container mx-auto px-6 py-16">
      <Link to="/shop" className="text-sm text-muted-foreground hover:underline">
        &larr; Back to shop
      </Link>

      <div className="mt-8 flex flex-col md:flex-row gap-8">
        {product.image_url && (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full md:w-1/2 object-contain"
          />
        )}
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-primary text-2xl font-semibold mt-2">
            ${product.price}
          </p>
          {product.description && (
            <p className="mt-4 text-muted-foreground">
              {product.description}
            </p>
          )}
          <button
            onClick={handleAdd}
            className="mt-6 px-6 py-3 bg-primary text-primary-foreground rounded-md"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;
