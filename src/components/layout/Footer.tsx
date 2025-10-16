export default function Footer() {
  return (
    <footer className="mt-10 border-t border-zinc-200 bg-white/70 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-zinc-600 flex flex-wrap items-center justify-between gap-2">
        <div>© {new Date().getFullYear()} FinAI — All rights reserved.</div>
        <div className="flex gap-4">
          <a className="hover:underline" href="https://yourcompany.example.com">About</a>
          <a className="hover:underline" href="https://yourcompany.example.com/privacy">Privacy</a>
          <a className="hover:underline" href="https://yourcompany.example.com/terms">Terms</a>
        </div>
      </div>
    </footer>
  )
}
