import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"

// shadcn Button, re-skinned for Mathsya: pill, Manrope, cobalt glow. Use buttonVariants() for <a> tags in .astro files.
const variants = cva(
  "group/button relative inline-flex shrink-0 items-center justify-center gap-2.5 rounded-full border-[1.5px] border-transparent font-display font-semibold tracking-[-0.005em] whitespace-nowrap no-underline transition-[transform,box-shadow,background-color,color,border-color] duration-200 ease-out-expo outline-none select-none hover:-translate-y-px hover:no-underline active:translate-y-0 active:scale-[0.985] focus-visible:ring-3 focus-visible:ring-cobalt focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[1.1em] [&_svg]:transition-transform [&_svg]:duration-300 hover:[&_svg:last-child]:translate-x-0.5",
  {
    variants: {
      variant: {
        default:
          "bg-cobalt text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_10px_24px_-10px_rgba(24,90,219,0.65)] hover:bg-cobalt-ink hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_16px_32px_-12px_rgba(24,90,219,0.7)]",
        secondary:
          "border-line-strong bg-white text-ink shadow-[0_1px_2px_rgba(23,43,69,0.05),0_2px_10px_-4px_rgba(23,43,69,0.08)] hover:border-ink",
        outline: "border-line-strong bg-transparent text-ink hover:border-ink hover:bg-white",
        ghost: "px-1.5 text-ink hover:text-cobalt-ink",
        link: "h-auto px-0 text-cobalt-ink underline-offset-4 hover:translate-y-0 hover:underline",
        light: "bg-white text-cobalt-ink shadow-[0_14px_30px_-14px_rgba(10,30,80,0.55)] hover:bg-ice",
        outlineLight: "border-white/55 bg-transparent text-white hover:border-white hover:bg-white/10",
      },
      size: {
        default: "min-h-12 px-[22px] py-3 text-[0.98rem]",
        sm: "min-h-10 px-4 py-2 text-[0.9rem]",
        lg: "min-h-14 px-7 py-3.5 text-[1.05rem]",
        icon: "size-11",
        "icon-sm": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/** cva output merged with `cn` so variant classes (e.g. border colours) win over base classes in .astro usage too. */
const buttonVariants = ({ className, ...props }: VariantProps<typeof variants> & { className?: string } = {}) => cn(variants(props), className)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof variants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={buttonVariants({ variant, size, className })}
      {...props}
    />
  )
}

export { Button, buttonVariants }
