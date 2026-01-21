import { useNavigate } from "react-router-dom";

import { setPendingContext } from "../../app/ContextSession";
import "./farm-selection.scss";
import { FARMS, STORES } from "../../app/orgMap";
import LOGO from "../../assets/logos/G-LOGO-CLEAN-DARK.png";
import { useState } from "react";
import { farmSelectData } from "./farm-select-data";
import { MdArrowRight } from "react-icons/md";
import { IoIosArrowRoundForward } from "react-icons/io";
import { FaStore } from "react-icons/fa6";
import { useData } from "../../context/DataContext";

const FarmSelection = () => {
  const nav = useNavigate();

  const [openIndex, setOpenIndex] = useState(0);

  const { setActiveContextState } = useData();

  const choose = (type, id, name) => {
    const payload  = { type, id, name};
    setPendingContext(payload);

    setActiveContextState(payload);

    nav("/login", { replace: true }); //go to login after selecting
  };

  return (
    <div className="farm-select-page">
      <div className="farm-header">
        <div className="logo-con">
          <div className="logo">
            <img src={LOGO} alt="greenland-logo" />
          </div>
          <span>Greenland Enterprise</span>
        </div>
      </div>

      <div className="farm-select-inner">
        <h2>Choose where you want to work</h2>
        <p>Select a farm or a store. You’ll log in next.</p>

        <div className="farm-select-grid">
          <div className="farm-select-grid-btns">
            {farmSelectData.map((f, index) => (
              <div
                className={`farm-select-btn ${openIndex === index ? "selected" : ""}`}
                key={index}
                onClick={() => setOpenIndex(index)}
              >
                {f.group}
              </div>
            ))}
          </div>

          <div className="farm-select-grid-content">
            {farmSelectData[openIndex].id === "farm" ? (
              <div className="grid-content">
                {farmSelectData[openIndex].farms.map((f, index) => (
                  <div className="farm" key={index} onClick={() => choose("farm", f.id,f.name)}>
                    <div className="farm-img">
                      <img src={f.img} alt={f.id} />
                    </div>
                    <div className="farm-name">
                      <span>{f.name}</span>
                      <IoIosArrowRoundForward />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid-content">
                {farmSelectData[openIndex].stores.map((f, index) => (
                  <div className="store" key={index} onClick={() => choose("store", f.id)}>
                    <div className="store-img">
                      <FaStore />
                    </div>
                    <div className="store-name">
                      <span>{f.name}</span>
                      <IoIosArrowRoundForward />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmSelection;
