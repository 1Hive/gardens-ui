import styled from 'styled-components'

export const Article = styled.article`
  border-bottom: 1px solid #e9e9e9;

  &:after {
    content: '';
    clear: both;
    display: table;
  }

  h1,
  h2,
  h3 {
    font-size: larger;
    font-weight: bold;
    margin: 30px 0 10px;
  }
`

export const PostDate = styled.div`
  float: right;
  color: rgb(189, 189, 189);
  font-size: 16px;
  margin: 10px 4px 0 0;
`

export const InReplyTo = styled.div`
  font-size: 16px;
  text-align: center;
  margin: 10px 20px 6px 0;
  display: inline-block;
  float: right;
  color: rgb(129, 129, 129);
`

export const Author = styled.div`
  padding: 10px 5px;
  float: left;
`

export const Avatar = styled.img`
  border-radius: 50%;
  max-width: 45px;
`

export const Cooked = styled.div`
  padding: 10px 0;
  margin-left: 65px;
  word-wrap: break-word;
  word-break: break-word;
  max-width: 650px;
`

export const Username = styled.span`
  font-weight: bold;
`

export const UserTitle = styled.span`
  color: #919191;
  font-weight: normal;
`

export const PostReplies = styled.span`
  color: #919191;
`
