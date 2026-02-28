export async function extractTopicsFromPdf(
  syllabusKey: string
): Promise<string[]> {
  if (process.env.USE_MOCK_DATA === "true") {
    return [
      "Introduction and Course Overview",
      "Fundamental Principles",
      "Core Theory and Models",
      "Applied Techniques",
      "Case Studies and Examples",
      "Assessment and Review",
    ];
  }

  try {
    const mod = await import("@aws-sdk/client-bedrock-runtime");

    const client = new mod.BedrockRuntimeClient({
      region: process.env.AWS_REGION || "us-east-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });

    const prompt = `Extract the main topics from the syllabus at key "${syllabusKey}" and return them as a JSON array of strings. Only return the JSON array, no other text.`;

    const response = await client.send(
      new mod.InvokeModelCommand({
        modelId: "anthropic.claude-3-haiku-20240307-v1:0",
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify({
          anthropic_version: "bedrock-2023-05-31",
          max_tokens: 1024,
          messages: [{ role: "user", content: prompt }],
        }),
      })
    );

    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    const text = responseBody.content?.[0]?.text || "[]";
    return JSON.parse(text);
  } catch {
    throw new Error("AWS SDK not installed. Run: npm install @aws-sdk/client-bedrock-runtime");
  }
}
