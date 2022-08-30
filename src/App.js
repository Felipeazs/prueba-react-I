import './App.css';
import MyApi from './components/MyApi';
import Navbar from './components/UI/Navbar';

function App() {
	return (
		<div>
			<Navbar title='INDICADORES ECONÓMICOS' />
			<MyApi />
		</div>
	);
}

export default App;
