import { useQuery } from '@tanstack/react-query';
import { fetchListings } from '@/lib/listings';
import { sampleListingSummary } from '@/lib/sampleData';
import type { ListingSummary } from '@/types/listing';

const FALLBACK_DATA: ListingSummary[] = [sampleListingSummary];

export const useListings = () =>
  useQuery<ListingSummary[]>(
    {
      queryKey: ['listings'],
      queryFn: async () => {
        try {
          const listings = await fetchListings();
          if (!listings.length) {
            return FALLBACK_DATA;
          }
          return listings;
        } catch {
          return FALLBACK_DATA;
        }
      },
    }
  );

