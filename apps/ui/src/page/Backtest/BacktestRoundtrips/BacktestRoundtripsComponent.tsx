import clsx from 'clsx';

import { type BacktestPresenterVm } from '#page/Backtest/BacktestPresenter';

const TableCellFinance = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string | string[];
}) => (
  <div className="flex justify-center">
    <div className={clsx([className, 'w-1/2'])}>{children}</div>
  </div>
);

function BacktestRoundtripsComponent({
  children,
}: {
  children: BacktestPresenterVm['roundtripsReport'];
}) {
  return (
    <>
      <h2 className="text-3xl/20">Roundtrips</h2>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr className="uppercase">
              <th>Entry at (UTC)</th>
              <th>Exit at (UTC)</th>
              <th>Exposure</th>
              <th>
                <TableCellFinance className="text-center">
                  Entry balance
                </TableCellFinance>
              </th>
              <th>
                <TableCellFinance className="text-center">
                  Exit balance
                </TableCellFinance>
              </th>
              <th>
                <TableCellFinance className="text-center">
                  P&amp;L
                </TableCellFinance>
              </th>
              <th>
                <TableCellFinance className="text-center">
                  Profit
                </TableCellFinance>
              </th>
            </tr>
          </thead>
          <tbody>
            {children?.map((dataSetRange) => (
              <tr key={dataSetRange.id}>
                <td>
                  <p>{dataSetRange.entryAt}</p>
                </td>
                <td>
                  <p>{dataSetRange.exitAt}</p>
                </td>
                <td>
                  <p>{dataSetRange.duration}</p>
                </td>
                <td>
                  <TableCellFinance className="text-right">
                    {dataSetRange.entryBalance}
                  </TableCellFinance>
                </td>
                <td>
                  <TableCellFinance className="text-right">
                    {dataSetRange.exitBalance}
                  </TableCellFinance>
                </td>
                <td
                  className={clsx(
                    {
                      'text-red-400': dataSetRange.isNegativePnl,
                      'text-green-400': !dataSetRange.isNegativePnl,
                    },
                    'md-text-right',
                  )}
                >
                  <TableCellFinance className="text-right badge badge-outline">
                    {dataSetRange.pnl}
                  </TableCellFinance>
                </td>
                <td
                  className={clsx(
                    {
                      'text-red-400': dataSetRange.isNegativeProfit,
                      'text-green-400': !dataSetRange.isNegativeProfit,
                    },
                    'md-text-center',
                  )}
                >
                  <TableCellFinance className="text-right badge badge-outline">
                    {dataSetRange.profit}
                  </TableCellFinance>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default BacktestRoundtripsComponent;
