import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { handlePostState, useSSRPostsState } from '../atoms/postAtom';
import Input from './Input';
import Post from './Post';

export default function Feed({ posts }) {
  const [realTimePosts, setRealTimePosts] = useState([]);
  const [handlePost, setHandlePost] = useRecoilState(handlePostState);
  const [useSSRPosts, setUseSSRPosts] = useRecoilState(useSSRPostsState);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch('/api/posts', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();

      setRealTimePosts(data);
      setHandlePost(false);
      setUseSSRPosts(false);
    };

    console.log('useEffect runn');

    fetchPosts();
  }, [handlePost]);

  // console.log('realTimePosts => ', realTimePosts);
  // console.log('useSSRPosts => ', useSSRPosts);
  // console.log('handlePost => ', handlePost);

  return (
    <div className="space-y-6 pb-24 max-w-lg">
      <Input />
      {/* Posts */}
      {useSSRPosts
        ? posts.map((post) => <Post key={post._id} post={post} />)
        : realTimePosts.map((post) => <Post key={post._id} post={post} />)}
    </div>
  );
}
