"use client";

import Link from 'next/link';

export default function EditButton({ postId }) {
  return (
    <Link href={`/post/edit/${postId}`}>
      <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-purple-600 transition duration-200">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
        </svg>
        수정
      </button>
    </Link>
  );
}
