export default function ChatSidebar() {
  return (
    <aside className="hidden w-72 border-r border-zinc-800 bg-zinc-900 p-6 lg:block">
      <h3 className="mb-4 text-lg font-semibold text-white">
        Chat Rules
      </h3>

      <ul className="space-y-3 text-sm text-zinc-400">
        <li>✓ Be respectful</li>
        <li>✓ No harassment</li>
        <li>✓ No spam</li>
        <li>✓ Report violations</li>
      </ul>

      <div className="mt-8 rounded-xl bg-zinc-800 p-4">
        <p className="text-sm text-zinc-300">
          Advertisement Area
        </p>
      </div>
    </aside>
  );
}