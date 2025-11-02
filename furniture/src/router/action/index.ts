import { redirect, useLoaderData, type ActionFunctionArgs } from "react-router";
import { AxiosError } from "axios";

import api, { authApi } from "@/api";
import useAuthStore, { Status } from "@/store/authStore";
import { queryClient } from "@/api/query";

export const loginAction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  //   const credentials = Object.fromEntries(formData);
  const authData = {
    phone: formData.get("phone"),
    password: formData.get("password"),
  };
  try {
    const response = await authApi.post("login", authData);

    if (response.status !== 200) {
      return { error: response.data || "Login Failed!" };
    }

    // await fetch(import.meta.env.VITE_API_URL + "login", {
    //   method: "POST",
    //   headers: {"Content-Type" : "application/json"},
    //   body: credentials,
    //   credentials: "include",
    // })

    const redirectTo = new URL(request.url).searchParams.get("redirect") || "/";

    return redirect(redirectTo);
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.data || { error: "Login Failed!" };
    } else throw error;
  }
};

export const logoutAction = async () => {
  try {
    await api.post("logout");
    return redirect("/login");
  } catch (error) {
    console.error("Logout Failed!", error);
  }
};

export const registerAction = async ({ request }: ActionFunctionArgs) => {
  const authStore = useAuthStore.getState();
  const formData = await request.formData();
  const credentials = Object.fromEntries(formData);

  try {
    const response = await authApi.post("register", credentials);

    if (response.status !== 200) {
      return { error: response.data || "Seinding OTP failed!" };
    }

    authStore.setAuth(response.data.phone, response.data.token, Status.otp);

    return redirect("/register/otp");
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.data || { error: "Sending Otp Failed!" };
    } else throw error;
  }
};

export const otpAction = async ({ request }: ActionFunctionArgs) => {
  const authStore = useAuthStore.getState();
  const formData = await request.formData();
  const credentials = {
    phone: authStore.phone,
    otp: formData.get("otp"),
    token: authStore.token,
  };
  try {
    const response = await authApi.post("verify-otp", credentials);

    if (response.status !== 200) {
      return { error: response.data || "Verifying OTP failed!" };
    }

    authStore.setAuth(response.data.phone, response.data.token, Status.confirm);

    return redirect("/register/confirm-password");
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.data || { error: "Otp Verification Failed!" };
    } else throw error;
  }
};

export const confirmAction = async ({ request }: ActionFunctionArgs) => {
  const authStore = useAuthStore.getState();
  const formData = await request.formData();
  const credentials = {
    phone: authStore.phone,
    password: formData.get("password"),
    token: authStore.token,
  };
  try {
    const response = await authApi.post("confirm-password", credentials);

    if (response.status !== 201) {
      return { error: response.data || "Registeration failed!" };
    }

    authStore.clearAuth();

    return redirect("/");
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.data || { error: "Registration Failed!" };
    } else throw error;
  }
};

export const favouriteAction = async ({
  request,
  params,
}: ActionFunctionArgs) => {
  const formData = await request.formData();

  const data = {
    productId: Number(params.productId),
    favourite: formData.get("favourite") === "true",
  };

  try {
    const response = await api.patch("users/products/toggle-favourite", data);

    if (response.status !== 200) {
      return { error: response.data || "Favourite marking  failed!" };
    }

    queryClient.invalidateQueries({
      queryKey: ["products", "details", params.productId],
    });

    return null;
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.data || { error: "Favourite marking Failed!" };
    } else throw error;
  }
};

export const forgotPasswordAction = async ({ request }: ActionFunctionArgs) => {
  const authStore = useAuthStore.getState();
  const formData = await request.formData();
  const credentials = Object.fromEntries(formData);

  try {
    const response = await authApi.post("forget-password", credentials);

    if (response.status !== 200) {
      return { error: response.data || "Seinding OTP failed!" };
    }

    authStore.setAuth(response.data.phone, response.data.token, Status.verify);

    return redirect("/reset/verify");
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.data || { error: "Sending Otp Failed!" };
    } else throw error;
  }
};

export const VerifyOTPAction = async ({ request }: ActionFunctionArgs) => {
  const authStore = useAuthStore.getState();
  const formData = await request.formData();
  const credentials = {
    phone: authStore.phone,
    otp: formData.get("otp"),
    token: authStore.token,
  };
  try {
    const response = await authApi.post("verify", credentials);

    if (response.status !== 200) {
      return { error: response.data || "Verifying OTP failed!" };
    }

    authStore.setAuth(response.data.phone, response.data.token, Status.reset);

    return redirect("/reset/new-password");
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.data || { error: "Otp Verification Failed!" };
    } else throw error;
  }
};

export const forgotNewPasswordAction = async ({
  request,
}: ActionFunctionArgs) => {
  const authStore = useAuthStore.getState();
  const formData = await request.formData();
  const credentials = {
    phone: authStore.phone,
    password: formData.get("password"),
    token: authStore.token,
  };
  try {
    const response = await authApi.post("reset-password", credentials);

    if (response.status !== 200) {
      return { error: response.data || "Reseting Password failed!" };
    }

    authStore.clearAuth();

    return redirect("/");
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.data || { error: "Reseting Password Failed!" };
    } else throw error;
  }
};

export const changeAction = async ({ request }: ActionFunctionArgs) => {
  const authStore = useAuthStore.getState();
  const formData = await request.formData();
  const credentials = {
    phone: authStore.phone,
    password: formData.get("password"),
  };

  try {
    const response = await authApi.post("change-password", credentials);

    if (response.status !== 200) {
      return { error: response.data || "Verifying Password failed!" };
    }

    authStore.setAuth(response.data.phone, "", Status.verify);

    return redirect("/change/confirm");
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.data || { error: "Verifying Password Failed!" };
    } else throw error;
  }
};

export const confirmChangeAction = async ({ request }: ActionFunctionArgs) => {
  const authStore = useAuthStore.getState();
  const formData = await request.formData();
  const credentials = {
    phone: authStore.phone,
    password: formData.get("password"),
  };
  try {
    const response = await authApi.post("confirm-change", credentials);

    if (response.status !== 200) {
      return { error: response.data || "Changing Password failed!" };
    }

    authStore.clearAuth();

    return redirect("/");
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.data || { error: "Changing Password Failed!" };
    } else throw error;
  }
};
