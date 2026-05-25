/** Whether a nav item matches the current route (client-side). */
export function isActiveNavPath(
  pathname: string,
  href: string,
  searchParams?: URLSearchParams | null,
): boolean {
  const [base, query] = href.split("?");
  const streakLink = query?.includes("streak=1");

  if (streakLink) {
    return pathname === "/" && searchParams?.get("streak") === "1";
  }

  if (base === "/") {
    return pathname === "/" && searchParams?.get("streak") !== "1";
  }

  return pathname === base || pathname.startsWith(`${base}/`);
}
