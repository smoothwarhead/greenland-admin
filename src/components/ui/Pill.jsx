import { cx } from "../../methods";



const Pill = ({ tone = "neutral", children }) => {
  return (
    <span className={cx("pill", tone)}>{children}</span>
  )
}

export default Pill;