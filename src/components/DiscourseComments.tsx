import React, { useEffect } from 'react'
import { useConnectedGarden } from '@providers/ConnectedGarden'

// TODO:  @refactor-typescript Test this out Please
export default function DiscourseComments({ topicId }) {
  const connectedGarden = useConnectedGarden()

  useEffect(() => {
    window['DiscourseEmbed'] = {
      discourseUrl: connectedGarden.forumURL,
      topicId,
    }

    const d = document.createElement('script')
    d.type = 'text/javascript'
    d.async = true
    d.src = window['DiscourseEmbed'].discourseUrl + 'javascripts/embed.js'
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
