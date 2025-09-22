import { useQuery } from '@tanstack/react-query';
import { fetchListingById, fetchListingByAutovitId } from '@/lib/listings';
import { sampleListingPayload } from '@/lib/sampleData';
import type { ListingPayload } from '@/types/listing';

interface UseListingParams {
  id?: string;
  autovitId?: string;
}

export const useListing = ({ id, autovitId }: UseListingParams) =>
  useQuery<ListingPayload | null>(
    {
      queryKey: ['listing', id, autovitId],
      enabled: Boolean(id || autovitId),
      queryFn: async () => {
        try {
          if (id) {
            const listing = await fetchListingById(id);
            if (listing) return listing;
          }
          if (autovitId) {
            const listing = await fetchListingByAutovitId(autovitId);
            if (listing) return listing;
          }
        } catch (error) {
          console.error('Listing fetch failed, falling back to sample', error);
        }
        return sampleListingPayload;
      },
    }
  );

