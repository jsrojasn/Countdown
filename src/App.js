import "./App.css";
import AppContext, { useAppContext } from "./AppContext";
import Timer from "./components/timer";

function App() {
  const context = useAppContext();

  return (
    <AppContext.Provider value={context}>
      <div className="App">
        <Timer />
      </div>
    </AppContext.Provider>
  );
}

export default App;
