export interface TopicSegment {
  topic: string;
  concepts: string[];
  startTime: number;
  endTime: number;
  summary: string;
}

export async function segmentTranscriptIntoTopics(
  transcript: string,
  timestamps?: { text: string; startTime: number; endTime: number }[]
): Promise<TopicSegment[]> {
  if (process.env.USE_MOCK_DATA === "true") {
    return [
      {
        topic: "Introduction",
        concepts: ["Overview", "Learning objectives"],
        startTime: 0,
        endTime: 15,
        summary: "Introduction to the lecture topic and objectives.",
      },
      {
        topic: "Core Concept",
        concepts: ["Definition", "Key principles", "Examples"],
        startTime: 15,
        endTime: 45,
        summary: "Deep dive into the core concept with examples.",
      },
      {
        topic: "Summary",
        concepts: ["Key takeaways", "Review"],
        startTime: 45,
        endTime: 60,
        summary: "Review of key takeaways from the lecture.",
      },
    ];
  }

  const response = await fetch("https://api.featherless.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.FEATHERLESS_API_KEY}`,
    },
    body: JSON.stringify({
      model: "Qwen/Qwen2.5-72B-Instruct",
      messages: [
        {
          role: "system",
          content:
            "You are an educational content segmentation assistant. Break transcripts into topic segments. Return JSON.",
        },
        {
          role: "user",
          content: `Segment this transcript into topics with concepts, timestamps, and summaries. Return a JSON array.\n\nTranscript:\n${transcript}\n\n${timestamps ? `Timestamps: ${JSON.stringify(timestamps)}` : ""}`,
        },
      ],
      max_tokens: 2048,
    }),
  });

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || "[]";
  return JSON.parse(content);
}
