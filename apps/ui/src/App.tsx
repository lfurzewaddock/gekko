import { DependencyProvider } from '#core/providers/Injection';
import container from '#ioc';
import Component from './Component';

function App() {
  return (
    <>
      <DependencyProvider container={container}>
        <div>Welcome to Gekko UI</div>
        <Component />
      </DependencyProvider>
    </>
  );
}

export default App;
