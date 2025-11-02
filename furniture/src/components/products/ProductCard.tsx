import { Link } from "react-router";

import type { Product } from "@/types";
import { Icons } from "@/components/icons";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatPrice, cn } from "@/lib/utils";
import type { HtmlHTMLAttributes } from "react";
import { useCartStore } from "@/store/cartStore";

interface ProductProps extends HtmlHTMLAttributes<HTMLDivElement> {
  product: Product;
}
const imageUrl = import.meta.env.VITE_IMAGE_URL;

function ProductCard({ product, className }: ProductProps) {
  const { carts, addItems } = useCartStore();
  const cartItem = carts.find((item) => item.id === product.id);
  const handleAddToCart = () => {
    addItems({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0].path,
      quantity: 1,
    });
  };

  return (
    <Card className={cn("size-full overflow-hidden rounded-lg p-0", className)}>
      <Link to={`/products/${product.id}`} aria-label={product.name}>
        <CardHeader className="border-b p-0">
          <AspectRatio ratio={1 / 1} className="bg-muted">
            <img
              src={imageUrl + product.images[0].path}
              alt={product.name}
              className="size-full object-contain"
              loading="lazy"
              decoding="async"
            />
          </AspectRatio>
        </CardHeader>
        <CardContent className="space-y-1.5 p-4">
          <CardTitle className="line-clamp-1">{product.name}</CardTitle>
          <CardDescription className="line-clamp-1">
            {formatPrice(product.price)}
            {product.discount > 0 && (
              <span className="ml-2 font-extralight line-through">
                {formatPrice(product.discount)}
              </span>
            )}
          </CardDescription>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-1">
        {product.status === "INACTIVE" ? (
          <Button
            disabled={true}
            size="sm"
            aria-label="sold out"
            className="h-8 w-full rounded-sm font-bold"
          >
            Sold Out
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={!!cartItem}
            className="bg-own h-8 w-full rounded-sm font-bold"
          >
            {!cartItem && <Icons.plus />}
            {!cartItem ? "Add To Cart" : "Item Added"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ProductCard;
