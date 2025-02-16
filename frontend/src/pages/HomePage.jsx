import { useAuthStore } from "../store/authUser";

const HomePage = () => {
  const { logout } = useAuthStore();

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
  };

  return (
    <>
      <div className="cursor-pointer" onClick={handleLogout}>
        Logout
      </div>
    </>
  );
};

export default HomePage;
