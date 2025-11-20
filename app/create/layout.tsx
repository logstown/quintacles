export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className='mx-auto h-full max-w-(--breakpoint-xl)'>{children}</div>
}
