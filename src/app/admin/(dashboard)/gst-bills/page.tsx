import { getGstAuditBills } from '@/services/gst-bill.actions';
import GstBillsManager from './GstBillsManager';

export const metadata = {
  title: 'GST Audit Bills | Admin Portal',
};

export const revalidate = 0;

export default async function GstBillsPage() {
  const res = await getGstAuditBills();
  return <GstBillsManager initialBills={res.data || []} />;
}
