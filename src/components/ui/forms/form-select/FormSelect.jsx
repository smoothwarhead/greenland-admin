import { useState, useRef, useEffect } from "react";
import "./form-select.scss";


const FormSelect = (props) => {

    const { options, label, placeholder, cName } = props;
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const [dropUp, setDropUp] = useState(false);
  const dropdownRef = useRef(null);



  const toggleDropdown = () => {
    if (!open) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const spaceBelow = windowHeight - rect.bottom;
      const spaceAbove = rect.top;

      // If there’s not enough space below, open upwards
      setDropUp(spaceBelow < 200 && spaceAbove > spaceBelow);
    }
    setOpen(!open);
  };

  const handleSelect = (option) => {
    setSelected(option);
    setOpen(false);
  };

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);




  return (
    <div className={`custom-select ${cName}`} ref={dropdownRef}>


        <label>{label}</label> 
      <div className={`select-header ${open ? "open" : ""}`} onClick={toggleDropdown}>

       { selected ?
        <span>{selected}</span>
        :
        <span className="placeholder">{placeholder}</span>
       }
        <svg
          className={`arrow ${open ? "rotate" : ""}`}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path d="M7 10l5 5 5-5" stroke="#444" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {open && (
        <div className={`options ${dropUp ? "drop-up" : "drop-down"}`}>
          {options.map((option) => (
            <div key={option} className="option" onClick={() => handleSelect(option)}>
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FormSelect;
