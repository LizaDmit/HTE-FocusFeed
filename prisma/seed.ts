import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.message.deleteMany();
  await prisma.friendship.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.reaction.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.video.deleteMany();
  await prisma.userCourse.deleteMany();
  await prisma.courseTopic.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  const { hash } = await import("bcryptjs");
  const passwordHash = await hash("password123", 10);

  const alice = await prisma.user.create({
    data: { id: "user-1", username: "alice", passwordHash },
  });
  const bob = await prisma.user.create({
    data: { id: "user-2", username: "bob", passwordHash },
  });
  const charlie = await prisma.user.create({
    data: { id: "user-3", username: "charlie", passwordHash },
  });

  const cs = await prisma.course.create({
    data: {
      id: "course-1",
      name: "Introduction to Computer Science",
      description: "Fundamental concepts of CS including algorithms, data structures, and computation theory.",
      userId: alice.id,
      topics: {
        create: [
          { name: "What is Computer Science?", order: 0 },
          { name: "Binary and Data Representation", order: 1 },
          { name: "Algorithms and Pseudocode", order: 2 },
          { name: "Data Structures Overview", order: 3 },
          { name: "Introduction to Complexity", order: 4 },
        ],
      },
    },
  });

  const chem = await prisma.course.create({
    data: {
      id: "course-2",
      name: "Organic Chemistry Basics",
      description: "Core organic chemistry concepts for pre-med and chemistry majors.",
      userId: bob.id,
      topics: {
        create: [
          { name: "Carbon Bonding", order: 0 },
          { name: "Functional Groups", order: 1 },
          { name: "Isomerism", order: 2 },
          { name: "Reaction Mechanisms", order: 3 },
        ],
      },
    },
  });

  await prisma.userCourse.createMany({
    data: [
      { userId: alice.id, courseId: cs.id },
      { userId: alice.id, courseId: chem.id },
      { userId: bob.id, courseId: chem.id },
      { userId: charlie.id, courseId: cs.id },
    ],
  });

  const videos = await Promise.all([
    prisma.video.create({ data: { id: "video-1", title: "What is an Algorithm?", videoUrl: "/sample-videos/sample1.mp4", userId: alice.id, courseId: cs.id, type: "SLICED_LECTURE", duration: 45 } }),
    prisma.video.create({ data: { id: "video-2", title: "Binary Number System Explained", videoUrl: "/sample-videos/sample2.mp4", userId: alice.id, courseId: cs.id, type: "SLIDES_VOICEOVER", duration: 38 } }),
    prisma.video.create({ data: { id: "video-3", title: "Stacks and Queues", videoUrl: "/sample-videos/sample3.mp4", userId: alice.id, courseId: cs.id, type: "AI_TEACHER", duration: 52 } }),
    prisma.video.create({ data: { id: "video-4", title: "Big O Notation", videoUrl: "/sample-videos/sample4.mp4", userId: alice.id, courseId: cs.id, type: "SLICED_LECTURE", duration: 29 } }),
    prisma.video.create({ data: { id: "video-5", title: "Carbon Bonding Basics", videoUrl: "/sample-videos/sample5.mp4", userId: bob.id, courseId: chem.id, type: "SLIDES_VOICEOVER", duration: 41 } }),
    prisma.video.create({ data: { id: "video-6", title: "Functional Groups in Organic Chemistry", videoUrl: "/sample-videos/sample6.mp4", userId: bob.id, courseId: chem.id, type: "SLICED_LECTURE", duration: 35 } }),
    prisma.video.create({ data: { id: "video-7", title: "Understanding Isomers", videoUrl: "/sample-videos/sample7.mp4", userId: bob.id, courseId: chem.id, type: "AI_TEACHER", duration: 48 } }),
    prisma.video.create({ data: { id: "video-8", title: "Recursion Explained Simply", videoUrl: "/sample-videos/sample8.mp4", userId: charlie.id, courseId: cs.id, type: "SLIDES_VOICEOVER", duration: 55 } }),
  ]);

  await prisma.quiz.createMany({
    data: [
      { id: "quiz-1", videoId: "video-1", question: "What is the time complexity of binary search?", options: ["O(n)", "O(log n)", "O(n²)", "O(1)"], correctAnswer: 1 },
      { id: "quiz-2", videoId: "video-2", question: "What is 1011 in decimal (binary to decimal)?", options: ["9", "10", "11", "13"], correctAnswer: 2 },
      { id: "quiz-3", videoId: "video-5", question: "How many bonds can carbon form?", options: ["2", "3", "4", "6"], correctAnswer: 2 },
      { id: "quiz-4", videoId: "video-4", question: "Which Big O is the most efficient?", options: ["O(n!)", "O(2ⁿ)", "O(n log n)", "O(log n)"], correctAnswer: 3 },
      { id: "quiz-5", videoId: "video-3", question: "Which data structure follows LIFO order?", options: ["Queue", "Stack", "Array", "Linked List"], correctAnswer: 1 },
    ],
  });

  await prisma.comment.createMany({
    data: [
      { userId: bob.id, videoId: "video-1", text: "Great explanation! Very clear.", likesCount: 12 },
      { userId: charlie.id, videoId: "video-1", text: "Could you cover merge sort next?", likesCount: 8 },
      { userId: alice.id, videoId: "video-5", text: "Organic chem finally makes sense!", likesCount: 15 },
      { userId: charlie.id, videoId: "video-2", text: "The visual examples really help.", likesCount: 5 },
    ],
  });

  await prisma.friendship.createMany({
    data: [
      { requesterId: alice.id, addresseeId: bob.id, status: "ACCEPTED" },
      { requesterId: charlie.id, addresseeId: alice.id, status: "ACCEPTED" },
    ],
  });

  await prisma.message.createMany({
    data: [
      { senderId: alice.id, receiverId: bob.id, text: "Hey, check out this video!" },
      { senderId: bob.id, receiverId: alice.id, sharedVideoId: "video-5" },
      { senderId: alice.id, receiverId: bob.id, text: "Love it! Carbon bonding is cool." },
      { senderId: charlie.id, receiverId: alice.id, text: "Can we study together?" },
      { senderId: alice.id, receiverId: charlie.id, text: "Sure! Let me share this reel.", sharedVideoId: "video-4" },
    ],
  });

  console.log("Seed completed successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
