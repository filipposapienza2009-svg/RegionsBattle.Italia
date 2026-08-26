import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const regionId = session.metadata?.regionId || session.client_reference_id;

    if (regionId) {
      console.log('Aggiorno regione:', regionId);

      const { data, error: selectError } = await supabase
        .from('regions')
        .select('points')
        .eq('id', regionId)
        .single();

      if (selectError) {
        console.error('Errore SELECT Supabase:', selectError.message);
      }

      if (data) {
        const { error: updateError } = await supabase
          .from('regions')
          .update({ points: (data.points || 0) + 1 })
          .eq('id', regionId);

        if (updateError) {
          console.error('Errore UPDATE Supabase:', updateError.message);
        } else {
          console.log('Punti aggiornati con successo!');
        }
      }
    } else {
      console.error('ERRORE: regionId è vuoto nei metadata della sessione Stripe!');
    }
  }

  return NextResponse.json({ received: true });
}
