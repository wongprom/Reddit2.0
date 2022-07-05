# Reddit 2.0

This is a clone of Reddit

## Doing things like <br>

- Create own TailwindCSS utility class
  ```css
  globals.css @layer components {
    .icon {
      @apply h-9 w-6 cursor-pointer rounded-sm lg:w-9 lg:p-1 lg:hover:bg-gray-100;
    }
    .voteButtons {
      @apply h-6 w-6 rounded-md p-1 hover:bg-gray-200;
    }
  }
  ```
- React Hook Form
  ```js
  watch('postTitle') && (
          <div className="flex items-center px-2">
            <p className="min-w-[90px]">Body:</p>
            <input
              type="text"
              className="m-2 flex-1 bg-blue-50 p-2 outline-none"
              {...register('postBody')}
              placeholder="Text (optional)"
            />
          </div>
          .....
  ```

### Tech used in this project

- [Supabase](https://supabase.com/) - Supabase is an open source Firebase alternative. Start your project with a Postgres Database, Authentication, instant APIs, Realtime subscriptions and Storage.
- [Stepzen](https://stepzen.com/) - Build a GraphQL API from your REST, Database and GraphQL Backends in Minutes.
- [DiceBear Avatars](https://avatars.dicebear.com/) - DiceBear is an avatar library for designers and developers. You can choose between simple identicons and lovely designed characters.<br>
  **And best of all:** We provide a simple and free HTTP API that you can use right away!
- [React Hook Form](https://react-hook-form.com/) - Performant, flexible and extensible forms with easy-to-use validation.
- [React Hot Toast](https://react-hot-toast.com/) - Add beautiful notifications to your React app with `react-hot-toast`.
- [React-TimeAgo](https://www.npmjs.com/package/react-timeago) - A simple time-ago component for React.
- [Loaders](https://uiball.com/loaders/) - Free loaders & spinners for your next project. Built with HTML, CSS and a soupçon of SVG.<br>
  Available for React and copypasta.
