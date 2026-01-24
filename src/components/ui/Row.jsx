

export const Row = ({ left, right}) => {
  return (
     <div className="row">
      <div>{left}</div>
      <div className="rowRight">{right}</div>
    </div>
  )
}

export default Row