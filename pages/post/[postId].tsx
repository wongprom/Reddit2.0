import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import React from 'react'
import Post from '../../components/Post'
import { GET_POST_BY_POST_ID } from '../../graphql/queries'

const PostPage = () => {
  const router = useRouter()
  console.log('🚀 ~ file: [postid].tsx ~ line 9 ~ PostPage ~ router', router)

  const { data, error } = useQuery(GET_POST_BY_POST_ID, {
    variables: {
      post_id: router.query.postId,
    },
  })
  console.log('🚀 ~ file: [postid].tsx ~ line 14 ~ PostPage ~ data', data)

  const post: Post = data?.getPostListByPostId

  return (
    <div className="mx-auto my-7 max-w-5xl">
      <Post post={post} />
    </div>
  )
}

export default PostPage
