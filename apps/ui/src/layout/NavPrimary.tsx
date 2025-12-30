import NavMenuBtn from '#layout/NavMenuBtn';

function NavPrimary() {
  return (
    <div className="w-full max-w-7/10 h-full">
      <div className="flex flex-row justify-evenly h-full">
        <NavMenuBtn>Home</NavMenuBtn>
        <NavMenuBtn>Live Gekkos</NavMenuBtn>
        <NavMenuBtn>Backtest</NavMenuBtn>
        <NavMenuBtn>Local Data</NavMenuBtn>
        <NavMenuBtn>Config</NavMenuBtn>
        <NavMenuBtn>Documentation</NavMenuBtn>
      </div>
    </div>
  );
}

export default NavPrimary;
