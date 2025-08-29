import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { 
  Zap, 
  Shield, 
  Users, 
  BarChart3, 
  Smartphone,
  CheckCircle,
  ArrowRight,
  Palette,
  Code,
  Globe,
  Lock,
  Cloud
} from 'lucide-react'

const FeaturesPage = () => {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast Form Builder',
      description: 'Build beautiful forms in minutes with our intuitive drag-and-drop interface. No coding required.',
      highlights: ['Visual form builder', 'Real-time preview', 'Template library', 'Custom themes']
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level security with end-to-end encryption, GDPR compliance, and SOC 2 certification.',
      highlights: ['End-to-end encryption', 'GDPR compliant', 'SOC 2 certified', 'Regular security audits']
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Work together seamlessly with real-time collaboration, role-based permissions, and version control.',
      highlights: ['Real-time collaboration', 'Role-based access', 'Version control', 'Team workspaces']
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Get deep insights into form performance with real-time analytics, conversion tracking, and custom reports.',
      highlights: ['Real-time analytics', 'Conversion tracking', 'Custom reports', 'Data visualization']
    },
    {
      icon: Smartphone,
      title: 'Mobile First',
      description: 'Responsive forms that work perfectly on any device, with offline capabilities for mobile users.',
      highlights: ['Responsive design', 'Offline support', 'Mobile app', 'Touch optimized']
    },
    {
      icon: Code,
      title: 'Developer Friendly',
      description: 'Powerful APIs, webhooks, and integrations to connect with your existing tools and workflows.',
      highlights: ['REST APIs', 'Webhooks', 'SDKs', 'Custom integrations']
    }
  ]

  const integrations = [
    { name: 'Slack', icon: '💬' },
    { name: 'Zapier', icon: '🔗' },
    { name: 'Salesforce', icon: '☁️' },
    { name: 'HubSpot', icon: '🎯' },
    { name: 'Google Sheets', icon: '📊' },
    { name: 'Stripe', icon: '💳' },
    { name: 'Mailchimp', icon: '📧' },
    { name: 'Webhook', icon: '🔌' }
  ]

  return (
    <>
      <Helmet>
        <title>Features - Affluo Forms</title>
        <meta name="description" content="Discover the powerful features of Affluo Forms. From drag-and-drop form building to advanced analytics and enterprise security." />
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
              Powerful Features for{' '}
              <span className="gradient-text">Modern Teams</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl lg:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto"
            >
              Everything you need to build, deploy, and manage forms at scale. 
              From simple surveys to complex workflows, we've got you covered.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/signup" className="btn-primary text-lg px-8 py-4">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link to="/docs" className="btn-secondary text-lg px-8 py-4">
                View Documentation
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-8"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {feature.description}
                </p>
                <ul className="space-y-2">
                  {feature.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-primary-600 mr-3" />
                      <span className="text-gray-700">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4"
            >
              Integrate with Your Favorite Tools
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Connect Affluo Forms with your existing workflow. 
              We integrate with hundreds of popular tools and services.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8"
          >
            {integrations.map((integration) => (
              <div key={integration.name} className="text-center">
                <div className="w-16 h-16 bg-white rounded-lg shadow-md flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">{integration.icon}</span>
                </div>
                <p className="text-sm font-medium text-gray-700">{integration.name}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl lg:text-4xl font-bold text-white mb-6"
          >
            Ready to Build Amazing Forms?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl text-primary-100 mb-8"
          >
            Join thousands of teams already using Affluo Forms to create better forms faster.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/signup" className="bg-white text-primary-600 hover:bg-gray-50 font-medium py-3 px-8 rounded-lg transition-colors duration-200">
              Start Free Trial
            </Link>
            <Link to="/contact" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-medium py-3 px-8 rounded-lg transition-colors duration-200">
              Contact Sales
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default FeaturesPage
