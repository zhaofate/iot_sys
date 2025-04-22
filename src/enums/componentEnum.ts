export enum ComponentDescriptorType {
  ENRICHMENT = 'ENRICHMENT',
  FILTER = 'FILTER',
  TRANSFORMATION = 'TRANSFORMATION',
  ACTION = 'ACTION',
  EXTERNAL = 'EXTERNAL',
  FLOW = 'FLOW',
}

export const COMPONENTS_DESCRIPTOR_TYPE_OPTIONS = [
  { value: ComponentDescriptorType.FILTER, label: '筛选器', bgcolor: '#D3E5F4', color: '#3A6B93' },
  {
    value: ComponentDescriptorType.ENRICHMENT,
    label: '属性集',
    bgcolor: '#CDE880',
    color: '#567300',
  },
  {
    value: ComponentDescriptorType.TRANSFORMATION,
    label: '变换',
    bgcolor: '#ACC7FF',
    color: '#2456BB',
  },
  { value: ComponentDescriptorType.ACTION, label: '动作', bgcolor: '#FBDAE9', color: '#B63A65' },
  { value: ComponentDescriptorType.EXTERNAL, label: '外部', bgcolor: '#FFC145', color: '#A74B00' },
  { value: ComponentDescriptorType.FLOW, label: '数据流', bgcolor: '#D1BBEF', color: '#7E0095' },
];
