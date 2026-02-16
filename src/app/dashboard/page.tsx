import { getSession } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import DashboardClient from '@/components/DashboardClient';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
    const session = await getSession();
    const sessionUser = session as any;

    if (!sessionUser) {
        redirect('/login');
    }

    // Fetch user profile from Supabase (assuming profiles table linked to auth.users)
    // If you haven't created the profiles table yet, this might need fallback to session data
    const { data: userAdData, error: adsError } = await supabase
        .from('ads')
        .select('*')
        .eq('user_id', sessionUser.userId)
        .order('created_at', { ascending: false });

    // For the user info, we can use the data from the session for now 
    // or fetch from profiles table if it exists.
    const user = {
        id: sessionUser.userId,
        name: sessionUser.name,
        email: sessionUser.email,
        // Add more default fields if needed
    };

    return <DashboardClient user={user} userAds={userAdData || []} />;
}
