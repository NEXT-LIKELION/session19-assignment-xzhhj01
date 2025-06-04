import { NextResponse } from "next/server";

// Fast Refresh 시 상태 유지를 위해 globalThis 사용
if (!globalThis.posts) {
  globalThis.posts = [];
}

// 특정 게시글의 댓글 가져오기
export async function GET(req, { params }) {
  const { id } = params;

  const post = globalThis.posts.find((p) => p.id === id);

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json(post.comments);
}

// 특정 게시글에 댓글 추가
export async function POST(req, { params }) {
  const { id } = params;
  const { text, author } = await req.json();

  if (!text) {
    return NextResponse.json({ error: "Comment text is required" }, { status: 400 });
  }

  const post = globalThis.posts.find((p) => p.id === id);

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  // 간단한 댓글 ID 생성 (실제 환경에서는 더 견고한 방법 사용)
  const newCommentId = Date.now().toString();

  const newComment = {
    id: newCommentId,
    text,
    author: author || "Anonymous", // 작성자 없으면 익명
    createdAt: new Date().toISOString(),
  };

  post.comments.push(newComment);

  return NextResponse.json(newComment, { status: 201 });
}

// 댓글 수정
export async function PUT(req, { params }) {
  const { id } = params;
  const { commentId, text } = await req.json();

  if (!text) {
    return NextResponse.json({ error: "Comment text is required" }, { status: 400 });
  }

  const post = globalThis.posts.find((p) => p.id === id);
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const comment = post.comments.find((c) => c.id === commentId);
  if (!comment) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  }

  comment.text = text;
  comment.updatedAt = new Date().toISOString();

  return NextResponse.json(comment);
}

// 댓글 삭제
export async function DELETE(req, { params }) {
  const { id } = params;
  const { searchParams } = new URL(req.url);
  const commentId = searchParams.get('commentId');

  if (!commentId) {
    return NextResponse.json({ error: "Comment ID is required" }, { status: 400 });
  }

  const post = globalThis.posts.find((p) => p.id === id);
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const commentIndex = post.comments.findIndex((c) => c.id === commentId);
  if (commentIndex === -1) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  }

  post.comments.splice(commentIndex, 1);

  return NextResponse.json({ message: "Comment deleted successfully" });
} 