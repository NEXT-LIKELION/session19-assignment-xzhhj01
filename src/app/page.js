import Link from "next/link";

export default async function HomePage() {
  const res = await fetch("http://localhost:3000/api/posts", {
    cache: "no-store",
  });
  const posts = await res.json();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <h1 className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 mb-6 md:mb-0">
            Simple Blog
          </h1>
          <Link href="/post/write">
            <button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition duration-300">
              ✍️ 새 글 작성
            </button>
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-2xl text-gray-600 mb-4">아직 작성된 글이 없습니다</p>
            <p className="text-gray-500">첫 번째 글의 주인공이 되어보세요!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link href={`/post/${post.id}`} key={post.id} className="group">
                <article className="bg-white rounded-2xl shadow-md hover:shadow-2xl p-6 transform hover:-translate-y-2 transition duration-300">
                  <div className="flex flex-col h-full">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-purple-600 transition duration-300">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 mb-6 flex-grow line-clamp-3">
                      {post.content}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-indigo-400 flex items-center justify-center text-white text-sm font-bold">
                          {post.author.charAt(0)}
                        </div>
                        <span className="text-sm text-gray-600">{post.author}</span>
                      </div>
                      <time className="text-sm text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </time>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
