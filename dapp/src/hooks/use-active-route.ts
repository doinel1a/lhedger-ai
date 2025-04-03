import { usePathname } from 'next/navigation';

export default function useActiveRoute(href: string) {
  const pathname = usePathname();
  return href === pathname;
}
