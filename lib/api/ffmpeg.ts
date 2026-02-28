export interface StitchOptions {
  inputFiles: string[];
  outputPath: string;
  subtitlesPath?: string;
  aspectRatio?: "9:16" | "16:9";
  blurBackground?: boolean;
}

export interface ProcessedVideoResult {
  outputPath: string;
  duration: number;
  width: number;
  height: number;
}

/**
 * Stitch multiple video/audio files together with optional subtitles and formatting.
 * Uses ffmpeg CLI under the hood. Requires ffmpeg installed on the system.
 */
export async function stitchVideo(
  _options: StitchOptions
): Promise<ProcessedVideoResult> {
  if (process.env.USE_MOCK_DATA === "true") {
    return {
      outputPath: _options.outputPath,
      duration: 45,
      width: 1080,
      height: 1920,
    };
  }

  // Real implementation would exec ffmpeg:
  // ffmpeg -i input1.mp4 -i input2.mp4 -filter_complex "[0:v][1:v]concat=n=2" output.mp4
  throw new Error("ffmpeg processing not implemented - requires ffmpeg binary");
}

/**
 * Overlay subtitles (SRT/ASS) on a video while maintaining 9:16 aspect ratio
 * with blurred top/bottom background.
 */
export async function overlaySubtitles(
  videoPath: string,
  subtitlesPath: string,
  outputPath: string
): Promise<ProcessedVideoResult> {
  if (process.env.USE_MOCK_DATA === "true") {
    return { outputPath, duration: 45, width: 1080, height: 1920 };
  }

  // Real implementation:
  // ffmpeg -i video.mp4 -vf "subtitles=subs.srt" -c:a copy output.mp4
  void videoPath;
  void subtitlesPath;
  throw new Error("ffmpeg subtitle overlay not implemented");
}

/**
 * Convert a video to 9:16 format with blurred background fill.
 */
export async function formatToVertical(
  inputPath: string,
  outputPath: string
): Promise<ProcessedVideoResult> {
  if (process.env.USE_MOCK_DATA === "true") {
    return { outputPath, duration: 45, width: 1080, height: 1920 };
  }

  // Real implementation:
  // ffmpeg -i input.mp4 -vf "split[original][blur];[blur]scale=1080:1920,boxblur=20[bg];
  // [bg][original]overlay=(W-w)/2:(H-h)/2" output.mp4
  void inputPath;
  throw new Error("ffmpeg vertical formatting not implemented");
}

/**
 * Slice a video at given timestamps.
 */
export async function sliceVideo(
  inputPath: string,
  segments: { start: number; end: number }[]
): Promise<string[]> {
  if (process.env.USE_MOCK_DATA === "true") {
    return segments.map((_, i) => `${inputPath.replace(".mp4", "")}_slice_${i}.mp4`);
  }

  // Real implementation:
  // ffmpeg -i input.mp4 -ss START -to END -c copy output_N.mp4
  void inputPath;
  throw new Error("ffmpeg slicing not implemented");
}
