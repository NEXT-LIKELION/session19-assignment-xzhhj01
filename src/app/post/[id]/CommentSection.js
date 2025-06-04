'use client';

import { useState, useEffect } from 'react';

export default function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState('');

  // 댓글 불러오기
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/posts/${postId}/comments`);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || `Failed to fetch comments: ${res.status}`);
        }
        const data = await res.json();
        setComments(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchComments();
    }
  }, [postId]);

  // 댓글 제출
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: commentText, author: commentAuthor }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Failed to add comment: ${res.status}`);
      }

      const newComment = await res.json();
      setComments([...comments, newComment]); // 새 댓글 목록에 추가
      setCommentText(''); // 입력 필드 초기화
      setCommentAuthor(''); // 작성자 필드 초기화
    } catch (error) {
      console.error("Error adding comment:", error);
      alert(`댓글 추가 실패: ${error.message}`);
    }
  };

  // 댓글 수정 시작
  const handleStartEdit = (comment) => {
    setEditingCommentId(comment.id);
    setEditText(comment.text);
  };

  // 댓글 수정 취소
  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditText('');
  };

  // 댓글 수정 제출
  const handleSubmitEdit = async (commentId) => {
    if (!editText.trim()) return;

    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ commentId, text: editText }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Failed to update comment: ${res.status}`);
      }

      const updatedComment = await res.json();
      setComments(comments.map(comment => 
        comment.id === commentId ? updatedComment : comment
      ));
      setEditingCommentId(null);
      setEditText('');
    } catch (error) {
      console.error("Error updating comment:", error);
      alert(`댓글 수정 실패: ${error.message}`);
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId) => {
    if (!confirm('정말로 이 댓글을 삭제하시겠습니까?')) return;

    try {
      const res = await fetch(`/api/posts/${postId}/comments?commentId=${commentId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Failed to delete comment: ${res.status}`);
      }

      setComments(comments.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert(`댓글 삭제 실패: ${error.message}`);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="text-center py-8">
      <p className="text-red-500">댓글 로딩 에러: {error}</p>
    </div>
  );

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
        댓글
      </h2>

      {/* 댓글 작성 폼 */}
      <div className="bg-gray-50 rounded-xl p-6">
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <div>
            <input
              type="text"
              value={commentAuthor}
              onChange={(e) => setCommentAuthor(e.target.value)}
              placeholder="작성자 (비우면 랜덤 닉네임)"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
            />
          </div>
          <div>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="댓글을 입력하세요"
              rows="3"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-2 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition duration-300"
            >
              댓글 작성
            </button>
          </div>
        </form>
      </div>

      {/* 댓글 목록 */}
      <div className="space-y-6">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition duration-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-indigo-400 flex items-center justify-center text-white text-sm font-bold">
                    {comment.author.charAt(0)}
                  </div>
                  <span className="font-medium text-gray-700">{comment.author}</span>
                </div>
                <time className="text-sm text-gray-500">
                  {new Date(comment.createdAt).toLocaleString()}
                  {comment.updatedAt && <span className="ml-2 text-purple-500">(수정됨)</span>}
                </time>
              </div>
              
              {editingCommentId === comment.id ? (
                <div className="space-y-4">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                    rows="3"
                  />
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition duration-200"
                    >
                      취소
                    </button>
                    <button
                      onClick={() => handleSubmitEdit(comment.id)}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition duration-200"
                    >
                      저장
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-gray-700 whitespace-pre-wrap">{comment.text}</p>
                  <div className="flex justify-end space-x-3 mt-4">
                    <button
                      onClick={() => handleStartEdit(comment)}
                      className="text-sm text-gray-600 hover:text-purple-600 font-medium transition duration-200"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-sm text-gray-600 hover:text-red-600 font-medium transition duration-200"
                    >
                      삭제
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!</p>
          </div>
        )}
      </div>
    </div>
  );
} 