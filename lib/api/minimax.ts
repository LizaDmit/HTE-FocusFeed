export interface VoiceGenerationResult {
  audioUrl: string;
  duration: number;
}

export interface CharacterVideoResult {
  videoUrl: string;
  duration: number;
}

export async function generateVoice(
  text: string,
  voiceDescription?: string
): Promise<VoiceGenerationResult> {
  if (process.env.USE_MOCK_DATA === "true") {
    return {
      audioUrl: "/sample-videos/mock-audio.mp3",
      duration: Math.ceil(text.split(" ").length / 2.5),
    };
  }

  const response = await fetch("https://api.minimax.chat/v1/t2a_v2", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.MINIMAX_API_KEY}`,
    },
    body: JSON.stringify({
      model: "speech-01-turbo",
      text,
      voice_setting: { voice_id: voiceDescription || "default" },
    }),
  });

  const data = await response.json();
  return {
    audioUrl: data.audio_file || "",
    duration: data.duration || 0,
  };
}

export async function generateCharacterVideo(
  text: string,
  photoUrl?: string
): Promise<CharacterVideoResult> {
  if (process.env.USE_MOCK_DATA === "true") {
    return {
      videoUrl: "/sample-videos/mock-character.mp4",
      duration: 30,
    };
  }

  const response = await fetch("https://api.minimax.chat/v1/video_generation", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.MINIMAX_API_KEY}`,
    },
    body: JSON.stringify({
      model: "video-01",
      prompt: text,
      ...(photoUrl && { first_frame_image: photoUrl }),
    }),
  });

  const data = await response.json();
  return {
    videoUrl: data.file_id || "",
    duration: data.duration || 0,
  };
}
