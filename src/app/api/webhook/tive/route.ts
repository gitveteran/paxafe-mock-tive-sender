export async function OPTIONS() {
  // Allow simple testing with preflight if needed
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,X-API-Key',
    },
  });
}

export async function POST(request: Request) {
  try {
    const target = process.env.TIVE_WEBHOOK_URL ?? 'http://localhost:3000/api/webhook/tive';

    // Read the incoming body
    const textBody = await request.text();

    // Try to parse JSON and normalize EntryTimeEpoch (seconds -> milliseconds)
    let bodyToSend: string = textBody;
    try {
      const parsed = JSON.parse(textBody);
      if (parsed && typeof parsed.EntryTimeEpoch === 'number') {
        // If epoch looks like seconds (less than 1e12), convert to milliseconds
        if (parsed.EntryTimeEpoch > 0 && parsed.EntryTimeEpoch < 1e12) {
          parsed.EntryTimeEpoch = parsed.EntryTimeEpoch * 1000;
        }
        bodyToSend = JSON.stringify(parsed);
        // ensure content-type header is application/json
        if (!request.headers.get('content-type')) {
          // will add later to forwardHeaders
        }
      }
    } catch (e) {
      // not JSON — forward as-is
      bodyToSend = textBody;
    }

    const forwardHeaders = new Headers();
    const contentType = request.headers.get('content-type');
    if (contentType) forwardHeaders.set('content-type', contentType);
    const apiKey = request.headers.get('x-api-key');
    if (apiKey) forwardHeaders.set('x-api-key', apiKey);

    const res = await fetch(target, {
      method: 'POST',
      headers: forwardHeaders,
      body: bodyToSend,
    });

    const resText = await res.text();
    const respHeaders: Record<string, string> = {};
    const ct = res.headers.get('content-type');
    if (ct) respHeaders['content-type'] = ct;

    return new Response(resText, { status: res.status, headers: respHeaders });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 502,
      headers: { 'content-type': 'application/json' },
    });
  }
}
