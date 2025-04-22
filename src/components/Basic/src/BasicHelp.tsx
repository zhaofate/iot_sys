import React, { CSSProperties, ReactNode } from 'react';
import { Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { getPopupContainer } from '@/utils';
import { isString, isArray } from '@/utils/is';
import { useDesign } from '@/hooks/web/useDesign';

interface BasicHelpProps {
  /**
   * Help text max-width
   * @default: 600px
   */
  maxWidth?: string;
  /**
   * Whether to display the serial number
   * @default: false
   */
  showIndex?: boolean;
  /**
   * Help text font color
   * @default: #ffffff
   */
  color?: string;
  /**
   * Help text font size
   * @default: 14px
   */
  fontSize?: string;
  /**
   * Help text placement
   * @default: right
   */
  placement?: 'top' | 'left' | 'right' | 'bottom' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'leftTop' | 'leftBottom' | 'rightTop' | 'rightBottom';
  /**
   * Help text list
   */
  text: string[] | string;
  children?: ReactNode;
}

const BasicHelp: React.FC<BasicHelpProps> = ({
  maxWidth = '600px',
  showIndex = false,
  color = '#ffffff',
  fontSize = '14px',
  placement = 'right',
  text,
  children,
}) => {
  const { prefixCls } = useDesign('basic-help');

  const getTooltipStyle = React.useMemo<CSSProperties>(() => ({ color, fontSize }), [color, fontSize]);

  const getOverlayStyle = React.useMemo<CSSProperties>(() => ({ maxWidth }), [maxWidth]);

  const renderTitle = () => {
    if (isString(text)) {
      return <p>{text}</p>;
    }

    if (isArray(text)) {
      return text.map((textItem, index) => (
        <p key={textItem}>
          {showIndex ? `${index + 1}. ` : ''}
          {textItem}
        </p>
      ));
    }
    return null;
  };

  return (
    <Tooltip
      overlayClassName={`${prefixCls}__wrap`}
      title={<div style={getTooltipStyle}>{renderTitle()}</div>}
      autoAdjustOverflow={true}
      overlayStyle={getOverlayStyle}
      placement={placement}
      getPopupContainer={getPopupContainer}
    >
      <span className={prefixCls}>
        {children || <InfoCircleOutlined />}
      </span>
    </Tooltip>
  );
};

export default BasicHelp;
