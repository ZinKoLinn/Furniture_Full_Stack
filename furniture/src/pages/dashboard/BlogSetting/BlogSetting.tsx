import { Link } from "react-router";

import {
  Card,
  //CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icons } from "@/components/icons";

export default function BlogSetting() {
  return (
    <div>
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        <Link to="/dashboard/create-blog">
          <Card className="@container/card">
            <CardHeader>
              <CardDescription>Add or Create</CardDescription>
              <CardTitle className="flex items-center gap-1.5 text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                <Icons.plus className="size-8" /> Create a New Blog Post
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="mt-1 line-clamp-1 flex gap-2 font-medium">
                Add Blog Informations
              </div>
            </CardFooter>
          </Card>
        </Link>
        <Link to="/dashboard/update-blog">
          <Card className="@container/card">
            <CardHeader>
              <CardDescription>Update Blog</CardDescription>
              <CardTitle className="line-clamp-1 flex items-center gap-1.5 text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                <Icons.info className="size-8" /> Update Your Blog Post
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="mt-1 line-clamp-1 flex gap-2 font-medium">
                Add or Remove new Informations
              </div>
            </CardFooter>
          </Card>
        </Link>
        <Link to="/dashboard/delete-blog">
          <Card className="@container/card">
            <CardHeader>
              <CardDescription>Delete Blog</CardDescription>
              <CardTitle className="line-clamp-1 flex items-center gap-1.5 text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                <Icons.trash className="size-8" />
                Delete Your Blog Post
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="mt-1 line-clamp-1 flex gap-2 font-medium">
                Delete Old Blogs
              </div>
            </CardFooter>
          </Card>
        </Link>
      </div>
    </div>
  );
}
