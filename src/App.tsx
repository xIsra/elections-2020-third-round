import React, { Component } from 'react'
import './App.scss';
import WheelOfFortune from './lib/WheelOfFortune';
import { Party } from './lib/types/Party';
import { getPartyList } from './lib/html-parser';
import { shuffleArray } from './lib/helper';

const items: Party[] = [
  { partyName: "כחול לבן", partyId: "1" },
  { partyName: "הליכוד", partyId: "2" },
  { partyName: "הרשימה המשותפת", partyId: "3" },
  { partyName: "העבודה-גשר-מרצ", partyId: "4" },
  { partyName: "ש\"ס", partyId: "5" },
  { partyName: "יהדות התורה", partyId: "6" },
  { partyName: "ישראל ביתנו", partyId: "7" },
  { partyName: "ימינה", partyId: "8" },
  { partyName: "עוצמה יהודית", partyId: "9" },
  { partyName: "אדום לבן", partyId: "10" },
  { partyName: "אני ואתה", partyId: "11" },
  { partyName: "הברית המשותפת", partyId: "12" },
  { partyName: "דעם", partyId: "13" },
  { partyName: "זכויותינו בקולנו", partyId: "14" },
  { partyName: "החזון", partyId: "15" },
  { partyName: "כבוד האדם", partyId: "16" },
  { partyName: "כח להשפיע", partyId: "17" },
  { partyName: "הלב היהודי", partyId: "18" },
  { partyName: "מנהיגות חברתית", partyId: "19" },
  { partyName: "מפלגת הגוש התנ\"כי", partyId: "20" },
  { partyName: "משפט צדק", partyId: "21" },
  { partyName: "מתקדמת", partyId: "22" },
  { partyName: "סדר חדש", partyId: "23" },
  { partyName: "עוצמה ליברלית-כלכלית", partyId: "24" },
  { partyName: "הפיראטים", partyId: "25" },
  { partyName: "פעולה לישראל", partyId: "26" },
  { partyName: "קול הנשים", partyId: "27" },
  { partyName: "קמ\"ה", partyId: "28" },
  { partyName: "שמע", partyId: "29" },
];

function getParty(partyId: string): Party | undefined {
  return items.find((party) => party.partyId === partyId);
}

type AppState = {
  selected?: string
};

export default class App extends Component {
  state: AppState = {

  }
  handleSelected = (partyId: string) => {
    this.setState({
      selected: partyId
    })
  }
  render() {
    const party = this.state.selected ? getParty(this.state.selected) : null;
    return (
      <div className="app" dir="rtl">
        <header className="header">
          בחירות 2020 סבב ג - איך בוחרים במי לבחור בהצבעה?
      </header>
        <section className="main">
          {party ?
            <div className="ending">
              <div>
                <h3 className="title">בחרת: <span className="party">{party.partyName}</span></h3>
                <p className="phrase">מזל טוב יא שמאלן מסריח</p>
                <button onClick={() => { }}>לא מרוצה</button>
              </div>
            </div>
            :
            <WheelOfFortune
              items={shuffleArray(items)}
              onSelected={this.handleSelected} />
          }
        </section>
      </div>
    )
  }
}


