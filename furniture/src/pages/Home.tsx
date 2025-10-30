import { Link, useLoaderData } from "react-router";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

import Couch from "@/data/images/couch.png";
import { Button } from "@/components/ui/button";
import { CarouselCard } from "@/components/products/CarouselCard";
import BlogCard from "@/components/blogs/BlogCard";
import ProductCard from "@/components/products/ProductCard";
import type { Product } from "@/types";
import { postQuery, productQuery } from "@/api/query";
import { Skeleton } from "@/components/ui/skeleton";

function Home() {
  // const { productsData, postsData } = useLoaderData();

  // const {
  //   data: productsData,
  //   isLoading: isLoadingProduct,
  //   isError: isErrorProduct,
  //   error: errorProduct,
  //   refetch: refetchProduct,
  // } = useQuery(productQuery("?limit=8"));

  // const {
  //   data: postsData,
  //   isLoading: isLoadingPost,
  //   isError: isErrorPost,
  //   error: errorPost,
  //   refetch: refetchPost,
  // } = useQuery(postQuery("?limit=3"));

  // if (isLoadingPost && isLoadingProduct) {
  //   return (
  //     <div className="container mx-auto">
  //       <div className="flex flex-col lg:flex-row lg:justify-between">
  //         <div className="my-8 lg:mt-16 lg:mb-0 lg:w-2/5 lg:text-left">
  //           <Skeleton className="h-1/3 w-full" />
  //           <Skeleton className="h-1/3 w-full" />
  //         </div>
  //         <Skeleton className="h-full w-full rounded-xl lg:w-3/5" />
  //       </div>
  //     </div>
  //   );
  // }

  // if (isErrorPost && isErrorProduct) {
  //   <div className="container mx-auto my-32 flex flex-1 place-content-center">
  //     <div className="text-center text-red-400">
  //       <p className="mb-4">
  //         {errorProduct.message} & {errorPost.message}
  //       </p>
  //       <Button
  //         variant="secondary"
  //         onClick={() => {
  //           refetchProduct();
  //           refetchPost();
  //         }}
  //       >
  //         Retry
  //       </Button>
  //     </div>
  //   </div>;
  // }

  const { data: productsData } = useSuspenseQuery(productQuery("?limit=8"));
  const { data: postsData } = useSuspenseQuery(postQuery("?limit=3"));

  const Title = ({
    title,
    href,
    sideText,
  }: {
    title: string;
    href: string;
    sideText: string;
  }) => (
    <div className="mt-14 mb-10 flex flex-col px-4 md:flex-row md:justify-between md:px-0">
      <h2 className="mb-4 text-2xl font-bold md:mb-0">{title}</h2>
      <Link to={href} className="text-muted-foreground font-semibold underline">
        {sideText}
      </Link>
    </div>
  );

  return (
    <div className="container mx-auto">
      <div className="mb-10 flex flex-col lg:flex-row lg:justify-between">
        {/* Text Section */}
        <div className="my-8 text-center lg:mt-16 lg:mb-0 lg:w-2/5 lg:text-left">
          <h1 className="text-own mb-4 text-4xl font-extrabold lg:mb-8 lg:text-6xl">
            Modern Interior Design Studio
          </h1>
          <p className="text-own mb-6 lg:mb-8">
            Furniture is an essential component of any living space, providing
            functionality, comfort, and aesthetic appeal.
          </p>
          <div>
            <Button
              asChild
              className="mr-2 rounded-full bg-orange-300 px-8 py-6 text-base font-bold"
            >
              <Link to="#">Shop Now</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="text-own rounded-full px-8 py-6 text-base font-bold"
            >
              <Link to="#">Explore</Link>
            </Button>
          </div>
        </div>
        {/* Image Section */}
        <img src={Couch} alt="Couch" className="w-full lg:w-3/5" />
      </div>
      {productsData && <CarouselCard products={productsData.products} />}
      <Title
        title="Featured Products"
        href="/products"
        sideText="View All Products"
      />
      <div className="grid grid-cols-1 gap-6 px-4 md:grid-cols-2 md:px-0 lg:grid-cols-4">
        {productsData &&
          productsData.products
            .slice(0, 4)
            .map((product: Product) => (
              <ProductCard product={product} key={product.id} />
            ))}
      </div>
      <Title title="Recent Blogs" href="/blogs" sideText="View All Posts" />
      {postsData && <BlogCard posts={postsData.posts} />}{" "}
    </div>
  );
}

export default Home;
