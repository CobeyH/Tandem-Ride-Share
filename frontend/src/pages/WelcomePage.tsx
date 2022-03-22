import * as React from "react";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import Header from "../components/Header";
import GroupList from "../components/Groups/GroupSelector";
import { useGroups } from "../firebase/database";

export default function WelcomePage() {
  const [user, loading] = useAuthState(auth);
  const [groups, loadingGroups] = useGroups();

  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");
  }, [user, loading]);

  useEffect(() => {
    if (groups && groups.length > 0) {
      navigate(`/group/${groups[0].id}`);
    }
  }, [groups, loadingGroups]);

  return (
    <>
      <Header />
      <GroupList />
    </>
  );
}
