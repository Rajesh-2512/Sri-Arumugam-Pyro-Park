import { getFeedbacks } from '@/services/feedback.actions';
import FeedbackManager from './FeedbackManager';

export const dynamic = 'force-dynamic';

export default async function AdminFeedbacksPage() {
  const { data: feedbacks } = await getFeedbacks();

  return <FeedbackManager initialFeedbacks={feedbacks || []} />;
}
