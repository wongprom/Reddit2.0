import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import { LinkIcon, PhotographIcon } from '@heroicons/react/outline'
import { useForm } from 'react-hook-form'
import { useMutation } from '@apollo/client'
import Avatar from './Avatar'
import { ADD_POST, ADD_SUBREDDIT } from '../graphql/mutations'
import client from '../apollo-client'
import { GET_SUBREDDIT_BY_TOPIC } from '../graphql/queries'
import toast from 'react-hot-toast'

type FormData = {
  postTitle: string
  postBody: string
  postImage: string
  subreddit: string
}

const PostBox = () => {
  const { data: session } = useSession()
  const [imageBoxOpen, setImageBoxOpen] = useState<boolean>(false)
  const [addPost] = useMutation(ADD_POST)
  const [addSubreddit] = useMutation(ADD_SUBREDDIT)
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>()

  const onSubmit = handleSubmit(async (formData) => {
    console.log(
      '🚀 ~ file: PostBox.tsx ~ line 26 ~ onSubmit ~ formData',
      formData
    )

    const notification = toast.loading('Creating new post...')
    // Query for subreddit topic...

    try {
      const {
        data: { getSubredditListByTopic },
      } = await client.query({
        fetchPolicy: 'no-cache',
        query: GET_SUBREDDIT_BY_TOPIC,
        variables: {
          topic: formData.subreddit,
        },
      })

      console.log('getSubredditListByTopic => ', getSubredditListByTopic)
      const subredditExists = getSubredditListByTopic.length > 0
      console.log(
        '🚀 ~ file: PostBox.tsx ~ line 53 ~ onSubmit ~ subredditExists',
        subredditExists
      )

      if (!subredditExists) {
        console.log('Subreddit is new --> creating a new subreddit')

        const {
          data: { insertSubreddit: newSubreddit },
        } = await addSubreddit({
          variables: {
            topic: formData.subreddit,
          },
        })

        console.log('creating post...', { formData })
        const image = formData.postImage || ''

        const {
          data: { insertPost: newPost },
        } = await addPost({
          variables: {
            body: formData.postBody,
            image: image,
            subreddit_id: newSubreddit.id,
            title: formData.postTitle,
            username: session?.user?.name,
          },
        })

        console.log({ newPost })
      } else {
        // use existing subreddit...
        console.log('using exitiing subreddit')
        console.log(getSubredditListByTopic)

        const image = formData.postImage || ''
        const {
          data: { insertPost: newPost },
        } = await addPost({
          variables: {
            body: formData.postBody,
            image: image,
            subreddit_id: getSubredditListByTopic[0].id,
            title: formData.postTitle,
            username: session?.user?.name,
          },
        })

        console.log('new post was added', newPost)
      }

      // After post has been added
      setValue('postBody', '')
      setValue('postTitle', '')
      setValue('postImage', '')
      setValue('subreddit', '')

      toast.success('New post created!', { id: notification })
    } catch (error) {
      toast.error('oops, something went wrong...', { id: notification })
    }
  })

  return (
    <div>
      <form
        onSubmit={onSubmit}
        className="sticky top-16 z-50 rounded-md border border-gray-300 bg-white p-2"
      >
        <div className="flex items-center space-x-3">
          <Avatar />

          <input
            {...register('postTitle', { required: true })}
            type="text"
            className="flex-1 rounded-md bg-gray-50 p-2 pl-5 outline-none"
            disabled={!session}
            placeholder={
              session ? 'Create a post by entering a title' : 'Sign in to post'
            }
          />
          <PhotographIcon
            className={`h-6 cursor-pointer text-gray-300 ${
              imageBoxOpen && 'text-blue-300'
            }`}
            onClick={() => setImageBoxOpen(!imageBoxOpen)}
          />
          <LinkIcon className="h-6 text-gray-300" />
        </div>
        {/* might need = !!watch('postTitle')... */}
        {watch('postTitle') && (
          <div className="py2 flex flex-col">
            {/* Body */}
            <div className="flex items-center px-2">
              <p className="min-w-[90px]">Body:</p>
              <input
                type="text"
                className="m-2 flex-1 bg-blue-50 p-2 outline-none"
                {...register('postBody')}
                placeholder="Text (optional)"
              />
            </div>
            <div className="flex items-center px-2">
              <p className="min-w-[90px]">Subreddit:</p>
              <input
                type="text"
                className="m-2 flex-1 bg-blue-50 p-2 outline-none"
                {...register('subreddit', { required: true })}
                placeholder="i.e. reactjs"
              />
            </div>

            {imageBoxOpen && (
              <div className="flex items-center px-2">
                <p className="min-w-[90px]">Image URL:</p>
                <input
                  type="text"
                  className="m-2 flex-1 bg-blue-50 p-2 outline-none"
                  {...register('postImage')}
                  placeholder="Optional..."
                />
              </div>
            )}

            {/* Errors */}
            {Object.keys(errors).length > 0 && (
              <div className="space-y-2 p-2 text-red-500 ">
                {errors.postTitle?.type === 'required' && (
                  <p>- A Post Title is required</p>
                )}
                {errors.subreddit?.type === 'required' && (
                  <p>- A Subreddit is required</p>
                )}
              </div>
            )}

            {!!watch('postTitle') && (
              <button
                type="submit"
                className="w-full rounded-full bg-blue-400 p-2 text-white"
              >
                {' '}
                Create Post
              </button>
            )}
          </div>
        )}
      </form>
    </div>
  )
}

export default PostBox
