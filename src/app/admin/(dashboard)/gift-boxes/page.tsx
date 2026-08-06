import { getGiftBoxes } from '@/services/giftbox.actions';
import GiftBoxManager from './GiftBoxManager';

export const metadata = {
  title: 'Gift Box Management | Admin Portal',
};

export default async function GiftBoxesPage() {
  const { data } = await getGiftBoxes();
  return <GiftBoxManager initialGiftBoxes={data || []} />;
}
