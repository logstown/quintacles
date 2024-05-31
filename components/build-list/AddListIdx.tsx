export function AddListIdx({
  idx,
  children
}: {
  idx: number
  children: React.ReactNode
}) {
  return (
    <div className='relative'>
      {idx >= 0 && (
        <div className='absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-200 px-4 py-1 text-6xl font-bold text-secondary-500'>
          {idx + 1}
        </div>
      )}
      {children}
    </div>
  )
}
