import { NextResponse } from "next/server";

// Fast Refresh 시 상태 유지를 위해 globalThis 사용
if (!globalThis.posts) {
  globalThis.posts = [];
}

export async function GET() {
  // 모든 글 목록 조회
  return NextResponse.json(globalThis.posts);
}

export async function POST(req) {
  try {
    const { title, author, content, location } = await req.json();

    // 필수 필드 검증
    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 } // Bad Request
      );
    }

    // 랜덤 닉네임 생성 로직
    function getRandomNickname() {
      const adjectives = [
        "Happy", "Crazy", "Silent", "Brave", "Funny", "Mysterious",
      ];
      const animals = ["Panda", "Tiger", "Fox", "Rabbit", "Penguin"];
      const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
      const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
      return `${randomAdj} ${randomAnimal}`;
    }

    const nickname = author && author.trim() !== '' ? author : getRandomNickname();

    const newPost = {
      id: (globalThis.posts.length + 1).toString(),
      title,
      author: nickname,
      content,
      location: location || '위치 정보 없음',
      createdAt: new Date().toISOString(), // ISO 문자열로 저장
      comments: [], // 댓글 배열 추가
    };

    globalThis.posts.push(newPost);

     const postForClient = {
      ...newPost,
      createdAt: newPost.createdAt // 이미 ISO 문자열
    };

    return NextResponse.json(postForClient, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post", details: error.message },
      { status: 500 }
    );
  }
}
