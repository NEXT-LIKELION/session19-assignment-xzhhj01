"use client";

import { useRouter } from 'next/navigation';

export default function DeleteButton({ postId }) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = confirm('이 글을 삭제하시겠습니까?');
    if (confirmed) {
      try {
        const deleteRes = await fetch(`/api/posts/${postId}`, {
          method: 'DELETE',
        });

        if (!deleteRes.ok) {
          const errorData = await deleteRes.json();
          throw new Error(errorData.error || `Failed to delete post: ${deleteRes.status}`);
        }

        alert('글이 삭제되었습니다.');
        router.push('/'); // 삭제 후 메인 페이지로 이동
      } catch (error) {
        console.error("Error deleting post:", error.message);
        alert(`글 삭제 실패: ${error.message}`);
      }
    }
  };

  return (
    <button 
      onClick={handleDelete}
      className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-red-600 transition duration-200"
    >
      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
      </svg>
      삭제
    </button>
  );
}