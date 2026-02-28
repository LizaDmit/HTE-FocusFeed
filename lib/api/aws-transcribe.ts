export interface TranscriptSegment {
  text: string;
  startTime: number;
  endTime: number;
}

export interface TranscriptionResult {
  jobId: string;
  status: "COMPLETED" | "IN_PROGRESS" | "FAILED";
  segments: TranscriptSegment[];
  fullText: string;
}

export async function startTranscriptionJob(
  s3Key: string,
  languageCode: string = "en-US"
): Promise<string> {
  if (process.env.USE_MOCK_DATA === "true") {
    return `transcribe-job-mock-${Date.now()}`;
  }

  try {
    const mod = await import("@aws-sdk/client-transcribe");

    const client = new mod.TranscribeClient({
      region: process.env.AWS_REGION || "us-east-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });

    const jobName = `focusfeed-${Date.now()}`;
    await client.send(
      new mod.StartTranscriptionJobCommand({
        TranscriptionJobName: jobName,
        LanguageCode: languageCode as "en-US",
        Media: { MediaFileUri: `s3://${process.env.AWS_S3_BUCKET}/${s3Key}` },
        OutputBucketName: process.env.AWS_S3_BUCKET,
      })
    );
    return jobName;
  } catch {
    throw new Error("AWS SDK not installed. Run: npm install @aws-sdk/client-transcribe");
  }
}

export async function getTranscriptionResult(
  jobName: string
): Promise<TranscriptionResult> {
  if (process.env.USE_MOCK_DATA === "true") {
    return {
      jobId: jobName,
      status: "COMPLETED",
      segments: [
        { text: "Welcome to this lecture on algorithms.", startTime: 0, endTime: 3.5 },
        { text: "Today we will cover sorting and searching.", startTime: 3.5, endTime: 7 },
        { text: "Let's begin with bubble sort.", startTime: 7, endTime: 10 },
      ],
      fullText:
        "Welcome to this lecture on algorithms. Today we will cover sorting and searching. Let's begin with bubble sort.",
    };
  }

  return { jobId: jobName, status: "IN_PROGRESS", segments: [], fullText: "" };
}
