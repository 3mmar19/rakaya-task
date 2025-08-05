import React from 'react';

type AnimationType = 'pulse' | 'bounce' | 'fade-in' | 'fade-in-up' | 'slide-in-right';

interface AnimatedFeedbackProps {
  children: React.ReactNode;
  type: AnimationType;
  className?: string;
  duration?: number; // in milliseconds
  delay?: number; // in milliseconds
}

const AnimatedFeedback: React.FC<AnimatedFeedbackProps> = ({ 
  children, 
  type, 
  className = '', 
  duration = 300,
  delay = 0
}) => {
  // Create animation style based on type
  const getAnimationStyle = () => {
    const animationName = {
      'pulse': 'pulse',
      'bounce': 'bounce',
      'fade-in': 'fadeIn',
      'fade-in-up': 'fadeInUp',
      'slide-in-right': 'slideInRight'
    }[type];

    return {
      animation: `${animationName} ${duration}ms ease-out ${delay}ms both`,
    };
  };

  return (
    <div className={className} style={getAnimationStyle()}>
      {children}
    </div>
  );
};

export default AnimatedFeedback;
