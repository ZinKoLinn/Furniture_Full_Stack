// import { Suspense } from "react";
import { createBrowserRouter, redirect } from "react-router";

import HomePage from "@/pages/Home";
import AboutPage from "@/pages/About";
import RootLayout from "@/pages/RootLayout";
import ErrorPage from "@/pages/Error";
// import BlogPage from "@/pages/blogs/Blog";
// import BlogDetailPage from "@/pages/blogs/BlogDetail";
// import BlogRootLayout from "@/pages/blogs/BlogRootLayout";
// const BlogPage = lazy(() => import("@/pages/blogs/Blog"));
// const BlogDetailPage = lazy(() => import("@/pages/blogs/BlogDetail"));
// const BlogRootLayout = lazy(() => import("@/pages/blogs/BlogRootLayout"));

import ProductRootLayout from "@/pages/products/ProductRootLayout";
import ProductDetailPage from "@/pages/products/ProductDetail";
import ProductPage from "@/pages/products/Product";
import LoginPage from "@/pages/auth/Login";
// import RegisterPage from "@/pages/auth/Register";
import {
  blogInfiniteLoader,
  changeLoader,
  confirmChangeLoader,
  confirmLoader,
  favouriteProductLoader,
  forgotNewPasswordLoader,
  homeLoader,
  loginLoader,
  otpLoader,
  postLoader,
  productInfiniteLoader,
  productLoader,
  VerifyOTPLoader,
} from "@/router/loader";
import {
  changeAction,
  confirmAction,
  confirmChangeAction,
  createBlogAction,
  favouriteAction,
  forgotNewPasswordAction,
  forgotPasswordAction,
  loginAction,
  logoutAction,
  otpAction,
  registerAction,
  VerifyOTPAction,
} from "@/router/action";
import AuthRootLayout from "@/pages/auth/AuthRootLayout";
import SignUpPage from "@/pages/auth/SignUp";
import OtpPage from "@/pages/auth/Otp";
import ConfirmPasswordPage from "@/pages/auth/ConfirmPassword";
import ForgotPasswordPage from "@/pages/auth/ForgotPassword";
import VerifyOTPPage from "@/pages/auth/VerifyOTP";
import ChangePasswordPage from "@/pages/auth/ChangePassword";
import ConfirmChangePage from "@/pages/auth/ConfirmChangePassword";
import ProfileLayoutPage from "@/pages/profile/ProfileLayout";
import ProfilePage from "@/pages/profile/Profile";
import DashboardPage from "@/pages/dashboard/Dashboard";
import ProductSettingPage from "@/pages/dashboard/ProductSetting";

// const SuspenseFallback = () => <div className="text-center">Loading...</div>;

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    ErrorBoundary: ErrorPage,
    children: [
      {
        index: true,
        element: <HomePage />,
        loader: homeLoader,
      },
      { path: "about", element: <AboutPage /> },
      {
        path: "blogs",
        lazy: async () => {
          const mod = await import("@/pages/blogs/BlogRootLayout");

          return { Component: mod.default };
        },
        children: [
          {
            index: true,
            lazy: async () => {
              const mod = await import("@/pages/blogs/Blog");
              return { Component: mod.default, loader: blogInfiniteLoader };
            },
          },
          {
            path: ":postId",
            lazy: async () => {
              const mod = await import("@/pages/blogs/BlogDetail");

              return { Component: mod.default, loader: postLoader };
            },
          },
        ],
      },
      {
        path: "products",
        Component: ProductRootLayout,
        children: [
          {
            index: true,
            Component: ProductPage,
            loader: productInfiniteLoader,
          },
          {
            path: ":productId",
            Component: ProductDetailPage,
            loader: productLoader,
            action: favouriteAction,
          },
        ],
      },
      {
        path: "profile",
        Component: ProfileLayoutPage,
        children: [
          { index: true, Component: ProfilePage },
          {
            path: "favourite-products",
            lazy: async () => {
              const mod = await import("@/pages/profile/FavouriteProducts");

              return { Component: mod.default, loader: favouriteProductLoader };
            },
          },
        ],
      },
      {
        path: "dashboard",
        lazy: async () => {
          const mod = await import("@/pages/dashboard/DashboardLayout");

          return { Component: mod.default };
        },

        children: [
          {
            index: true,
            Component: DashboardPage,
          },
          {
            path: "product-setting",
            Component: ProductSettingPage,
          },
          {
            path: "blog-setting",
            lazy: async () => {
              const mod = await import(
                "@/pages/dashboard/BlogSetting/BlogSetting"
              );
              return { Component: mod.default };
            },
          },
          {
            path: "create-blog",
            lazy: async () => {
              const mod = await import(
                "@/pages/dashboard/BlogSetting/CreateBlog"
              );
              return { Component: mod.default, action: createBlogAction };
            },
          },
          {
            path: "update-blog",
            lazy: async () => {
              const mod = await import(
                "@/pages/dashboard/BlogSetting/UpdateBlog"
              );
              return { Component: mod.default };
            },
          },
          {
            path: "delete-blog",
            lazy: async () => {
              const mod = await import(
                "@/pages/dashboard/BlogSetting/DeleteBlog"
              );
              return { Component: mod.default };
            },
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    Component: LoginPage,
    action: loginAction,
    loader: loginLoader,
  },
  {
    path: "/register",
    Component: AuthRootLayout,
    children: [
      {
        index: true,
        Component: SignUpPage,
        loader: loginLoader,
        action: registerAction,
      },
      { path: "otp", Component: OtpPage, loader: otpLoader, action: otpAction },
      {
        path: "confirm-password",
        Component: ConfirmPasswordPage,
        loader: confirmLoader,
        action: confirmAction,
      },
    ],
  },
  {
    path: "/logout",
    action: logoutAction,
    loader: () => redirect("/"),
  },
  {
    path: "/reset",
    Component: AuthRootLayout,
    children: [
      {
        index: true,
        Component: ForgotPasswordPage,
        action: forgotPasswordAction,
      },
      {
        path: "verify",
        Component: VerifyOTPPage,
        loader: VerifyOTPLoader,
        action: VerifyOTPAction,
      },
      {
        path: "new-password",
        Component: ConfirmPasswordPage,
        loader: forgotNewPasswordLoader,
        action: forgotNewPasswordAction,
      },
    ],
  },
  {
    path: "/change",
    Component: AuthRootLayout,
    children: [
      {
        index: true,
        Component: ChangePasswordPage,
        loader: changeLoader,
        action: changeAction,
      },
      {
        path: "confirm",
        Component: ConfirmChangePage,
        loader: confirmChangeLoader,
        action: confirmChangeAction,
      },
    ],
  },
]);
