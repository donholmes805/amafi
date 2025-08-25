import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

// Vercel Edge Functions are required for this file-based routing in a Vite project
export const config = {
  runtime: 'edge',
};

// This function will be deployed as a serverless function on Vercel.
export default async function handler(request: Request) {
  try {
    const { rows: amas } = await sql`
        SELECT
            a.id, a.title, a.description, a.youtube_url, a.status, a.start_time, a.is_featured, a.time_limit_minutes, a.likes, a.dislikes, a.wallet_address, a.wallet_ticker, a.ama_type,
            -- Use json_build_object to structure the host data as a nested object
            json_build_object(
                'id', u.id,
                'name', u.name,
                'avatar_url', u.avatar_url,
                'role', u.role,
                'tier', u.tier,
                'bio', u.bio
            ) as host
        FROM amas a
        -- Join with the users table to get the host's details
        JOIN users u ON a.host_id = u.id
        ORDER BY 
            CASE a.status
                WHEN 'LIVE' THEN 1
                WHEN 'UPCOMING' THEN 2
                WHEN 'ENDED' THEN 3
            END,
            a.start_time DESC;
    `;

    // Simulate some viewership data for demonstration purposes
    const amasWithViewers = amas.map(ama => ({
      ...ama,
      viewers: Math.floor(Math.random() * 5000) + 50, // Random viewers until we track this
    }));

    return NextResponse.json(amasWithViewers, {
      headers: {
        'Access-Control-Allow-Origin': '*', // Adjust for production
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Database Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
