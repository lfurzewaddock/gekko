import {
  BacktestPresenter,
  type BacktestPresenterVm,
} from '#page/Backtest/BacktestPresenter';

function ScansetTableComponent({
  presenter,
  children,
}: {
  presenter: BacktestPresenter;
  children: BacktestPresenterVm['scansets'];
}) {
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
                        onClick={() => {
                          const { asset, currency, exchange, from, to } =
                            dataSetRange;
                          presenter.handleScansetSelectChange({
                            asset,
                            currency,
                            exchange,
                            from,
                            to,
                          });
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
                    <p>{dataSetRange.fromLabel}</p>
                  </td>
                  <td>
                    <p>{dataSetRange.toLabel}</p>
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
