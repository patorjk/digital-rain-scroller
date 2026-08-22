import type {MatrixCell} from "@/components/digital-rain/dr-utils.ts";
import {MatrixCellDisplay} from "@/components/digital-rain/MatrixCellDisplay.tsx";

interface MatrixRowProps {
  row: MatrixCell[]
}

export const MatrixRow = ({row}: MatrixRowProps) => {
  return <div style={{display:'flex'}}>{row.map((item, index) => <MatrixCellDisplay cell={item} key={index} />)}</div>
}