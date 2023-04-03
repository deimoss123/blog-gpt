import { Timestamp } from 'firebase/firestore';

export default function displayTimestamp(timestamp: Timestamp): string {
  const date = timestamp.toDate();
  return date.toLocaleDateString('en-GB');
}
