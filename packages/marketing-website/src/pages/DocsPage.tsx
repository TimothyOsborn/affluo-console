import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { useState } from 'react'
import { Book, Code, FileText, Play, Search, ChevronRight } from 'lucide-react'

const DocsPage = () => {
  const [activeSection, setActiveSection] = useState('getting-started')
  const [searchQuery, setSearchQuery] = useState('')

  const sections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Play,
      content: [
        { title: 'Quick Start Guide', description: 'Get up and running in 5 minutes' },
        { title: 'Installation', description: 'Step-by-step installation instructions' },
        { title: 'First Form', description: 'Create your first form' },
        { title: 'Account Setup', description: 'Configure your account and team' }
      ]
    },
    {
      id: 'forms',
      title: 'Forms',
      icon: FileText,
      content: [
        { title: 'Form Builder', description: 'Create forms with our drag-and-drop builder' },
        { title: 'Field Types', description: 'All available form field types' },
        { title: 'Validation', description: 'Add validation rules to your forms' },
        { title: 'Templates', description: 'Use pre-built form templates' },
        { title: 'Publishing', description: 'Publish and share your forms' }
      ]
    },
    {
      id: 'api',
      title: 'API Reference',
      icon: Code,
      content: [
        { title: 'Authentication', description: 'JWT-based authentication' },
        { title: 'Forms API', description: 'Create and manage forms programmatically' },
        { title: 'Submissions API', description: 'Handle form submissions' },
        { title: 'Webhooks', description: 'Real-time notifications' },
        { title: 'SDKs', description: 'Official SDKs for popular languages' }
      ]
    },
    {
      id: 'integrations',
      title: 'Integrations',
      icon: Book,
      content: [
        { title: 'Zapier', description: 'Connect with 5000+ apps via Zapier' },
        { title: 'Webhooks', description: 'Send data to your own systems' },
        { title: 'Email', description: 'Email notifications and autoresponders' },
        { title: 'Slack', description: 'Get notifications in Slack' },
        { title: 'Custom', description: 'Build custom integrations' }
      ]
    }
  ]

  const filteredSections = sections.map(section => ({
    ...section,
    content: section.content.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => section.content.length > 0)

  return (
    <>
      <Helmet>
        <title>Documentation - Affluo Forms</title>
        <meta name="description" content="Complete documentation for Affluo Forms. Learn how to create forms, use the API, and integrate with your workflow." />
      </Helmet>

      {/* Hero Section */}
      <section className="pt-20 pb-16 lg:pt-32 lg:pb-24 gradient-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6"
            >
              Documentation
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl lg:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto"
            >
              Everything you need to know about building forms with Affluo Forms.
            </motion.p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-2xl mx-auto"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search documentation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Documentation Content */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <nav className="sticky top-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contents</h3>
                <ul className="space-y-2">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <button
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 flex items-center ${
                          activeSection === section.id
                            ? 'bg-primary-100 text-primary-700'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <section.icon className="h-4 w-4 mr-3" />
                        {section.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {filteredSections.map((section) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className={`${activeSection === section.id ? 'block' : 'hidden'}`}
                >
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
                      <section.icon className="h-8 w-8 mr-3 text-primary-600" />
                      {section.title}
                    </h2>
                    <p className="text-lg text-gray-600">
                      {section.id === 'getting-started' && 'Get started with Affluo Forms quickly and easily.'}
                      {section.id === 'forms' && 'Learn how to create and manage forms effectively.'}
                      {section.id === 'api' && 'Integrate Affluo Forms into your applications with our API.'}
                      {section.id === 'integrations' && 'Connect Affluo Forms with your favorite tools and services.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {section.content.map((item, index) => (
                      <motion.div
                        key={item.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="card p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer group"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-200">
                              {item.title}
                            </h3>
                            <p className="text-gray-600">{item.description}</p>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-primary-600 transition-colors duration-200" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}

              {searchQuery && filteredSections.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
                  <p className="text-gray-600">Try adjusting your search terms or browse the sections above.</p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Need Help?</h2>
            <p className="text-lg text-gray-600">Can't find what you're looking for? We're here to help.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-primary-100 p-4 rounded-lg w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Book className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Video Tutorials</h3>
              <p className="text-gray-600 mb-4">Watch step-by-step video guides to get started quickly.</p>
              <a href="/tutorials" className="text-primary-600 hover:text-primary-700 font-medium">
                Watch Tutorials →
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-primary-100 p-4 rounded-lg w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Code className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">API Examples</h3>
              <p className="text-gray-600 mb-4">Explore code examples and sample integrations.</p>
              <a href="/api-examples" className="text-primary-600 hover:text-primary-700 font-medium">
                View Examples →
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-primary-100 p-4 rounded-lg w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FileText className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact Support</h3>
              <p className="text-gray-600 mb-4">Get help from our support team when you need it.</p>
              <a href="/contact" className="text-primary-600 hover:text-primary-700 font-medium">
                Contact Us →
              </a>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}

export default DocsPage
