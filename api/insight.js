import { GoogleGenAI } from '@google/genai';

/**
 * Lazy initialization for Google GenAI client.
 * Accesses GEMINI_API_KEY only on server side.
 */
let genAIClient = null;

function getGenAI() {
  if (!genAIClient && process.env.GEMINI_API_KEY) {
    genAIClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIClient;
}

function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[REDACTED_EMAIL]')
    .replace(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g, '[REDACTED_PHONE]')
    .slice(0, 1000);
}

/**
 * Handles Chibi Stock Advisor queries powered by Gemini 3.7 Flash.
 * Translates financial concepts into 10-year-old friendly analogies.
 */
export async function handleInsightRequest(req, res) {
  try {
    const symbol = sanitizeInput(req.body?.symbol || 'ALL').toUpperCase();
    const question = sanitizeInput(req.body?.question || req.body?.notes || '');
    const topic = sanitizeInput(req.body?.topic || 'GENERAL');

    const ai = getGenAI();

    // Deterministic kid-friendly fallback if GEMINI_API_KEY is not set
    if (!ai) {
      return res.json({
        answer: symbol === 'ALL'
          ? 'The Chibi Market is buzzing with happy energy! When big tech and toy makers build popular things, prices charge UP like Bramble the Bull! 🐂'
          : `For ${symbol}: This company is loved by millions of kids and families! Smart investors check if the current price tag is below Ollie Owl's estimated True Value so you get a discount! 🏷️`,
        analogy: 'Think of buying a stock like buying 1 slice of a 10-slice giant pepperoni pizza 🍕. When the pizzeria sells more pizzas and gets famous, your 1 slice becomes more valuable!',
        bargainVerdict: 'BARGAIN',
        pennyRule: 'Never put all your ChibiCoins into just one stock! Always own a mix of gaming, smartphones, sports, and snacks! 🧺',
        funFact: 'Did you know the oldest stock exchange in the world was started over 400 years ago under a buttonwood tree in New York?',
        generatedAt: new Date().toISOString(),
        isAiGenerated: false,
      });
    }

    const systemInstruction = `You are "Penny Panda" 🐼 and "Professor Ollie Owl" 🦉, friendly Chibi Mascots and Chief Junior Financial Advisors at the Chibi Stock Exchange.
Your mission is to teach a 10-year-old child how stocks, investing, price vs. true fair value, and companies work in simple, cheerful, and engaging words.

RULES FOR SPEAKING TO A 10-YEAR-OLD:
1. Use fun, relatable real-world analogies (e.g. Lemonade stands 🍋, Pizza slices 🍕, Toy stores 🧸, Video game levels 🎮, Piggy banks 🐷, Candy shops 🍬).
2. Avoid boring financial jargon. If you use a term like "P/E ratio", explain it as "how many cookie jars of profit it takes to pay for the company". If you use "Dividend", explain it as "free pocket money bonus sent to you just for holding the share!".
3. Keep sentences energetic, warm, and positive. Use emojis appropriately.
4. Always give a "Penny's Golden Rule" reminding them about patience, diversification, or buying at a discount.
5. Provide output strictly in valid JSON matching this schema:
{
  "answer": "Clear, cheerful 2-3 sentence answer explaining the company or question for a 10-year-old.",
  "analogy": "A brilliant real-life analogy (lemonade stand, toy store, pizza slice).",
  "bargainVerdict": "BARGAIN" or "FAIR" or "EXPENSIVE" or "INFO",
  "pennyRule": "One memorable rule for young investors.",
  "funFact": "One awesome, true kid-friendly trivia fact about this stock or topic."
}`;

    const promptText = `A 10-year-old junior investor is asking: "${question || `Tell me about stock ${symbol}`}". Stock ticker: ${symbol}. Topic: ${topic}.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: promptText,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.4,
      },
    });

    const text = response.text?.trim() || '{}';
    const parsed = JSON.parse(text);

    return res.json({
      ...parsed,
      generatedAt: new Date().toISOString(),
      isAiGenerated: true,
    });
  } catch (error) {
    console.error('Error in /api/insight handler:', error);
    return res.json({
      answer: 'Penny Panda is here to help! Stocks are slices of real companies. When you buy a share, you become a mini-partner in their success!',
      analogy: 'Imagine owning a lemonade stand with your best friend. Every time someone buys a refreshing cup, you earn a nickel of profit! 🍋',
      bargainVerdict: 'FAIR',
      pennyRule: 'Buy great companies when they are on sale at a discount, and hold them patiently as they grow! 🐼',
      funFact: 'Some companies have been paying dividend pocket money continuously for over 100 years without ever missing a single payment!',
      generatedAt: new Date().toISOString(),
      isAiGenerated: false,
    });
  }
}

/**
 * Server-side transaction validation.
 */
export function validateTransaction(data) {
  const errors = [];
  const symbol = (data?.symbol || '').trim().toUpperCase();
  const type = (data?.type || '').toUpperCase();
  const quantity = Number(data?.quantity);
  const price = Number(data?.price);

  if (!symbol || !/^[A-Z0-9.]{1,10}$/.test(symbol)) {
    errors.push('A valid stock symbol is required');
  }

  if (type !== 'BUY' && type !== 'SELL') {
    errors.push('Transaction type must be BUY or SELL');
  }

  if (isNaN(quantity) || quantity <= 0 || !Number.isInteger(quantity)) {
    errors.push('Quantity must be a positive whole number of shares');
  }

  if (isNaN(price) || price <= 0 || !Number.isFinite(price)) {
    errors.push('Price must be a valid positive number');
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized: {
      symbol,
      type,
      quantity,
      price: +price.toFixed(2),
      totalValue: +(quantity * price).toFixed(2),
      date: new Date().toISOString().split('T')[0],
      status: 'CONFIRMED',
      id: 'TX-PIGGY-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
    },
  };
}
