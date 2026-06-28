import { useEffect, useState } from "react";

// true только после монтирования на клиенте. Нужен, чтобы значения из persist-стора
// (бейдж, сумма, состояние кнопок) не вызывали hydration mismatch: на сервере и в
// первом клиентском рендере отдаём дефолт, затем — реальные данные из localStorage.
export function useHydrated(): boolean {
	const [hydrated, setHydrated] = useState(false);
	useEffect(() => setHydrated(true), []);
	return hydrated;
}
