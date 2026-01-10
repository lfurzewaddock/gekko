import type { ViewModel } from '#page/Backtest/BacktestPresenter';

function ScansetTableComponent({ children }: { children: ViewModel }) {
  return (
    <>
      <h2 className="text-3xl/20">Select a dataset</h2>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr className="uppercase">
              <th></th>
              <th>exchange</th>
              <th>currency</th>
              <th>asset</th>
              <th>from</th>
              <th>to</th>
              <th>duration</th>
            </tr>
          </thead>
          <tbody>
            {children.map((dataSetRange) => {
              return (
                <tr key={dataSetRange.key}>
                  <td>
                    <label>
                      <input
                        id={dataSetRange.key}
                        name="dataSetRange"
                        onClick={(evt) => {
                          console.log('evt', evt);
                        }}
                        type="radio"
                        className="radio"
                      />
                    </label>
                  </td>
                  <td>{dataSetRange.exchange}</td>
                  <td>
                    <p>{dataSetRange.currency}</p>
                  </td>
                  <td>
                    <p>{dataSetRange.asset}</p>
                  </td>
                  <td>
                    <p>{dataSetRange.from}</p>
                  </td>
                  <td>
                    <p>{dataSetRange.to}</p>
                  </td>
                  <td>
                    <p>{dataSetRange.duration}</p>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default ScansetTableComponent;
