import api, { authApi } from "@/api";
import {
  categoryTypeQuery,
  onePostQuery,
  oneProductQuery,
  postInfiniteQuery,
  postQuery,
  productInfiniteQuery,
  productQuery,
  queryClient,
} from "@/api/query";
import useAuthStore, { Status } from "@/store/authStore";
import { redirect, type LoaderFunctionArgs } from "react-router";

// export const homeLoader = async () => {
//   try {
//     const products = await api.get("users/products?limit=8");
//     const posts = await api.get("users/posts/infinite?limit=3");

//     // const [products, posts] = await Promise.all([
//     //   api.get("users/products?limit=8"),
//     //   api.get("users/posts/infinite?limit=3")
//     // ])

//     return { productsData: products.data, postsData: posts.data };
//   } catch (error) {
//     console.log("HomeLoader Error: ", error);
//   }
// };

export const homeLoader = async () => {
  await queryClient.ensureQueryData(productQuery("?limit=8"));
  await queryClient.ensureQueryData(postQuery("?limit=3"));
  return null;
};

export const loginLoader = async () => {
  try {
    const response = await authApi.get("auth-check");
    if (response.status !== 200) {
      return null;
    }
    return redirect("/");
  } catch (error) {
    console.log("Loader Error: ", error);
  }
};

export const otpLoader = async () => {
  const authStore = useAuthStore.getState();
  if (authStore.status !== Status.otp) {
    return redirect("/register");
  }
  return null;
};

export const confirmLoader = async () => {
  const authStore = useAuthStore.getState();
  if (authStore.status !== Status.confirm) {
    return redirect("/register");
  }
  return null;
};

export const blogInfiniteLoader = async () => {
  await queryClient.ensureInfiniteQueryData(postInfiniteQuery());
  return null;
};

export const postLoader = async ({ params }: LoaderFunctionArgs) => {
  if (!params.postId) {
    throw new Error("No Post Id is provided.");
  }
  await queryClient.ensureQueryData(postQuery("?limit=6"));
  await queryClient.ensureQueryData(onePostQuery(Number(params.postId)));
  return { postId: params.postId };
};

export const productInfiniteLoader = async () => {
  await queryClient.ensureQueryData(categoryTypeQuery());
  await queryClient.prefetchInfiniteQuery(productInfiniteQuery());
  return null;
};

export const productLoader = async ({ params }: LoaderFunctionArgs) => {
  if (!params.productId) {
    throw new Error("No Product Id is provided.");
  }
  await queryClient.ensureQueryData(productQuery("?limit=4"));
  await queryClient.ensureQueryData(oneProductQuery(Number(params.productId)));
  return { productId: params.productId };
};

export const VerifyOTPLoader = async () => {
  const authStore = useAuthStore.getState();
  if (authStore.status !== Status.verify) {
    return redirect("/reset");
  }
  return null;
};

export const forgotNewPasswordLoader = async () => {
  const authStore = useAuthStore.getState();
  if (authStore.status !== Status.reset) {
    return redirect("/reset");
  }
  return null;
};

export const changeLoader = async () => {
  try {
    const response = await authApi.get("auth-check");
    if (response.status === 200) {
      const authStore = useAuthStore.getState();

      authStore.setAuth(response.data.phone, "", Status.none);

      return response.data;
    }
    return redirect("/login");
  } catch (error) {
    console.log("Loader Error: ", error);
  }
};

export const confirmChangeLoader = async () => {
  const authStore = useAuthStore.getState();
  if (authStore.status !== Status.verify) {
    return redirect("/change");
  }
  return null;
};
