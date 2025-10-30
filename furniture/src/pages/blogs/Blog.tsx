import { useInfiniteQuery } from "@tanstack/react-query";

import { postInfiniteQuery } from "@/api/query";
import BlogPostList from "@/components/blogs/BlogPostList";
import { Button } from "@/components/ui/button";
// import { posts } from "@/data/posts";

function Blog() {
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
  } = useInfiniteQuery(postInfiniteQuery());

  const allPosts = data?.pages.flatMap((page) => page.posts) ?? [];

  return status === "pending" ? (
    <p>Loading...</p>
  ) : status === "error" ? (
    <p>Error: {error.message}</p>
  ) : (
    <div className="container mx-auto">
      <h1 className="mt-8 text-center text-2xl font-bold md:text-left">
        Latest Blog Posts
      </h1>
      <BlogPostList posts={allPosts} />
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
          {isFetching && !isFetchingNextPage ? "Background updating..." : null}
        </div>
      </div>
    </div>
  );
}

export default Blog;
