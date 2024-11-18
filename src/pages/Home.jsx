import React, { useState, useEffect } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import { useDispatch, useSelector } from 'react-redux';

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import { fetchPosts, fetchTags } from '../redux/slices/posts.js';
import { formattedDate } from '../components/datehook.js';

export const Home = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  const { posts, tags } = useSelector((state) => state.posts);

  const [sortType, setSortType] = useState('new');

  const isPostsLoading = posts.status === 'loading';
  const isTagsLoading = tags.status === 'loading';

  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchTags());
  }, [dispatch]);

  // Sort posts based on the active tab
  const sortedPosts = [...posts.items].sort((a, b) => {
    if (sortType === 'new') {
      return new Date(b.createdAt) - new Date(a.createdAt); // Sort by date (newest first)
    } else if (sortType === 'popular') {
      return b.viewsCount - a.viewsCount; // Sort by views (highest first)
    }
    return 0;
  });


  const tagCounts = {};
  posts.items.forEach((post) => {
    post.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  const sortedTags = Object.keys(tagCounts)

  return (
    <>
      <Tabs
        style={{ marginBottom: 15 }}
        value={sortType === 'new' ? 0 : 1}
        onChange={(event, newValue) => setSortType(newValue === 0 ? 'new' : 'popular')}
        aria-label="basic tabs example"
      >
        <Tab label="New" />
        <Tab label="Popular" />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostsLoading ? [...Array(5)] : sortedPosts).map((obj, index) =>
            isPostsLoading ? (
              <Post key={index} isLoading={true} />
            ) : (
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
                createdAt={formattedDate(obj.createdAt)}
                viewsCount={obj.viewsCount}
                commentsCount={3}
                tags={obj.tags}
                isEditable={userData?._id === obj.user._id}
              />
            )
          )}
        </Grid>
        <Grid xs={4} item>
          <div className="" style={{ position: 'sticky', top: '10px' }}>
            <TagsBlock items={sortedTags} isLoading={isTagsLoading} />
            <CommentsBlock
              items={[
                {
                  user: {
                    fullName: 'Username',
                    avatarUrl: '...',
                  },
                  text: 'This is a test comment',
                },
                {
                  user: {
                    fullName: 'Second username',
                    avatarUrl: '...',
                  },
                  text:
                    'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',
                },
              ]}
              isLoading={false}
            />
          </div>
        </Grid>
      </Grid>
    </>
  );
};