import { SOURCES, CATEGORIES, BIAS_LABELS } from "@/lib/sources-data";

export async function GET() {
  return Response.json({
    sources: SOURCES,
    categories: CATEGORIES,
    biasLabels: BIAS_LABELS,
  });
}
