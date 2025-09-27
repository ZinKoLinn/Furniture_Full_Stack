import { Link } from "react-router";
import { Icons } from "@/components/icons";
import Banenr from "@/data/images/house.webp";
import LoginForm from "@/components/auth/LoginForm";

function Login() {
  return (
    <div className="relative">
      <Link
        to="/"
        className="text-foreground/80 hover:text-foreground fixed top-6 left-8 flex items-center text-lg font-bold tracking-tight transition-colors"
      >
        <Icons.logo className="mr-2 size-6" />
        <span>Furniture Shop</span>
      </Link>
      <main className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        <div className="grid w-full place-items-center px-4">
          <LoginForm />
        </div>
        <div className="relative hidden size-full lg:block">
          <img
            src={Banenr}
            alt="Furniture Shop"
            className="absolute inset-0 object-cover"
          />
        </div>
      </main>
    </div>
  );
}

export default Login;
