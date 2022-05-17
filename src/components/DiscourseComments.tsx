import React, { useState, useEffect } from 'react'
import { useConnectedGarden } from '@providers/ConnectedGarden'
import CustomSanitizedHTML from '@/components/SanitizedHTML'
import env from '@/environment'

import {
  Article,
  Author,
  Avatar,
  Cooked,
  InReplyTo,
  PostDate,
  PostReplies,
  Username,
  UserTitle,
} from './DiscourseCommentsStyles'

const MIDDLEWARE_ENDPOINT = env('MIDDLEWARE_ENDPOINT')

const getPostDateTime = (post: Post) =>
  new Date(post.created_at).toLocaleString('en-US')
const getPostDate = (post: Post) =>
  new Date(post.created_at).toLocaleDateString('en-US')

type PropsType = {
  topicId: number
}

type Post = {
  id: number
  username: string
  avatar_template: string
  created_at: string
  cooked: string
  reply_count: number
  user_title: string
  reply_to_user: { username: string } | undefined
}

function DiscourseComments({ topicId }: PropsType) {
  const connectedGarden = useConnectedGarden()
  const [posts, setPosts] = useState([])

  useEffect(() => {
    window
      .fetch(
        `${MIDDLEWARE_ENDPOINT}/cors/${connectedGarden.forumURL}/t/${topicId}.json`
      )
      .then((response) => response.json())
      .then((data) =>
        data.posts_count > 20 // Normal call does only retreive 20 posts, but is less resource intensive
          ? fetch(
              `${MIDDLEWARE_ENDPOINT}/cors/${connectedGarden.forumURL}/t/${topicId}.json?print=true`
            ).then((response) => (response.ok ? response.json() : data))
          : data
      )
      .then((data) => setPosts(data?.post_stream?.posts || posts))
  }, [connectedGarden.forumURL, topicId])

  if (posts && posts.length === 0) {
    return null
  }

  return (
    <div>
      {posts.map((post: Post) => (
        <Article key={post.id}>
          <PostDate title={getPostDateTime(post)}>{getPostDate(post)}</PostDate>

          {post.reply_to_user ? (
            <InReplyTo>▶ {post.reply_to_user.username}</InReplyTo>
          ) : null}

          <Author>
            <Avatar
              src={
                connectedGarden.forumURL +
                post.avatar_template.replace('{size}', '45')
              }
            />
          </Author>

          <Cooked>
            <Username>{post.username}</Username>{' '}
            <UserTitle>{post.user_title}</UserTitle>
            <CustomSanitizedHTML
              html={post.cooked}
              siteUrl={connectedGarden.forumURL}
            />
            {post.reply_count ? (
              <PostReplies>
                {post.reply_count == 1
                  ? '1 reply'
                  : post.reply_count + ' replies'}
              </PostReplies>
            ) : null}
          </Cooked>
        </Article>
      ))}
    </div>
  )
}

export default React.memo(DiscourseComments)
