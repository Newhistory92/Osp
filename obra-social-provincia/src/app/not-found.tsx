import React from 'react';
import "./styles/GlobalNotFound.scss"
import NumberTicker from './components/Statistic/number-ticker';
const GlobalNotFound: React.FC = () => {
  
  return (
    <div className="error">
      <div className="container-floud">
        <div className="col-xs-12 ground-color text-center">
          <div className="container-error-404">
            <div className="clip"><div className="shadow"><span className="digit "> <NumberTicker value={4}/> </span></div></div>
            <div className="clip"><div className="shadow"><span className="digit ">0</span></div></div>
            <div className="clip"><div className="shadow"><span className="digit"><NumberTicker value={4}/> </span></div></div>
            <div className="msg">OH!<span className="triangle"></span></div>
          </div>
          <h2 className="h1">Sorry! Page not found</h2>
        </div>
      </div>
    </div>
  );
};

export default GlobalNotFound;
