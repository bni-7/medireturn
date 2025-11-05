import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Award, TrendingUp, CheckCircle, Users, Shield, Building2, User } from 'lucide-react';
import Button from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const features = [
    {
      icon: MapPin,
      title: 'Find Collection Points',
      description: 'Locate nearby pharmacies, hospitals, and NGOs accepting unused medicines'
    },
    {
      icon: Calendar,
      title: 'Schedule Pickups',
      description: 'Book convenient pickup times for your unused medications'
    },
    {
      icon: Award,
      title: 'Earn Rewards',
      description: 'Get points for contributing to safe medicine disposal'
    },
    {
      icon: TrendingUp,
      title: 'Track Impact',
      description: 'Monitor your contribution and see your environmental impact'
    }
  ];

  const stats = [
    { value: '1000+', label: 'Active Users' },
    { value: '500+', label: 'Collection Points' },
    { value: '5000kg', label: 'Medicines Collected' },
    { value: '50+', label: 'Cities Covered' }
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Sign Up',
      description: 'Create your free account in minutes'
    },
    {
      step: '2',
      title: 'Find or Schedule',
      description: 'Locate collection points or book a pickup'
    },
    {
      step: '3',
      title: 'Drop Off',
      description: 'Safely dispose your unused medicines'
    },
    {
      step: '4',
      title: 'Earn Points',
      description: 'Get rewarded for your contribution'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Safe Disposal of <span className="text-primary-600">Unused Medicines</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Join thousands of Indians in making our communities healthier and safer through responsible medicine disposal.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {user ? (
                  <Link to="/dashboard">
                    <Button variant="primary" size="large">
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link to="/register">
                    <Button variant="primary" size="large">
                      Get Started
                    </Button>
                  </Link>
                )}
                <Link to="/collection-points">
                  <Button variant="outline" size="large">
                    Find Collection Points
                  </Button>
                </Link>
              </div>
            </div>
            <div className="animate-slide-up">
              <img
                src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&h=600&fit=crop"
                alt="Medicine Collection"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <p className="text-4xl font-bold text-primary-600 mb-2">{stat.value}</p>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose MediReturn?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              India's leading platform for safe prescription drug disposal
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-200 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="text-primary-600" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple steps to make a difference
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <div key={index} className="text-center animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Make a Positive Impact
              </h2>
              <div className="space-y-4">
                {[
                  'Prevent medicine misuse and abuse',
                  'Protect environment from contamination',
                  'Support community health initiatives',
                  'Earn rewards for your contributions'
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="flex-shrink-0 mt-1" size={20} />
                    <p className="text-lg">{benefit}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                {user ? (
                  <Link to="/dashboard">
                    <Button variant="secondary" size="large">
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link to="/register">
                    <Button variant="secondary" size="large">
                      Join Now
                    </Button>
                  </Link>
                )}
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=600&fit=crop"
                alt="Community Impact"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Users className="w-16 h-16 text-primary-600 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join our community and start your journey towards safer medicine disposal today.
          </p>

          {/* Login Options */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Choose Your Login Type</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-6">
              <Link to="/citizen-login">
                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border-2 border-transparent hover:border-primary-500 cursor-pointer">
                  <User className="w-10 h-10 text-primary-600 mx-auto mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-2">Citizen Login</h4>
                  <p className="text-sm text-gray-600">For individuals disposing medicines</p>
                </div>
              </Link>
              <Link to="/collection-point-login">
                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border-2 border-transparent hover:border-teal-500 cursor-pointer">
                  <Building2 className="w-10 h-10 text-teal-600 mx-auto mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-2">Collection Point</h4>
                  <p className="text-sm text-gray-600">For pharmacies & hospitals</p>
                </div>
              </Link>
              <Link to="/admin-login">
                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border-2 border-transparent hover:border-indigo-500 cursor-pointer">
                  <Shield className="w-10 h-10 text-indigo-600 mx-auto mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-2">Admin Portal</h4>
                  <p className="text-sm text-gray-600">For administrators only</p>
                </div>
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-50 text-gray-500">or</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            {user ? (
              <Link to="/dashboard">
                <Button variant="primary" size="large">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/register">
                <Button variant="primary" size="large">
                  Create New Account
                </Button>
              </Link>
            )}
            <Link to="/map">
              <Button variant="outline" size="large">
                Explore Map
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;