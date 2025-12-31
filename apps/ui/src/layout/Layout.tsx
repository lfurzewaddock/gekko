import NavComponent from '#layout/NavComponent';
import Header from '#layout/Header';
import Footer from '#layout/Footer';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <header className="flex flex-col justify-center items-center h-[100] w-full">
        <Header />
      </header>
      <nav className="flex flex-col justify-center items-center w-full bg-gray-300">
        <NavComponent />
      </nav>
      <main className="w-full max-w-7/10">{children}</main>
      <footer className="flex flex-col justify-center items-center w-full h-[180] sticky top-[100vh] bg-gray-300">
        <Footer />
      </footer>
    </div>
  );
}

export default Layout;
