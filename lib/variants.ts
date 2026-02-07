export type VariantConfig<T extends Record<string, Record<string, string>>> = T

export function createVariants<T extends Record<string, Record<string, string>>>(
  base: string,
  variants: T,
  defaultVariants?: Partial<{ [K in keyof T]: keyof T[K] }>,
) {
  return (props?: Partial<{ [K in keyof T]: keyof T[K] }> & { className?: string }) => {
    const { className, ...variantProps } = props || {}

    let classes = base

    // Apply variants
    Object.entries(variants).forEach(([variantKey, variantOptions]) => {
      const selectedVariant =
        variantProps[variantKey as keyof typeof variantProps] ||
        defaultVariants?.[variantKey as keyof typeof defaultVariants]

      if (selectedVariant && variantOptions[selectedVariant as string]) {
        classes += ` ${variantOptions[selectedVariant as string]}`
      }
    })

    // Add custom className
    if (className) {
      classes += ` ${className}`
    }

    return classes
  }
}

export type VariantProps<T> = T extends (...args: any[]) => any ? Parameters<T>[0] : never
