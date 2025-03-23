
import { cn } from "@/lib/utils";
import React from "react";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
}

const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  ({ className, fallback = "/placeholder.png", alt = "", ...props }, ref) => {
    const [error, setError] = React.useState(false);

    return (
      <img
        ref={ref}
        alt={alt}
        className={cn("object-cover", className)}
        onError={() => setError(true)}
        src={error ? fallback : props.src}
        {...props}
      />
    );
  }
);

Image.displayName = "Image";

export default Image;
