import { DependencyProvider } from '#core/providers/Injection';
import container from '#ioc';
import Layout from '#layout/Layout.tsx';

function App() {
  return (
    <DependencyProvider container={container}>
      <Layout />
    </DependencyProvider>
  );
}

export default App;
