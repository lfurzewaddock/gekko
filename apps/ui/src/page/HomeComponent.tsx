import gekko from '#asset/static/gekko.jpg';

function PageHome() {
  return (
    <div className="flex flex-col justify-center w-full">
      <div className="flex flex-row items-center">
        <div className="flex flex-col flex-1 space-y-8">
          <h1 className="text-5xl/20">Gekko</h1>
          <p className="text-base">
            Gekko is a Bitcoin trading bot and backtesting platform that
            connects to popular Bitcoin exchanges. It is written in javascript
            and runs on nodejs.
          </p>
          <p className="text-base">
            <a
              className="text-blue-500 underline"
              href="https://gekko.wizb.it"
              target="_blank"
            >
              Find out more
            </a>
            .
          </p>
          <p className="text-base">
            <em>
              Gekko is 100% free (open source), if you paid for this you have
              been scammed.
            </em>
          </p>
        </div>
        <div className="space-y-8 flex flex-col items-center">
          <img width="300px" src={gekko}></img>
          <p className="text-base">
            <em>The most valuable commodity I know of is information.</em>
          </p>
        </div>
      </div>
    </div>
  );
}
export default PageHome;
