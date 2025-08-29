import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'

const BlogPage = () => {
  return (
    <>
      <Helmet>
        <title>Blog - Affluo Forms</title>
        <meta name="description" content="Latest news, updates, and insights from the Affluo Forms team." />
      </Helmet>

      <section className="pt-20 pb-16 lg:pt-32 lg:pb-24 gradient-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6"
            >
              Blog
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl lg:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto"
            >
              Latest news, updates, and insights from the Affluo Forms team.
            </motion.p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Coming Soon</h2>
            <p className="text-gray-600">Our blog is under construction. Check back soon for updates!</p>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default BlogPage
