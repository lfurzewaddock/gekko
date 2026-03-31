import NavComponent from '#layout/NavComponent';
import Header from '#layout/HeaderComponent.tsx';
import Footer from '#layout/FooterComponent.tsx';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen w-full items-center">
      <header className="flex flex-col justify-center items-center h-[100] w-full">
        <Header />
      </header>
      <nav className="flex flex-col justify-center items-center w-full bg-gray-200">
        <NavComponent />
      </nav>
      <main className="w-full max-w-8/10 pt-8 pb-8">{children}</main>
      <footer className="flex flex-col justify-center items-center w-full h-[180] sticky top-[100vh] bg-gray-100">
        <Footer />
      </footer>
    </div>
  );
}

export default Layout;
