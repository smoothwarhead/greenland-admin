import "./back-btn.scss";
import { HiArrowLongLeft } from "react-icons/hi2";


const BackButton = ({ action }) => {
  return (
    <div className="back-btn" onClick={action}>
        <HiArrowLongLeft />
        <span>Back</span>
    </div>
  )
}

export default BackButton