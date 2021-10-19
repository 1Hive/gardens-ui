import React, { useEffect } from 'react'
import { useGardens } from '@/providers/Gardens'

export default function DiscourseComments({ topicId }) {
  const { connectedGarden } = useGardens()

  useEffect(() => {
    window.DiscourseEmbed = {
      discourseUrl: connectedGarden.forumURL,
      topicId,
    }

    const d = document.createElement('script')
    d.type = 'text/javascript'
    d.async = true
    d.src = window.DiscourseEmbed.discourseUrl + 'javascripts/embed.js'
    ;(
      document.getElementsByTagName('head')[0] ||
      document.getElementsByTagName('body')[0]
    ).appendChild(d)
  }, [connectedGarden.forumURL, topicId])

  return (
    <div>
      <div id="discourse-comments" />
    </div>
  )
}
