import ProfileForm from "../components/setting/profileForm";
import KYCform from "../components/setting/KYCform";
export default function Profile() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ProfileForm />
      <KYCform />
    </div>
  )
};