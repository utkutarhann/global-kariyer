export default async (req, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  try {
    const { cvText } = await req.json();

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: `Aşağıdaki CV'yi analiz et ve JSON formatında şu bilgileri ver:
{
  "score": 0-100 arası skor,
  "strengths": ["güçlü yön 1", "güçlü yön 2", "güçlü yön 3"],
  "improvements": ["geliştirilecek alan 1", "geliştirilecek alan 2", "geliştirilecek alan 3"],
  "recommendations": ["önerilen pozisyon 1", "önerilen pozisyon 2", "önerilen pozisyon 3"]
}

CV:
${cvText}

Sadece JSON döndür, başka açıklama yapma.`
        }]
      })
    });

  if (!response.ok) {
  const errorText = await response.text();
  throw new Error(`Claude API error: ${response.status} - ${errorText}`);
}

const data = await response.json();

if (!data.content || !data.content[0] || !data.content[0].text) {
  throw new Error('Invalid response from Claude API');
}

let jsonText = data.content[0].text;
jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
const result = JSON.parse(jsonText);

return new Response(JSON.stringify(result), { status: 200, headers });
} catch (error) {
  console.error('Full error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers });
  }
};
