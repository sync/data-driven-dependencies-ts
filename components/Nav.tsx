import Link from 'next/link';

export default function Nav() {
  return (
    <header className="bg-white shadow">
      <nav className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
        <Link href="/">Home</Link> | <Link href="/about">About</Link>
      </nav>
    </header>
  );
}
