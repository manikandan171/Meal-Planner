// Password validation utility
export const validatePassword = (password) => {
  const errors = [];
  
  // Check minimum length
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  // Check for lowercase letters
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  // Check for special characters
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*()_+-=[]{}|;:,.<>?)');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Get password strength indicator
export const getPasswordStrength = (password) => {
  let strength = 0;
  
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength++;
  
  if (strength <= 2) return 'weak';
  if (strength <= 3) return 'medium';
  if (strength <= 4) return 'strong';
  return 'very-strong';
};

// Get strength color
export const getStrengthColor = (strength) => {
  switch (strength) {
    case 'weak': return '#dc2626';
    case 'medium': return '#f59e0b';
    case 'strong': return '#10b981';
    case 'very-strong': return '#059669';
    default: return '#6b7280';
  }
}; 