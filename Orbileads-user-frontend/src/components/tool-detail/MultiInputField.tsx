import type { ToolFieldRecord } from '../../types/tool'
import ToolFormField from './ToolFormField'

type MultiInputFieldProps = {
  field: ToolFieldRecord
  value: string | number | boolean
  error?: string
  onChange: (fieldName: string, value: string | number | boolean) => void
}

function MultiInputField(props: MultiInputFieldProps) {
  return <ToolFormField {...props} />
}

export default MultiInputField
