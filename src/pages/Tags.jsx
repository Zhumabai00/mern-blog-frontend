import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from "react-router-dom";
import { fetchPosts, fetchTags } from '../redux/slices/posts';
import { Grid } from '@mui/material';
import { Post } from '../components';

export const Tags = () => {
  const { tag } = useParams();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  const { posts, tags } = useSelector((state) => state.posts);
  const isPostsLoading = posts.status === 'loading';
  const isTagsLoading = tags.status === 'loading';
  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchTags());
  }, [dispatch]);
  // Filter cards that include the tag
  const filteredPosts = Array.isArray(posts.items)
  ? posts.items.filter((post) => post.tags.includes(tag))
  : [];

    
  // if (filteredPosts.length === 0) {
  //   return <p>No posts found for tag: #{tag}</p>;
  // }
  console.log(filteredPosts);
  
  return (
    <div>
              <Grid container spacing={4}>
          {(isPostsLoading ? [...Array(5)] : filteredPosts).map((obj, index) =>
            isPostsLoading ? (
              <Grid xs={6} item>
                <Post key={index} isLoading={true} />
                  </Grid>
            ) : (
              <Grid xs={6} item>
                <Post
                  key={index}
                  _id={obj._id}
                  title={obj.title}
                  imageUrl={
                    obj.imageUrl
                      ? `${process.env.REACT_APP_API_URL || 'http://localhost:4444'}${obj.imageUrl}`
                      : ''
                  }
                  user={obj.user}
                  createdAt={obj.createdAt}
                  viewsCount={obj.viewsCount}
                  commentsCount={3}
                  tags={obj.tags}
                  isEditable={userData?._id === obj.user._id}
                />
                  </Grid>
            )
          )}

        </Grid>
    </div>
  )
}