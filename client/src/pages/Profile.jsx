import ProfileCard from "../components/profile/ProfileCard";
import PersonalInfo from "../components/profile/PersonalInfo";
import AccountSettings from "../components/profile/AccountSettings";
import { UserRound } from "lucide-react";

function Profile() {
  return (
    <section>

      <h1 className="text-3xl font-bold text-theme mb-8">
        Profile
      </h1>

      {/* Top */}
      <div className="grid lg:grid-cols-3 gap-8">

        <ProfileCard />

        <div className="lg:col-span-2">
          <PersonalInfo />
        </div>

      </div>

      {/* Bottom */}
      <div className="mt-8">
        <AccountSettings />
      </div>

    </section>
  );
}

export default Profile;