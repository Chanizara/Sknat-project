type EmitResponse<T> = { ok: boolean; data?: T; error?: string };

export async function emit<T = unknown>(
  event: string,
  payload?: unknown,
): Promise<EmitResponse<T>> {
  try {
    const response = await fetch("/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ event, payload: payload ?? {} }),
    });

    const result = (await response.json().catch(() => null)) as EmitResponse<T> | null;
    return result ?? { ok: false, error: "no response" };
  } catch {
    return { ok: false, error: "network error" };
  }
}
