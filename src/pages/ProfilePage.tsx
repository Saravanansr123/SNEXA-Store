import { useState, useEffect } from 'react';
import { User, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface ProfilePageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export const ProfilePage = ({ onNavigate }: ProfilePageProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    setLoading(true);
    const profileRef = doc(db, 'user_profiles', user.uid);
    const profileSnap = await getDoc(profileRef);
    if (profileSnap.exists()) {
      const data = profileSnap.data();
      const address = data.default_address as Record<string, string>;
      setFormData({
        full_name: data.full_name || '',
        phone: data.phone || '',
        address: address?.address || '',
        city: address?.city || '',
        state: address?.state || '',
        pincode: address?.pincode || '',
      });
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    await setDoc(doc(db, 'user_profiles', user.uid), {
      id: user.uid,
      full_name: formData.full_name,
      phone: formData.phone,
      default_address: {
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      },
      updated_at: new Date().toISOString(),
    }, { merge: true });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <p className="text-xl text-white/70 mb-4">
            Please sign in to view your profile
          </p>
          <button
            onClick={() => onNavigate('login')}
            className="px-6 py-3 bg-rose-400 text-black rounded-full
              hover:bg-rose-500 transition"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12 mt-20">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <User size={32} className="text-rose-400" />
          <h1 className="text-3xl font-light text-white">
            My Profile
          </h1>
        </div>

        <div
          className="bg-black/60 backdrop-blur-xl border border-white/10
          rounded-2xl p-8 shadow-2xl"
        >
          {loading ? (
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-12 bg-white/10 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Email */}
              <div>
                <label className="block text-sm text-white/70 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full px-4 py-3 rounded-lg
                    bg-white/5 border border-white/10
                    text-white/50 cursor-not-allowed"
                />
                <p className="text-xs text-white/40 mt-1">
                  Email cannot be changed
                </p>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm text-white/70 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({ ...formData, full_name: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg
                    bg-black/50 border border-white/10
                    text-white focus:ring-2 focus:ring-rose-400 outline-none"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm text-white/70 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg
                    bg-black/50 border border-white/10
                    text-white focus:ring-2 focus:ring-rose-400 outline-none"
                />
              </div>

              {/* Address */}
              <div className="pt-6 border-t border-white/10">
                <h3 className="text-lg font-medium text-white mb-4">
                  Default Shipping Address
                </h3>

                <div className="space-y-4">
                  <textarea
                    rows={3}
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg
                      bg-black/50 border border-white/10
                      text-white focus:ring-2 focus:ring-rose-400 outline-none"
                  />

                  <div className="grid md:grid-cols-3 gap-4">
                    {['city', 'state', 'pincode'].map((field) => (
                      <input
                        key={field}
                        placeholder={field}
                        value={(formData as any)[field]}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [field]: e.target.value,
                          })
                        }
                        className="px-4 py-3 rounded-lg
                          bg-black/50 border border-white/10
                          text-white focus:ring-2 focus:ring-rose-400 outline-none"
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <button
                type="submit"
                disabled={saving || saved}
                className="w-full py-4 rounded-full bg-[#ff073a] shadow-[0_0_6px_rgba(255,7,58,0.45)] text-white
                  hover:bg-green-500 transition font-medium
                  flex items-center justify-center gap-2
                  disabled:opacity-50"
              >
                {saved ? (
                  <>
                    <Save size={20} />
                    Saved Successfully
                  </>
                ) : saving ? (
                  'Saving...'
                ) : (
                  <>
                    <Save size={20} />
                    Save Changes
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
