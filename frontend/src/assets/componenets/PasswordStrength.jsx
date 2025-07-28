import React from 'react';
import { validatePassword, getPasswordStrength, getStrengthColor } from '../../utils/passwordValidation';
import './PasswordStrength.css';

const PasswordStrength = ({ password, showValidation = true }) => {
  const validation = validatePassword(password);
  const strength = getPasswordStrength(password);
  const strengthColor = getStrengthColor(strength);

  if (!password) return null;

  return (
    <div className="password-strength">
      <div className="strength-bar">
        <div 
          className="strength-fill"
          style={{ 
            width: `${(strength === 'weak' ? 25 : strength === 'medium' ? 50 : strength === 'strong' ? 75 : 100)}%`,
            backgroundColor: strengthColor 
          }}
        ></div>
      </div>
      
      <div className="strength-text" style={{ color: strengthColor }}>
        {strength === 'weak' && 'Weak'}
        {strength === 'medium' && 'Medium'}
        {strength === 'strong' && 'Strong'}
        {strength === 'very-strong' && 'Very Strong'}
      </div>
      
      {showValidation && (
        <div className="validation-requirements">
          <h4>Password Requirements:</h4>
          <ul>
            <li className={password.length >= 8 ? 'valid' : 'invalid'}>
              ✓ At least 8 characters
            </li>
            <li className={/[a-z]/.test(password) ? 'valid' : 'invalid'}>
              ✓ At least one lowercase letter
            </li>
            <li className={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? 'valid' : 'invalid'}>
              ✓ At least one special character
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default PasswordStrength; 