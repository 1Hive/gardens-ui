import React, { useState, useEffect } from 'react'
import { useConnectedGarden } from '@providers/ConnectedGarden'
import CustomSanitizedHTML from '@/components/SanitizedHTML'
import env from '@/environment'
import './DiscourseComments.css'

const MIDDLEWARE_ENDPOINT = env('MIDDLEWARE_ENDPOINT')

const getPostDateTime = (post: Post) => new Date(post.created_at).toLocaleString('en-US')
const getPostDate = (post: Post) => new Date(post.created_at).toLocaleDateString('en-US')

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
  reply_to_user: ({ username: string }) | undefined
}

function DiscourseComments({ topicId } : PropsType) {
  const connectedGarden = useConnectedGarden()
  const [posts, setPosts] = useState([])
  console.log(posts)

  useEffect(() => {
    window.fetch(`${MIDDLEWARE_ENDPOINT}/cors/${connectedGarden.forumURL}/t/${topicId}.json`)
    .then(response => response.json())
    .then(data => data.posts_count > 20 // Normal call does only retreive 20 posts, but is less resource intensive
      ? fetch(`${MIDDLEWARE_ENDPOINT}/cors/${connectedGarden.forumURL}/t/${topicId}.json?print=true`)
        .then(response => response.ok
          ? response.json()
          : data
        )
      : data
    )
    .then(data => setPosts(data?.post_stream?.posts || posts));
  }, [connectedGarden.forumURL, topicId])

  return (
    <div>
      {posts.map((post: Post) =>
        <article className="post clearfix" key={post.id}>
          <div title={getPostDateTime(post)} className="post-date">{getPostDate(post)}</div>
          {post.reply_to_user ? <div className="in-reply-to">▶ {post.reply_to_user.username}</div> : null }
          <div className="author">
            <img className="avatar" src={connectedGarden.forumURL+post.avatar_template.replace("{size}", "45")} />
          </div>
          <div className="cooked">
            <span className="username">{post.username}</span> <span className="user-title">{post.user_title}</span>
            <CustomSanitizedHTML html={post.cooked} siteUrl={connectedGarden.forumURL} />
            { post.reply_count ? <span className="post-replies">{post.reply_count == 1 ? "1 reply" : post.reply_count + " replies" }</span> : null }
          </div>
        </article>
      )}
    </div>
  )
}

export default React.memo(DiscourseComments);
