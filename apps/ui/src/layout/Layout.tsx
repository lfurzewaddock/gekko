import Component from '#Component';
import NavPrimary from '#layout/NavPrimary.tsx';
import Header from '#layout/Header.tsx';
import Footer from '#layout/Footer.tsx';

function Layout() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <header className="flex flex-col justify-center items-center h-[100] w-full">
        <Header />
      </header>
      <nav className="flex flex-col justify-center items-center w-full h-[60] bg-gray-300">
        <NavPrimary />
      </nav>
      <main className="w-full max-w-7/10">
        <Component />
      </main>
      <footer className="flex flex-col justify-center items-center w-full h-[180] sticky top-[100vh] bg-gray-300">
        <Footer />
      </footer>
    </div>
  );
}

export default Layout;
