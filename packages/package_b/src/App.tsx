import { Button } from '@lerna_monorepo/package_a';
import '@lerna_monorepo/package_a/dist/package_a.css';

function App() {

  return (
    <>
      <h1>This is the consumer project</h1>
      <Button />
    </>
  )
}

export default App
