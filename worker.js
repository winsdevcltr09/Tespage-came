async function handleRequest(request) {
  if (request.method !== 'POST') {
    return new Response('Use POST', { status: 405 });
  }

  const url = new URL(request.url);
  const action = url.searchParams.get('action');

  const TELEGRAM_BOT_TOKEN = '***';
  const TELEGRAM_CHAT_ID = '7451969762';

  if (action === 'sendPhoto') {
    const formData = await request.formData();
    const chatId = formData.get('chat_id') || TELEGRAM_CHAT_ID;
    const photo = formData.get('photo');
    const caption = formData.get('caption') || '';

    const tgForm = new FormData();
    tgForm.append('chat_id', chatId);
    tgForm.append('photo', photo, 'camera-auto.png');
    if (caption) tgForm.append('caption', caption);

    const tgUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`;

    const response = await fetch(tgUrl, {
      method: 'POST',
      body: tgForm,
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (action === 'sendMessage') {
    const contentType = request.headers.get('content-type') || '';
    let chatId = TELEGRAM_CHAT_ID;
    let text = '';

    if (contentType.includes('application/json')) {
      const body = await request.json();
      chatId = body.chat_id || chatId;
      text = body.text || '';
    } else {
      const formData = await request.formData();
      chatId = formData.get('chat_id') || chatId;
      text = formData.get('text') || '';
    }

    const tgUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const response = await fetch(tgUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  return new Response('Unknown action', { status: 400 });
}

export default {
  async fetch(request, env, ctx) {
    return handleRequest(request);
  },
};
