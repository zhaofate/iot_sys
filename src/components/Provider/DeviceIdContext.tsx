import React, { createContext, useContext, useState } from 'react';

// 创建 Context
const DeviceIdContext = createContext<{
  deviceId: string | null;
  setDeviceId: (deviceId: string) => void;
}>({
  deviceId: null,
  setDeviceId: () => {},
});

// 自定义 Hook，方便在组件中使用 Context
export const useDeviceId = () => useContext(DeviceIdContext);

// Provider 组件
export const DeviceIdProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [deviceId, setDeviceId] = useState<string | null>(null);

  return (
    <DeviceIdContext.Provider value={{ deviceId, setDeviceId }}>
      {children}
    </DeviceIdContext.Provider>
  );
};
