import dompurify from "dompurify";
import type { HtmlHTMLAttributes } from "react";

interface Props extends HtmlHTMLAttributes<HTMLDivElement> {
  content: string;
}

function RichTextRender({ content, className }: Props) {
  const sanitizedContent = dompurify.sanitize(content);
  return (
    <div
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      className={className}
    />
  );
}

export default RichTextRender;
