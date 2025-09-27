import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";

import HomePage from "@/pages/Home";
import AboutPage from "@/pages/About";
import RootLayout from "@/pages/RootLayout";
import ErrorPage from "@/pages/Error";
// import BlogPage from "@/pages/blogs/Blog";
// import BlogDetailPage from "@/pages/blogs/BlogDetail";
// import BlogRootLayout from "@/pages/blogs/BlogRootLayout";
const BlogPage = lazy(() => import("@/pages/blogs/Blog"));
const BlogDetailPage = lazy(() => import("@/pages/blogs/BlogDetail"));
const BlogRootLayout = lazy(() => import("@/pages/blogs/BlogRootLayout"));

import ProductRootLayout from "@/pages/products/ProductRootLayout";
import ProductDetailPage from "@/pages/products/ProductDetail";
import ProductPage from "@/pages/products/Product";
import LoginPage from "@/pages/auth/Login";
import RegisterPage from "@/pages/auth/Register";

const SuspenseFallback = () => <div className="text-center">Loading...</div>;

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "about", element: <AboutPage /> },
      {
        path: "blogs",
        element: (
          <Suspense fallback={<SuspenseFallback />}>
            <BlogRootLayout />
          </Suspense>
        ),
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<SuspenseFallback />}>
                <BlogPage />
              </Suspense>
            ),
          },
          {
            path: ":postId",
            element: (
              <Suspense fallback={<SuspenseFallback />}>
                <BlogDetailPage />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "products",
        element: <ProductRootLayout />,
        children: [
          { index: true, element: <ProductPage /> },
          { path: ":productId", element: <ProductDetailPage /> },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: (
      <Suspense fallback={<SuspenseFallback />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: "/register",
    element: (
      <Suspense fallback={<SuspenseFallback />}>
        <RegisterPage />
      </Suspense>
    ),
  },
]);
