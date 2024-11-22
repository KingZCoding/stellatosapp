'use client';

import ProfileForm from './ProfileForm';
import PasswordForm from './PasswordForm';
import AvatarUpload from './AvatarUpload';
import '../../styles/profile.css';

export default function ProfilePage() {
  return (
    <div className="profile-container">
      <h1>Your Profile</h1>
      <ProfileForm />
      <AvatarUpload />
      <PasswordForm />
    </div>
  );
}
