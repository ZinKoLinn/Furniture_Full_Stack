import { useInfiniteQuery } from "@tanstack/react-query";

import ProductCard from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types";
import { favouriteProductQuery } from "@/api/query";

function FavouriteProducts() {
  const {
    data,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
  } = useInfiniteQuery(favouriteProductQuery());
  const allProducts = data?.pages.flatMap((page: any) => page.products) ?? [];

  return status === "pending" ? (
    <p>Loading...</p>
  ) : status === "error" ? (
    <p>Error: {error!.message}</p>
  ) : (
    <div className="container mx-auto">
      <section className="flex flex-col lg:flex-row">
        <section className="w-full lg:ml-0">
          <h1 className="my-8 ml-4 text-2xl font-bold">
            Your Favourite Products
          </h1>
          <div className="mb-12 grid grid-cols-1 gap-6 gap-y-12 px-4 md:grid-cols-2 lg:grid-cols-3 lg:px-0">
            {allProducts.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {/* <Pagination /> */}
          <div className="my-4 flex justify-center">
            <Button
              variant={!hasNextPage ? "ghost" : "secondary"}
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
            >
              {isFetchingNextPage
                ? "Loading more..."
                : hasNextPage
                  ? "Load more"
                  : "Nothing more to load..."}
            </Button>
            <div>
              {isFetching && !isFetchingNextPage
                ? "Background updating..."
                : null}
            </div>
          </div>
        </section>
      </section>
    </div>
  );
}

export default FavouriteProducts;
