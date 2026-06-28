import { createClient } from "@supabase/supabase-js";

// Публичный (publishable) клиент Supabase для браузера. Ключ безопасен для
// фронтенда: доступ к таблице ограничен политиками RLS (заказы — только INSERT).
export const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
