import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Crown, Zap } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../context/ToastContext';
import { LoadingIndicator } from '../components/LoadingIndicator';

/**
 * Subscription page component
 * Displays subscription plans and handles subscription management
 */
export function Subscription() {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Mock subscription plans
  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Basic features for token creators',
      features: [
        '1 token project',
        '2 utility features',
        'Basic analytics',
        'Community support'
      ],
      limits: {
        projects: 1,
        features: 2,
        holders: 100
      },
      cta: 'Current Plan',
      disabled: true
    },
    {
      id: 'creator',
      name: 'Creator',
      price: '$49',
      period: 'per month',
      description: 'Everything you need for serious token projects',
      features: [
        '5 token projects',
        'Unlimited utility features',
        'Advanced analytics',
        'Priority support',
        'Custom branding'
      ],
      limits: {
        projects: 5,
        features: Infinity,
        holders: 10000
      },
      cta: 'Upgrade',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$199',
      period: 'per month',
      description: 'For professional token creators and DAOs',
      features: [
        'Unlimited token projects',
        'Unlimited utility features',
        'Advanced analytics',
        'Dedicated support',
        'Custom branding',
        'API access',
        'Custom integrations'
      ],
      limits: {
        projects: Infinity,
        features: Infinity,
        holders: Infinity
      },
      cta: 'Contact Sales'
    }
  ];

  // Get current plan
  const currentPlan = plans.find(plan => plan.id === (userProfile?.subscription || 'free')) || plans[0];

  /**
   * Handle subscription upgrade
   */
  const handleSubscribe = async (plan) => {
    if (plan.id === currentPlan.id) {
      return;
    }
    
    setSelectedPlan(plan);
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`Successfully upgraded to ${plan.name} plan!`);
      navigate('/');
    } catch (error) {
      toast.error('Failed to process subscription');
    } finally {
      setIsLoading(false);
      setSelectedPlan(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-text-secondary hover:text-text-primary mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
        
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Subscription Plans
        </h1>
        <p className="text-text-secondary">
          Choose the right plan for your token utility needs
        </p>
      </div>

      {/* Pricing Table */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            className={`
              card relative border-2 transition-all
              ${plan.popular ? 'border-primary shadow-lg' : 'border-gray-200'}
              ${selectedPlan?.id === plan.id ? 'ring-2 ring-primary' : ''}
            `}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 text-xs font-medium rounded-bl-lg rounded-tr-lg">
                Popular
              </div>
            )}
            
            <div className="p-6">
              <h3 className="text-xl font-bold text-text-primary mb-1">
                {plan.name}
              </h3>
              
              <div className="flex items-end mb-4">
                <span className="text-3xl font-bold text-text-primary">{plan.price}</span>
                <span className="text-text-secondary ml-1">{plan.period}</span>
              </div>
              
              <p className="text-text-secondary mb-6">
                {plan.description}
              </p>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="ml-2 text-text-primary">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button
                onClick={() => handleSubscribe(plan)}
                disabled={isLoading || plan.disabled || selectedPlan}
                className={`
                  w-full py-3 px-4 rounded-md font-medium transition-colors
                  ${plan.popular 
                    ? 'bg-primary text-white hover:bg-primary/90' 
                    : 'bg-gray-100 text-text-primary hover:bg-gray-200'}
                  ${(isLoading || plan.disabled || selectedPlan) && 'opacity-50 cursor-not-allowed'}
                `}
              >
                {isLoading && selectedPlan?.id === plan.id ? (
                  <span className="flex items-center justify-center">
                    <Zap className="w-4 h-4 animate-spin mr-2" />
                    Processing...
                  </span>
                ) : (
                  <>
                    {plan.id === currentPlan.id ? (
                      <span className="flex items-center justify-center">
                        <Crown className="w-4 h-4 mr-2" />
                        Current Plan
                      </span>
                    ) : (
                      plan.cta
                    )}
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Feature Comparison */}
      <div className="card mb-12">
        <h2 className="text-xl font-semibold text-text-primary mb-6">
          Feature Comparison
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium text-text-secondary">Feature</th>
                {plans.map(plan => (
                  <th key={plan.id} className="text-center py-3 px-4 font-medium text-text-secondary">
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3 px-4 text-text-primary">Token Projects</td>
                {plans.map(plan => (
                  <td key={plan.id} className="text-center py-3 px-4 text-text-primary">
                    {plan.limits.projects === Infinity ? 'Unlimited' : plan.limits.projects}
                  </td>
                ))}
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 text-text-primary">Utility Features</td>
                {plans.map(plan => (
                  <td key={plan.id} className="text-center py-3 px-4 text-text-primary">
                    {plan.limits.features === Infinity ? 'Unlimited' : plan.limits.features}
                  </td>
                ))}
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 text-text-primary">Token Holders</td>
                {plans.map(plan => (
                  <td key={plan.id} className="text-center py-3 px-4 text-text-primary">
                    {plan.limits.holders === Infinity ? 'Unlimited' : `Up to ${plan.limits.holders.toLocaleString()}`}
                  </td>
                ))}
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 text-text-primary">Analytics</td>
                {plans.map(plan => (
                  <td key={plan.id} className="text-center py-3 px-4 text-text-primary">
                    {plan.id === 'free' ? 'Basic' : 'Advanced'}
                  </td>
                ))}
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 text-text-primary">Support</td>
                {plans.map(plan => (
                  <td key={plan.id} className="text-center py-3 px-4 text-text-primary">
                    {plan.id === 'free' ? 'Community' : plan.id === 'creator' ? 'Priority' : 'Dedicated'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 text-text-primary">API Access</td>
                {plans.map(plan => (
                  <td key={plan.id} className="text-center py-3 px-4 text-text-primary">
                    {plan.id === 'enterprise' ? (
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-text-primary mb-6">
          Frequently Asked Questions
        </h2>
        
        <div className="space-y-4">
          <div className="card">
            <h3 className="text-lg font-medium text-text-primary mb-2">
              Can I upgrade or downgrade my plan later?
            </h3>
            <p className="text-text-secondary">
              Yes, you can upgrade or downgrade your subscription plan at any time. Changes will be applied immediately, and your billing will be prorated accordingly.
            </p>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-medium text-text-primary mb-2">
              What happens if I exceed my plan limits?
            </h3>
            <p className="text-text-secondary">
              If you exceed your plan limits, you'll be notified and given the option to upgrade to a higher tier. Your existing projects and features will continue to work, but you won't be able to create new ones until you upgrade or reduce usage.
            </p>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-medium text-text-primary mb-2">
              Do you offer custom plans for large organizations?
            </h3>
            <p className="text-text-secondary">
              Yes, we offer custom enterprise plans for large organizations with specific needs. Contact our sales team to discuss your requirements and get a tailored solution.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Subscription;

