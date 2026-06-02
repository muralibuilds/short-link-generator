import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-2xl font-semibold">404</h1>
      <p className="text-zinc-600 dark:text-zinc-400">Page not found</p>
      <Link
        href="/"
        className="text-blue-600 hover:underline dark:text-blue-400"
      >
        Go home
      </Link>
    </div>
  );
}
