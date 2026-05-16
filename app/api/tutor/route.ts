import { NextRequest } from "next/server";
import { z } from "zod";
import { claude, buildSystemPrompt, type PersonaKey, PERSONAS } from "@/lib/claude";

const Body = z.object({
  persona: z.enum(["dida", "ciro", "tony"]),
  gameId: z.string(),
  message: z.string().min(1).max(1000),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })
    )
    .max(20)
    .optional(),
  scoreSummary: z.string().optional(),
  recentMoves: z.array(z.string()).max(20).optional(),
});

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: "bad_input" }), { status: 400 });
  }
  const { persona, gameId, message, history, scoreSummary, recentMoves } = parsed.data;

  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(stringSse(fallbackText(persona)), {
      headers: sseHeaders(),
    });
  }

  const system = buildSystemPrompt(persona as PersonaKey, {
    gameId,
    scoreSummary,
    recentMoves,
  });

  const stream = await claude.messages.stream({
    model: PERSONAS[persona as PersonaKey].model,
    max_tokens: 240,
    system,
    messages: [
      ...(history ?? []).map((h) => ({ role: h.role, content: h.content })),
      { role: "user" as const, content: message },
    ],
  });

  const encoder = new TextEncoder();
  const body = new ReadableStream({
    async start(controller) {
      try {
        for await (const ev of stream) {
          if (
            ev.type === "content_block_delta" &&
            ev.delta.type === "text_delta"
          ) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ d: ev.delta.text })}\n\n`)
            );
          }
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      } catch (e: any) {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ d: fallbackText(persona as PersonaKey) })}\n\n`
          )
        );
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(body, { headers: sseHeaders() });
}

function sseHeaders() {
  return {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
  };
}

function stringSse(text: string) {
  const lines = [`data: ${JSON.stringify({ d: text })}\n\n`, "data: [DONE]\n\n"];
  return lines.join("");
}

function fallbackText(p: PersonaKey) {
  switch (p) {
    case "dida":
      return "Ajde, moj barba, vidin da nemamo vezu s kućom. Igraj kartu, pa ćemo se vratit na priču.";
    case "ciro":
      return "Trenutno nemam vezu s poslužiteljem. Pokušaj ponovno za koju sekundu.";
    case "tony":
      return "No internet for me right now, my friend. Try again in a second.";
  }
}
