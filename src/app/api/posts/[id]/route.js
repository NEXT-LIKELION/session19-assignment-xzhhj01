import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  // 특정 ID의 글 정보 조회
  const post = globalThis.posts.find((p) => p.id === params.id);

  if (!post) {
    return NextResponse.json(
      { error: "Post not found" },
      { status: 404 }
    );
  }

  // 반환 전에 createdAt을 ISO 문자열로 변환
  const postForClient = {
    ...post,
    createdAt: post.createdAt instanceof Date ? post.createdAt.toISOString() : post.createdAt
  };

  return NextResponse.json(postForClient);
}

export async function DELETE(req, { params }) {
  // 특정 ID의 글 삭제
  const initialLength = globalThis.posts.length;
  const index = globalThis.posts.findIndex(p => p.id === params.id);

  if (index === -1) {
    return NextResponse.json(
      { error: "Post not found" },
      { status: 404 }
    );
  }

  globalThis.posts.splice(index, 1);

  return NextResponse.json({ message: "Post deleted successfully" }, { status: 200 });
}

export async function PUT(req, { params }) {
  // 특정 ID의 글 수정
  const index = globalThis.posts.findIndex(p => p.id === params.id);

  if (index === -1) {
    return NextResponse.json(
      { error: "Post not found" },
      { status: 404 }
    );
  }

  try {
    const updatedData = await req.json();
    
    globalThis.posts[index] = {
      ...globalThis.posts[index],
      ...updatedData,
      id: globalThis.posts[index].id,
      createdAt: globalThis.posts[index].createdAt
    };

    // 반환 전에 createdAt을 ISO 문자열로 변환
     const updatedPostForClient = {
      ...globalThis.posts[index],
      createdAt: globalThis.posts[index].createdAt instanceof Date ? globalThis.posts[index].createdAt.toISOString() : globalThis.posts[index].createdAt
    };

    return NextResponse.json(updatedPostForClient, { status: 200 });

  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Failed to update post", details: error.message },
      { status: 500 }
    );
  }
}
