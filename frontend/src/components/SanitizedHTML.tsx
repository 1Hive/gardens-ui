import React from 'react'
import SanitizedHTML from 'react-sanitized-html'
import PropTypes from 'prop-types';
import sanitizeHtml from 'sanitize-html'

SanitizedHTML.propTypes = {
  ...SanitizedHTML.propTypes,
  transformTags: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.string
    ])
  ),
}


const allowedTags = sanitizeHtml.defaults.allowedTags.concat([ 'img' ])
const allowedClasses = {
  'a': ['mention'],
  'aside': ['quote'],
  'img': ['avatar', 'emoji']
}

const transformTags = (siteUrl: string) =>  ({
  'a': (tagName: string, attribs: sanitizeHtml.Attributes) => {
    return {
      tagName,
      attribs: {
        ...attribs,
        href: /^(?:[a-z]+:)?\/\//i.test(attribs.href) ? attribs.href : siteUrl + attribs.href,
        target: "_blank",
        rel: "noreferrer",
      }
    }
  }
})

const CustomSanitizedHTML = ({siteUrl, html}: {siteUrl: string, html: string}) =>
  <SanitizedHTML
    allowedTags={allowedTags}
    allowedClasses={allowedClasses}
    transformTags={transformTags(siteUrl)}
    html={html}
  />

export default CustomSanitizedHTML
