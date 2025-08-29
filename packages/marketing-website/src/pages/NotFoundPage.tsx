import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

const NotFoundPage = () => {
  return (
    <>
      <Helmet>
        <title>404 - Page Not Found - Affluo Forms</title>
        <meta name="description" content="The page you're looking for doesn't exist." />
      </Helmet>

      <section className="pt-20 pb-16 lg:pt-32 lg:pb-24 gradient-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <h1 className="text-8xl font-bold text-gray-300 mb-4">404</h1>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6"
            >
              Page Not Found
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl lg:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto"
            >
              The page you're looking for doesn't exist or has been moved.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link 
                to="/" 
                className="bg-primary-600 text-white hover:bg-primary-700 font-medium py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                <Home className="h-5 w-5 mr-2" />
                Go Home
              </Link>
              <button 
                onClick={() => window.history.back()}
                className="border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Go Back
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Looking for something specific?</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link 
                to="/features" 
                className="card p-6 hover:shadow-lg transition-shadow duration-200 text-center"
              >
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Features</h4>
                <p className="text-gray-600">Explore what Affluo Forms can do for you</p>
              </Link>
              
              <Link 
                to="/pricing" 
                className="card p-6 hover:shadow-lg transition-shadow duration-200 text-center"
              >
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Pricing</h4>
                <p className="text-gray-600">Find the perfect plan for your needs</p>
              </Link>
              
              <Link 
                to="/contact" 
                className="card p-6 hover:shadow-lg transition-shadow duration-200 text-center"
              >
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Contact</h4>
                <p className="text-gray-600">Get in touch with our support team</p>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default NotFoundPage
