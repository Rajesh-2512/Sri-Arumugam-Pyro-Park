import { redirect } from 'next/navigation';

export default async function WalkInProductsPage() {
  redirect('/admin/products');
}
