// import { allBlogs } from 'contentlayer/generated'
// import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'

import Main from 'app/main'

export default async function Page() {
    // const sortedPosts = sortPosts(allBlogs)
    // const posts = allCoreContent(sortedPosts)
    return <Main posts={null} />
}
