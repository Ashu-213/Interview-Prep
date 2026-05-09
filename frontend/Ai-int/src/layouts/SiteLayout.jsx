import { Outlet } from 'react-router';
import Navbar from '../components/site/Navbar';

const SiteLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default SiteLayout;