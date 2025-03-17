import React from "react";
import { cn } from "@/libs/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline";
}

export default function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "rounded-lg px-4 py-2 font-medium transition-all",
        variant === "primary" ? "bg-blue-600 text-white hover:bg-blue-700" : "border border-gray-300 text-gray-700 hover:bg-gray-100",
        className
      )}
      {...props}
    />
  );
}
