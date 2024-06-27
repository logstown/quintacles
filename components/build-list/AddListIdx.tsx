export function AddListIdx({
  idx,
  children,
  disabled,
}: {
  idx: number
  children: React.ReactNode
  disabled?: boolean
}) {
  return (
    <div className='relative'>
      {idx >= 0 && !disabled && (
        <div
          className={`absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground-100 py-1 text-4xl font-bold text-primary-300 md:text-6xl ${idx === 0 ? 'px-5' : 'px-4'}`}
        >
          {idx + 1}
        </div>
      )}
      {children}
    </div>
  )
}
