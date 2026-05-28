import Link from "next/link";

const footerLinks = [
  { href: "#", label: "Privacy Policy" },
  { href: "/about", label: "Contact" },
  { href: "/about", label: "About" },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-luxe bg-[color:var(--luxe-nav-glass)] backdrop-blur-[20px]">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 text-center sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-10 sm:text-left lg:px-8">
        <div>
          <p className="font-display text-lg font-semibold text-luxe-strong">
            Word Unscramble Game
          </p>
          <p className="mt-1 text-sm text-luxe-secondary">
            © 2025 WordUnscrambleGame.com
          </p>
        </div>
        <nav aria-label="Footer">
          <ul className="grid grid-cols-3 gap-x-4 gap-y-2 text-sm font-medium text-luxe-secondary sm:flex sm:flex-wrap sm:gap-x-6">
            {footerLinks.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="transition-colors duration-luxe ease-luxe hover:text-luxe-accent-mid"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
