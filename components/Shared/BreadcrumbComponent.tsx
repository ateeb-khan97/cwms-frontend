'use client';
//
import React from 'react';
import { Breadcrumbs } from '@mantine/core';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
//
const convertBreadcrumb = (word: string) => {
  return word
    .replace(/-/g, ' ')
    .replace(/oe/g, 'ö')
    .replace(/ae/g, 'ä')
    .replace(/ue/g, 'ü')
    .replace('_', ' ')
    .replace('_', ' ')
    .replace('_', ' ')
    .replace('_', ' ');
};
//
export default function BreadcrumbComponent() {
  const router = usePathname();
  const [bread, setBread] = React.useState<any[]>([]);
  //
  React.useEffect(() => {
    const linkPath: string[] = router!.split('/');
    linkPath.shift();
    const pathArray = linkPath.map((path, key) => {
      return {
        title: path,
        href: '/' + linkPath.slice(0, key + 1).join('/'),
      };
    });
    setBread(pathArray);
  }, [router]);
  //
  return (
    <>
      <Breadcrumbs className="mb-5 flex select-none gap-3 text-[1.2rem] capitalize">
        {bread.map((link: any, key: number) => {
          if (link === bread[bread.length - 1]) {
            return (
              <span className="text-gray-500" key={key}>
                {convertBreadcrumb(link.title)}
              </span>
            );
          }
          return (
            <Link
              className="font-semibold text-[#3b3e66] hover:underline"
              key={key}
              href={link.href}
            >
              {convertBreadcrumb(link.title)}
            </Link>
          );
        })}
      </Breadcrumbs>
    </>
  );
}
