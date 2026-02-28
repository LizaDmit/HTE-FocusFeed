interface MockAuthUser {
  id: string;
  username: string;
  password: string;
}

const seedUsers: MockAuthUser[] = [
  { id: "user-1", username: "alice", password: "password123" },
  { id: "user-2", username: "bob", password: "password123" },
  { id: "user-3", username: "charlie", password: "password123" },
];

const globalStore = globalThis as unknown as { __mockAuthUsers?: MockAuthUser[] };
if (!globalStore.__mockAuthUsers) {
  globalStore.__mockAuthUsers = [...seedUsers];
}

export function getMockUsers(): MockAuthUser[] {
  return globalStore.__mockAuthUsers!;
}

export function findMockUser(username: string, password: string): MockAuthUser | undefined {
  return globalStore.__mockAuthUsers!.find(
    (u) => u.username === username && u.password === password
  );
}

export function registerMockUser(username: string, password: string): MockAuthUser | null {
  const existing = globalStore.__mockAuthUsers!.find((u) => u.username === username);
  if (existing) return null;

  const user: MockAuthUser = {
    id: `user-${Date.now()}`,
    username,
    password,
  };
  globalStore.__mockAuthUsers!.push(user);
  return user;
}
