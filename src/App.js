import './App.css'
import MyApi from './components/MyApi'
import Navbar from './components/UI/Navbar'
import Footer from './components/UI/Footer'

function App() {
    return (
        <div className="home">
            <Navbar />
            <MyApi />
            <Footer />
        </div>
    )
}

export default App
