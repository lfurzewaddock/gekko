import { useEffect, useState } from 'react';
import { useDependency } from '#core/hooks/use-dependency';
import container from '#ioc';
import { HttpGateway } from '#core/HttpGateway';

function Component() {
  const httpGateway = useDependency<HttpGateway>('HttpGateway');
  const [vm, setVm] = useState<any>(null);

  useEffect(() => {
    const abortCtrl = new AbortController();
    const { signal } = abortCtrl;

    httpGateway
      .get('/imports', { signal })
      .then((response) => response)
      .then((imports) => {
        setVm(imports);
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === 'AbortError') {
          console.error(error.message);
        } else {
          console.error('Fetch error:', error);
        }
      });
    return () => abortCtrl.abort('useEffect run cleanup');
  }, [httpGateway]);

  return (
    <>
      <div>Component</div>
      <div>
        <h2>API call response</h2>
        <pre>{JSON.stringify(vm, null, 2)}</pre>
      </div>
      <div>
        <h2>IoC Container Registration(s)</h2>
        <pre>{JSON.stringify(container.registrations, null, 2)}</pre>
      </div>
    </>
  );
}
export default Component;
