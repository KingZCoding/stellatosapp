'use client';

import { useState } from 'react';

export default function AvatarUpload() {
  const [avatar, setAvatar] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleAvatarChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleAvatarSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!avatar) {
      setErrorMessage('Please select an avatar to upload.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('avatar', avatar);

      const response = await fetch('/api/profile/avatar', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Failed to upload avatar.');
        return;
      }

      setSuccessMessage('Avatar updated successfully!');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <form onSubmit={handleAvatarSubmit}>
      <div className="form-group">
        <label htmlFor="avatar">Upload Avatar</label>
        <input type="file" id="avatar" onChange={handleAvatarChange} />
      </div>
      <button type="submit" className="save-button">
        Upload Avatar
      </button>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </form>
  );
}
