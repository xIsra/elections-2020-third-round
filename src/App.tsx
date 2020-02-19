import React from 'react';
import './App.scss';
import WheelOfFortune from './lib/WheelOfFortune';

function App() {
  return (
    <div className="app" dir="rtl">
      <header className="header">
        בחירות 2020 סבב ג - איך בוחרים במי לבחור בהצבעה?
      </header>
      <section className="main">
        <WheelOfFortune />
      </section>
    </div>
  );
}

export default App;
