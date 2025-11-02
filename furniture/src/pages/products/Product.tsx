import { useInfiniteQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";

//import { products, filterList } from "@/data/products";
import ProductCard from "@/components/products/ProductCard";
import ProductFilter from "@/components/products/ProductFilter";
//import Pagination from "@/components/products/Pagination";
import {
  categoryTypeQuery,
  productInfiniteQuery,
  queryClient,
} from "@/api/query";
import { Button } from "@/components/ui/button";
import { useFilterStore } from "@/store/filterStore";

function Product() {
  const [searchParams, setSearchParams] = useSearchParams();

  const rawCategory = searchParams.get("categories");
  const rawType = searchParams.get("types");

  const selectedCategory = rawCategory
    ? decodeURIComponent(rawCategory)
        .split(",")
        .map((cat) => Number(cat.trim()))
        .filter((cat) => !isNaN(cat))
        .map((cat) => cat.toString())
    : [];

  const selectedType = rawType
    ? decodeURIComponent(rawType)
        .split(",")
        .map((type) => Number(type.trim()))
        .filter((type) => !isNaN(type))
        .map((type) => type.toString())
    : [];

  const stateCat = useFilterStore((state) => state.category).join(",");
  const stateTyp = useFilterStore((state) => state.type).join(",");

  const cat = selectedCategory.length > 0 ? selectedCategory.join(",") : null;
  const type = selectedType.length > 0 ? selectedType.join(",") : null;

  const cat1 = stateCat ? stateCat : cat;
  const type1 = stateTyp ? stateTyp : type;

  const { data: cateType } = useSuspenseQuery(categoryTypeQuery());

  const {
    status,
    data,
    error,
    isFetching,
    isFetchingNextPage,
    //isFetchingPreviousPage,
    hasNextPage,
    //hasPreviousPage,
    fetchNextPage,
    //fetchPreviousPage,
    refetch,
  } = useInfiniteQuery(productInfiniteQuery(cat1, type1));

  const allProducts = data?.pages.flatMap((page) => page.products) ?? [];

  const handleFilterChange = (categories: string[], types: string[]) => {
    const newParams = new URLSearchParams();
    if (categories.length > 0)
      newParams.set("categories", encodeURIComponent(categories.join(",")));
    if (types.length > 0)
      newParams.set("types", encodeURIComponent(types.join(",")));

    setSearchParams(newParams);
    queryClient.cancelQueries({
      queryKey: ["products", "infinite"],
    });
    queryClient.removeQueries({
      queryKey: ["products", "infinite"],
    });
    refetch();
  };

  return status === "pending" ? (
    <p>Loading...</p>
  ) : status === "error" ? (
    <p>Error: {error.message}</p>
  ) : (
    <div className="container mx-auto">
      <section className="flex flex-col lg:flex-row">
        <section className="my-8 ml-4 w-full lg:ml-0 lg:w-1/5">
          <ProductFilter
            filterList={cateType}
            selectedCategory={selectedCategory}
            selectedType={selectedType}
            onFilterChange={handleFilterChange}
          />
        </section>
        <section className="w-full lg:ml-0 lg:w-4/5">
          <h1 className="my-8 ml-4 text-2xl font-bold">All Products</h1>
          <div className="mb-12 grid grid-cols-1 gap-6 gap-y-12 px-4 md:grid-cols-2 lg:grid-cols-3 lg:px-0">
            {allProducts.map((product) => (
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

export default Product;
