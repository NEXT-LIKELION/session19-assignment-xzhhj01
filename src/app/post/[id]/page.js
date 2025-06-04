import Link from "next/link";
import dynamic from 'next/dynamic';

const DeleteButton = dynamic(() => import('./DeleteButton'), { ssr: false });
const EditButton = dynamic(() => import('./EditButton'), { ssr: false });
const CommentSection = dynamic(() => import('./CommentSection'), { ssr: false });

export default async function PostPage({ params }) {
  const res = await fetch(`http://localhost:3000/api/posts/${params.id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-2xl text-gray-600">글을 찾을 수 없습니다.</p>
            <Link href="/">
              <button className="mt-6 text-purple-600 hover:text-purple-700 font-medium transition duration-300">
                ← 홈으로 돌아가기
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const post = await res.json();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="mb-8">
              <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 mb-4">
                {post.title}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-indigo-400 flex items-center justify-center text-white text-sm font-bold mr-2">
                    {post.author.charAt(0)}
                  </div>
                  <span className="font-medium">{post.author}</span>
                </div>
                <span>•</span>
                <time>{new Date(post.createdAt).toLocaleDateString()}</time>
              </div>
            </div>

            <div className="prose lg:prose-xl mb-8 text-gray-700">
              <p className="whitespace-pre-wrap">{post.content}</p>
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 pt-6">
              <div className="flex space-x-4">
                <EditButton postId={post.id} />
                <DeleteButton postId={post.id} />
              </div>
              <Link href="/">
                <button className="text-gray-600 hover:text-purple-600 font-medium transition duration-300">
                  ← 홈으로 돌아가기
                </button>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <CommentSection postId={post.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
