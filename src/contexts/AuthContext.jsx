import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabase.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [org, setOrg] = useState(null);
  const [orgRole, setOrgRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) loadProfile(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) loadProfile(session.user.id);
      else {
        setProfile(null);
        setOrg(null);
        setOrgRole(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadProfile(userId) {
    try {
      // Get profile
      const { data: prof } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      setProfile(prof);

      // Get org membership
      const { data: membership } = await supabase
        .from("org_members")
        .select("role, organizations(*)")
        .eq("user_id", userId)
        .limit(1)
        .single();

      if (membership) {
        setOrg(membership.organizations);
        setOrgRole(membership.role);
      }
    } catch (e) {
      console.error("Error loading profile:", e);
    } finally {
      setLoading(false);
    }
  }

  async function signUp(email, password, fullName) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) throw error;
    return data;
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }

  async function signOut() {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setProfile(null);
    setOrg(null);
    setOrgRole(null);
  }

  async function createOrg(name) {
    const { data: newOrg, error: orgErr } = await supabase
      .from("organizations")
      .insert({ name, plan: "starter" })
      .select()
      .single();
    if (orgErr) throw orgErr;

    const { error: memErr } = await supabase
      .from("org_members")
      .insert({ org_id: newOrg.id, user_id: user.id, role: "owner" });
    if (memErr) throw memErr;

    setOrg(newOrg);
    setOrgRole("owner");
    return newOrg;
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        org,
        orgRole,
        loading,
        signUp,
        signIn,
        signOut,
        createOrg,
        reload: () => user && loadProfile(user.id),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
