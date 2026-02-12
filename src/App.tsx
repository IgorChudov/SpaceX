import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { HomePage } from './pages/HomePage/HomePage';


const App = () => {

  return (
    <MantineProvider> 
      <HomePage/>
    </MantineProvider>
  )
}
    
export default App;



