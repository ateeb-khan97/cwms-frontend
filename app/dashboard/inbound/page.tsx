'use client';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  router.push('/dashboard/inbound/receive_items');
  return <></>;
}
