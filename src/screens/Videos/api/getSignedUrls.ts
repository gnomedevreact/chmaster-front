import { supabase } from '@/src/core/lib/supabase';
import { toast } from '@/src/shared/lib/utils/toast';

export async function getSignedUrls() {
  const { data, error } = await supabase.storage
    .from('videos')
    .createSignedUrls(
      [
        'openings/scotch.mp4',
        'openings/french.mp4',
        'openings/italian.mp4',
        'openings/scandinavian.mp4',
      ],
      3600,
    );

  if (error) {
    toast({
      message: 'Something went wrong, reload the app',
      type: 'danger',
    });
    return null;
  }

  return data;
}
