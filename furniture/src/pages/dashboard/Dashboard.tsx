import { Link } from "react-router";

import {
  Card,
  //CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Dashboard() {
  return (
    <div>
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        <Link to="/profile">
          <Card className="@container/card">
            <CardHeader>
              <CardDescription>Profile</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                Profile Setting
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="mt-1 line-clamp-1 flex gap-2 font-medium">
                View Profile Information
              </div>
            </CardFooter>
          </Card>
        </Link>
        <Link to="/profile/favourite-products">
          <Card className="@container/card">
            <CardHeader>
              <CardDescription>Favourite Products</CardDescription>
              <CardTitle className="line-clamp-1 text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                Your Favourite Products
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="mt-1 line-clamp-1 flex gap-2 font-medium">
                View Your Favourite Products
              </div>
            </CardFooter>
          </Card>
        </Link>
      </div>
    </div>
  );
}
