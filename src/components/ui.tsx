import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 border text-sm font-semibold tracking-[0.01em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b4935a] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "border-[#263d32] bg-[#263d32] px-5 text-white hover:bg-[#334f40]",
        secondary:
          "border-[#b7aa97] bg-transparent px-5 text-[#263d32] hover:bg-[#eee7da]",
        quiet:
          "border-transparent bg-transparent px-3 text-[#4b524a] hover:bg-[#eee7da]",
        danger:
          "border-[#a65f45] bg-transparent px-4 text-[#8d4634] hover:bg-[#f2e2db]",
      },
      size: {
        default: "h-11",
        sm: "min-h-9 px-3 text-xs",
        lg: "min-h-13 px-7 text-base",
        icon: "size-11 p-0",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({
  className,
  variant,
  size,
  asChild,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("border border-[#d8cdbd] bg-white", className)}
      {...props}
    />
  );
}

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "min-h-11 w-full border border-[#bdb2a3] bg-white px-3 text-[15px] text-[#282825] outline-none placeholder:text-[#77776f] focus:border-[#263d32] focus:ring-1 focus:ring-[#263d32]",
        className,
      )}
      {...props}
    />
  );
}

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "min-h-11 w-full border border-[#bdb2a3] bg-white px-3 text-[15px] text-[#282825] outline-none focus:border-[#263d32] focus:ring-1 focus:ring-[#263d32]",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full resize-y border border-[#bdb2a3] bg-white p-3 text-[15px] text-[#282825] outline-none placeholder:text-[#77776f] focus:border-[#263d32] focus:ring-1 focus:ring-[#263d32]",
        className,
      )}
      {...props}
    />
  );
}

export function Badge({
  children,
  tone = "sage",
}: {
  children: React.ReactNode;
  tone?: "sage" | "gold" | "stone" | "terracotta";
}) {
  const colors = {
    sage: "bg-[#e7ebe3] text-[#40513f]",
    gold: "bg-[#f1e9d9] text-[#705c37]",
    stone: "bg-[#eeeae3] text-[#5b5852]",
    terracotta: "bg-[#f3e4df] text-[#864936]",
  };
  return (
    <span
      className={cn(
        "inline-flex min-h-7 items-center px-2.5 text-xs font-semibold",
        colors[tone],
      )}
    >
      {children}
    </span>
  );
}

export function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-[#40403c]">
      {label}
      {children}
      {error && (
        <span className="text-xs font-medium text-[#9b4d38]" role="alert">
          {error}
        </span>
      )}
    </label>
  );
}
