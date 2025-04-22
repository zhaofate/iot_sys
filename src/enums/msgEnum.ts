export enum DataType {
  TEXT = 'text',
  IMAGE = 'image',
  AUDIO = 'audio',
  VIDEO = 'video',
}

export const DATA_TYPE_OPTIONS = [
  { value: DataType.TEXT, label: '文本' },
  { value: DataType.IMAGE, label: '图片' },
  { value: DataType.AUDIO, label: '音频' },
  { value: DataType.VIDEO, label: '视频' },
];

export enum ValueType {
  STRING = 'string',
  INTEGER = 'integer',
  DECIMAL = 'decimal',
  BOOLEAN = 'boolean',
  JSON = 'json',
}

export const VALUE_TYPE_OPTIONS = [
  { label: '字符串', value: ValueType.STRING},
  { label: '整数', value: ValueType.INTEGER },
  { label: '双精度小数', value: ValueType.DECIMAL},
  { label: '布尔值', value: ValueType.BOOLEAN},
  { label: 'JSON', value: ValueType.JSON},
];
