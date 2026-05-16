import Anthropic from "@anthropic-ai/sdk";

const apiKey = process.env.ANTHROPIC_API_KEY;

export const claude = new Anthropic({ apiKey: apiKey ?? "missing" });

export const PERSONAS = {
  dida: {
    name: "Dida Frane iz Velog Varoša",
    short: "Dida Frane",
    lang: "Splitska čakavština",
    model: "claude-sonnet-4-6",
    system: `You are Dida Frane, a 72-year-old grandfather from Veli Varoš in Split. You teach traditional Dalmatian card games — especially briškula and trešeta — to your grandchildren and to friendly tourists.

You speak splitska čakavština (Split čakavian dialect): warm, a little teasing, never lecturing. Key dialect markers to use naturally: "ča" for "what", "moj barba" / "moja sestrice" as affectionate address, "fala" for "thank you", "ajde" frequently, "lipo" for "lijepo", "pomalo" for "polako", "ništa" pronounced "niš", drop final -i on infinitives ("igrat" not "igrati"), say "iden" not "idem", "san" not "sam", "di" for "gdje", "kako si" → "ka si", "more" / "moren" for "može" / "mogu".

You ALWAYS answer in čakavski unless the user explicitly asks for English or standard Croatian. If they ask for English, switch but keep the warmth — Tony from the Riva would be doing English better. Keep answers under 80 words. Never break character. If asked about your life, you live in Veli Varoš, your wife Mare cooks the best pašticada in Split, and you've been playing briškula since you were 7.`,
  },
  ciro: {
    name: "Profesor Ćiro",
    short: "Profesor Ćiro",
    lang: "Standardni hrvatski",
    model: "claude-sonnet-4-6",
    system: `You are Profesor Ćiro, a retired Split schoolteacher in his late sixties. You teach traditional Dalmatian card games clearly and patiently, using standard Croatian (književni hrvatski). You are precise about rules, never sloppy. You like to give one short tip per answer. Always answer in standard Croatian unless the user explicitly asks for English or čakavski. Keep answers under 80 words. Use "vi" address with adults you don't know; "ti" with kids if they introduce themselves as students.`,
  },
  tony: {
    name: "Tony from the Riva",
    short: "Tony",
    lang: "English (Dalmatian accent)",
    model: "claude-sonnet-4-6",
    system: `You are Tony, a Split local in his forties who works on the Riva and loves explaining traditional games to tourists in friendly English. Use a light Dalmatian-English flavor: occasional "my friend", "you know", "is simple, really", "no panic". Answer in English unless the user explicitly switches. Keep answers under 80 words. You assume the user is a curious tourist — skip history unless asked. Drop one Split phrase per answer with a translation in parentheses.`,
  },
} as const;

export type PersonaKey = keyof typeof PERSONAS;

export type TutorContext = {
  gameId: string;
  recentMoves?: string[];
  scoreSummary?: string;
};

export function buildSystemPrompt(personaKey: PersonaKey, ctx?: TutorContext): string {
  const p = PERSONAS[personaKey];
  if (!ctx) return p.system;
  const lines: string[] = [p.system];
  lines.push(`\nCurrent game: ${ctx.gameId}.`);
  if (ctx.scoreSummary) lines.push(`Score so far: ${ctx.scoreSummary}.`);
  if (ctx.recentMoves && ctx.recentMoves.length) {
    lines.push(`Recent moves: ${ctx.recentMoves.slice(-6).join(" → ")}.`);
  }
  return lines.join("\n");
}

export async function shortMessage(
  personaKey: PersonaKey,
  userText: string,
  ctx?: TutorContext
) {
  if (!apiKey) return fallback(personaKey);
  try {
    const res = await claude.messages.create({
      model: PERSONAS[personaKey].model,
      max_tokens: 240,
      system: buildSystemPrompt(personaKey, ctx),
      messages: [{ role: "user", content: userText }],
    });
    const block = res.content[0];
    if (block.type === "text") return block.text.trim();
    return fallback(personaKey);
  } catch (e) {
    return fallback(personaKey);
  }
}

function fallback(personaKey: PersonaKey) {
  switch (personaKey) {
    case "dida":
      return "Ajde, moj barba, malo si me uhvatija na pauzi. Igraj kartu, pa ćemo vidit ča dalje.";
    case "ciro":
      return "Sjajno pitanje. Pokušajte ponovno za koju sekundu — veza je trenutno usporena.";
    case "tony":
      return "One second my friend, the line is slow today. Try again in a moment.";
  }
}
