export interface MockUser {
  id: string;
  username: string;
  avatarUrl: string | null;
}

export interface MockCourse {
  id: string;
  name: string;
  description: string;
  userId: string;
  topics: string[];
}

export interface MockVideo {
  id: string;
  title: string;
  videoUrl: string;
  thumbnailUrl: string | null;
  userId: string;
  courseId: string;
  type: "SLICED_LECTURE" | "SLIDES_VOICEOVER" | "AI_TEACHER";
  duration: number;
}

export interface MockQuiz {
  id: string;
  videoId: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface MockComment {
  id: string;
  userId: string;
  videoId: string;
  text: string;
  likesCount: number;
}

export interface MockMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text: string | null;
  sharedVideoId: string | null;
  createdAt: string;
}

export const mockUsers: MockUser[] = [
  { id: "user-1", username: "alice", avatarUrl: null },
  { id: "user-2", username: "bob", avatarUrl: null },
  { id: "user-3", username: "charlie", avatarUrl: null },
];

export const mockCourses: MockCourse[] = [
  {
    id: "course-1",
    name: "Introduction to Computer Science",
    description: "Fundamental concepts of CS including algorithms, data structures, and computation theory.",
    userId: "user-1",
    topics: [
      "What is Computer Science?",
      "Binary and Data Representation",
      "Algorithms and Pseudocode",
      "Data Structures Overview",
      "Introduction to Complexity",
    ],
  },
  {
    id: "course-2",
    name: "Organic Chemistry Basics",
    description: "Core organic chemistry concepts for pre-med and chemistry majors.",
    userId: "user-2",
    topics: [
      "Carbon Bonding",
      "Functional Groups",
      "Isomerism",
      "Reaction Mechanisms",
    ],
  },
];

export const mockVideos: MockVideo[] = [
  {
    id: "video-1",
    title: "What is an Algorithm?",
    videoUrl: "/sample-videos/sample1.mp4",
    thumbnailUrl: null,
    userId: "user-1",
    courseId: "course-1",
    type: "SLICED_LECTURE",
    duration: 45,
  },
  {
    id: "video-2",
    title: "Binary Number System Explained",
    videoUrl: "/sample-videos/sample2.mp4",
    thumbnailUrl: null,
    userId: "user-1",
    courseId: "course-1",
    type: "SLIDES_VOICEOVER",
    duration: 38,
  },
  {
    id: "video-3",
    title: "Stacks and Queues",
    videoUrl: "/sample-videos/sample3.mp4",
    thumbnailUrl: null,
    userId: "user-1",
    courseId: "course-1",
    type: "AI_TEACHER",
    duration: 52,
  },
  {
    id: "video-4",
    title: "Big O Notation",
    videoUrl: "/sample-videos/sample4.mp4",
    thumbnailUrl: null,
    userId: "user-1",
    courseId: "course-1",
    type: "SLICED_LECTURE",
    duration: 29,
  },
  {
    id: "video-5",
    title: "Carbon Bonding Basics",
    videoUrl: "/sample-videos/sample5.mp4",
    thumbnailUrl: null,
    userId: "user-2",
    courseId: "course-2",
    type: "SLIDES_VOICEOVER",
    duration: 41,
  },
  {
    id: "video-6",
    title: "Functional Groups in Organic Chemistry",
    videoUrl: "/sample-videos/sample6.mp4",
    thumbnailUrl: null,
    userId: "user-2",
    courseId: "course-2",
    type: "SLICED_LECTURE",
    duration: 35,
  },
  {
    id: "video-7",
    title: "Understanding Isomers",
    videoUrl: "/sample-videos/sample7.mp4",
    thumbnailUrl: null,
    userId: "user-2",
    courseId: "course-2",
    type: "AI_TEACHER",
    duration: 48,
  },
  {
    id: "video-8",
    title: "Recursion Explained Simply",
    videoUrl: "/sample-videos/sample8.mp4",
    thumbnailUrl: null,
    userId: "user-3",
    courseId: "course-1",
    type: "SLIDES_VOICEOVER",
    duration: 55,
  },
];

export const mockQuizzes: MockQuiz[] = [
  {
    id: "quiz-1",
    videoId: "video-1",
    question: "What is the time complexity of binary search?",
    options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    correctAnswer: 1,
  },
  {
    id: "quiz-2",
    videoId: "video-2",
    question: "What is 1011 in decimal (binary to decimal)?",
    options: ["9", "10", "11", "13"],
    correctAnswer: 2,
  },
  {
    id: "quiz-3",
    videoId: "video-5",
    question: "How many bonds can carbon form?",
    options: ["2", "3", "4", "6"],
    correctAnswer: 2,
  },
  {
    id: "quiz-4",
    videoId: "video-4",
    question: "Which Big O is the most efficient?",
    options: ["O(n!)", "O(2ⁿ)", "O(n log n)", "O(log n)"],
    correctAnswer: 3,
  },
  {
    id: "quiz-5",
    videoId: "video-3",
    question: "Which data structure follows LIFO order?",
    options: ["Queue", "Stack", "Array", "Linked List"],
    correctAnswer: 1,
  },
];

