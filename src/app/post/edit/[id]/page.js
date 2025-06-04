"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 기존 글 정보 불러오기
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/posts/${postId}`);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || `Failed to fetch post: ${res.status}`);
        }
        const data = await res.json();
        setTitle(data.title || '');
        setContent(data.content || '');
        setAuthor(data.author || '');
      } catch (error) {
        console.error("Error fetching post for edit:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  // 글 수정 제출
  const handleSubmit = async (e) => {
    e.preventDefault(); // 폼 기본 제출 방지

    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'PUT', // PUT 메서드 사용
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, author, content }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Failed to update post: ${res.status}`);
      }

      alert('글이 수정되었습니다.');
      router.push(`/post/${postId}`); // 수정된 글 세부 페이지로 이동
    } catch (error) {
      console.error("Error updating post:", error);
      alert(`글 수정 실패: ${error.message}`);
    }
  };

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>데이터 로딩 에러: {error}</p>;

  return (
    <div className="container mx-auto px-4 py-12 bg-gray-50 min-h-screen">
       <div className="bg-white border border-gray-200 p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
         <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">글 수정</h1>
         <form onSubmit={handleSubmit} className="space-y-6">
           <div>
             <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">제목</label>
             <input
               type="text"
               id="title"
               value={title}
               onChange={(e) => setTitle(e.target.value)}
               placeholder="제목을 입력하세요"
               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
               required
             />
           </div>
           <div>
             <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">작성자</label>
             <input
               type="text"
               id="author"
               value={author}
               onChange={(e) => setAuthor(e.target.value)}
               placeholder="작성자"
               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
             />
           </div>
           <div>
             <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">글 내용</label>
             <textarea
               id="content"
               value={content}
               onChange={(e) => setContent(e.target.value)}
               placeholder="글 내용을 입력하세요"
               rows="10"
               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
               required
             />
           </div>

           <div className="flex justify-end">
             <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow transition duration-200">
               수정 완료
             </button>
             <button type="button" onClick={() => router.back()} className="ml-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-6 rounded-lg shadow transition duration-200">
               취소
             </button>
           </div>
         </form>
       </div>
     </div>
  );
} 