export const mockComments: MockComment[] = [
  { id: "comment-1", userId: "user-2", videoId: "video-1", text: "Great explanation! Very clear.", likesCount: 12 },
  { id: "comment-2", userId: "user-3", videoId: "video-1", text: "Could you cover merge sort next?", likesCount: 8 },
  { id: "comment-3", userId: "user-1", videoId: "video-5", text: "Organic chem finally makes sense!", likesCount: 15 },
  { id: "comment-4", userId: "user-3", videoId: "video-2", text: "The visual examples really help.", likesCount: 5 },
  { id: "comment-5", userId: "user-2", videoId: "video-3", text: "Stacks are so useful in real apps.", likesCount: 3 },
];

export const mockMessages: MockMessage[] = [
  { id: "msg-1", senderId: "user-1", receiverId: "user-2", text: "Hey, check out this video!", sharedVideoId: null, createdAt: "2025-12-01T10:00:00Z" },
  { id: "msg-2", senderId: "user-2", receiverId: "user-1", text: null, sharedVideoId: "video-5", createdAt: "2025-12-01T10:05:00Z" },
  { id: "msg-3", senderId: "user-1", receiverId: "user-2", text: "Love it! Carbon bonding is cool.", sharedVideoId: null, createdAt: "2025-12-01T10:10:00Z" },
  { id: "msg-4", senderId: "user-3", receiverId: "user-1", text: "Can we study together?", sharedVideoId: null, createdAt: "2025-12-02T14:00:00Z" },
  { id: "msg-5", senderId: "user-1", receiverId: "user-3", text: "Sure! Let me share this reel.", sharedVideoId: "video-4", createdAt: "2025-12-02T14:05:00Z" },
];

export const mockFriendships = [
  { requesterId: "user-1", addresseeId: "user-2", status: "ACCEPTED" as const },
  { requesterId: "user-3", addresseeId: "user-1", status: "ACCEPTED" as const },
];

export type FeedItem =
  | { type: "video"; data: MockVideo & { user: MockUser; course: MockCourse; likesCount: number; commentsCount: number } }
  | { type: "quiz"; data: MockQuiz & { course: MockCourse } };

export function getMockFeed(): FeedItem[] {
  const items: FeedItem[] = [];

  for (const video of mockVideos) {
    const user = mockUsers.find((u) => u.id === video.userId)!;
    const course = mockCourses.find((c) => c.id === video.courseId)!;
    const commentsCount = mockComments.filter((c) => c.videoId === video.id).length;
    items.push({
      type: "video",
      data: { ...video, user, course, likesCount: Math.floor(Math.random() * 100), commentsCount },
    });

    const quiz = mockQuizzes.find((q) => q.videoId === video.id);
    if (quiz) {
      items.push({ type: "quiz", data: { ...quiz, course } });
    }
  }

  return items;
}

export function getMockUserById(id: string): MockUser | undefined {
  return mockUsers.find((u) => u.id === id);
}

export function getMockVideosByUser(userId: string): MockVideo[] {
  return mockVideos.filter((v) => v.userId === userId);
}

export function getMockCoursesByUser(userId: string): MockCourse[] {
  return mockCourses.filter((c) => c.userId === userId);
}

export function getMockCommentsByVideo(videoId: string): (MockComment & { user: MockUser })[] {
  return mockComments
    .filter((c) => c.videoId === videoId)
    .map((c) => ({ ...c, user: mockUsers.find((u) => u.id === c.userId)! }))
    .sort((a, b) => b.likesCount - a.likesCount);
}

export function getMockFriends(userId: string): MockUser[] {
  const friendIds: string[] = [];
  for (const f of mockFriendships) {
    if (f.status !== "ACCEPTED") continue;
    if (f.requesterId === userId) friendIds.push(f.addresseeId);
    if (f.addresseeId === userId) friendIds.push(f.requesterId);
  }
  return mockUsers.filter((u) => friendIds.includes(u.id));
}

export function getMockConversations(userId: string) {
  const friends = getMockFriends(userId);
  return friends.map((friend) => {
    const messages = mockMessages
      .filter(
        (m) =>
          (m.senderId === userId && m.receiverId === friend.id) ||
          (m.senderId === friend.id && m.receiverId === userId)
      )
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return {
      friend,
      lastMessage: messages[0] || null,
      messages,
    };
  }).sort((a, b) => {
    if (!a.lastMessage) return 1;
    if (!b.lastMessage) return -1;
    return new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime();
  });
}
