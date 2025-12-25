import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import ContactForm from '../ContactForm';
import CostEstimator from './CostEstimator';
import { Truck } from '@/models/TruckTypes';

interface ProductDetailTabsProps {
  truck: Truck;
}

interface TabDefinition {
  value: string;
  label: string;
}

const ProductDetailTabs: React.FC<ProductDetailTabsProps> = ({ truck }) => {
  const getTabs = (): TabDefinition[] => {
    return [
      { value: 'description', label: 'Mô tả chi tiết' },
      { value: 'specs', label: 'Thông số kỹ thuật' },
      { value: 'contact', label: 'Liên hệ tư vấn' }
    ];
  };

  const tabs = getTabs();

  const renderSpecTable = (specs: Record<string, any>, title?: string) => {
    if (!specs || Object.keys(specs).length === 0) return null;

    // Mapping English keys to Vietnamese labels
    const displayNames: Record<string, string> = {
      // Thùng kín (closedBox)
      wallMaterial: 'Vật liệu vách thùng',
      floorMaterial: 'Vật liệu sàn',
      sideHeight: 'Chiều cao thành bên',
      doorType: 'Loại cửa',
      insulation: 'Cách nhiệt',
      reinforcement: 'Gia cường',
      // Thùng bạt (tarpaulinBox)
      frameStructure: 'Cấu trúc khung',
      tarpaulinMaterial: 'Vật liệu bạt',
      tarpaulinThickness: 'Độ dày bạt',
      frameType: 'Loại khung',
      sideAccess: 'Khả năng bốc dỡ',
      coverType: 'Loại mui phủ',
      roofType: 'Loại mui',
      // Thùng bảo ôn (insulatedBox)
      insulationMaterial: 'Vật liệu cách nhiệt',
      insulationThickness: 'Độ dày cách nhiệt',
      temperatureRange: 'Dải nhiệt độ',
      // Thùng lạnh (coolingBox)
      coolingUnit: 'Thiết bị làm lạnh',
      coolingCapacity: 'Công suất làm lạnh',
      minTemperature: 'Nhiệt độ tối thiểu',
      maxTemperature: 'Nhiệt độ tối đa',
      // Common fields
      material: 'Vật liệu',
      dimensions: 'Kích thước',
      length: 'Chiều dài',
      width: 'Chiều rộng',
      height: 'Chiều cao',
      capacity: 'Dung tích',
      fuelTankCapacity: 'Dung tích bình nhiên liệu',
      volume: 'Thể tích'
    };

    return (
      <div className="mb-6">
        {title && <h4 className="font-bold text-lg bg-gray-100 p-2 rounded mb-3">{title}</h4>}
        <table className="w-full border-collapse border">
          <tbody>
            {Object.entries(specs).map(([key, value]) => {
              if (!value || key === 'length' || key === 'width' || key === 'height') return null;
              const displayName = displayNames[key] || key;
              return (
                <tr key={key} className="border-b">
                  <td className="py-2 px-3 text-gray-600 w-1/3">{displayName}</td>
                  <td className="py-2 px-3 font-medium">{String(value)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <Tabs defaultValue="description" className="mt-12">
      <TabsList
        className={`grid w-full bg-transparent p-0 h-auto border-b border-gray-200`}
        style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}
      >
        {tabs.map(tab => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 py-3 px-4 font-medium hover:text-blue-600 transition-colors"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="description" className="p-6 bg-white border-x border-b mt-0">
        <div className="space-y-4">
          <p className="text-base leading-relaxed text-gray-700">{truck.description}</p>
          {truck.detailedDescription && (
            <div
              className="prose-content"
              dangerouslySetInnerHTML={{ __html: truck.detailedDescription }}
            />
          )}
        </div>
      </TabsContent>

      <TabsContent value="specs" className="p-6 bg-white border-x border-b mt-0">
        <div>
          <h4 className="font-bold text-lg bg-gray-100 p-2 rounded mb-3">Thông số kỹ thuật chung</h4>
          <table className="w-full border-collapse border mb-6">
            <tbody>
              {truck.model && (
                <tr className="border-b bg-blue-50">
                  <td className="py-2 px-3 text-gray-600 w-1/3 font-semibold">Model</td>
                  <td className="py-2 px-3 font-bold text-blue-700">{truck.model}</td>
                </tr>
              )}
              <tr className="border-b">
                <td className="py-2 px-3 text-gray-600 w-1/3">Thương hiệu</td>
                <td className="py-2 px-3 font-medium">{Array.isArray(truck.brand) ? truck.brand.join(', ') : truck.brand}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-3 text-gray-600">Tải trọng</td>
                <td className="py-2 px-3 font-medium">{truck.weightText}</td>
              </tr>
              {/* CHỈ hiển thị nếu KHÔNG có trailerSpec.dimensions để tránh duplicate */}
              {!truck.trailerSpec?.dimensions && (
                <tr className="border-b">
                  <td className="py-2 px-3 text-gray-600">Kích thước tổng thể (D×R×C)</td>
                  <td className="py-2 px-3 font-medium">{truck.dimensions}</td>
                </tr>
              )}
              {truck.insideDimension && !truck.trailerSpec?.dimensions && (
                <tr className="border-b">
                  <td className="py-2 px-3 text-gray-600">Kích thước lòng thùng (D×R×C)</td>
                  <td className="py-2 px-3 font-medium">{truck.insideDimension}</td>
                </tr>
              )}
              {truck.wheelbaseText && (
                <tr className="border-b">
                  <td className="py-2 px-3 text-gray-600">Chiều dài cơ sở</td>
                  <td className="py-2 px-3 font-medium">{truck.wheelbaseText}</td>
                </tr>
              )}
              {truck.groundClearance && (
                <tr className="border-b">
                  <td className="py-2 px-3 text-gray-600">Khoảng sáng gầm xe</td>
                  <td className="py-2 px-3 font-medium">{truck.groundClearance} mm</td>
                </tr>
              )}
              {truck.turningRadius !== undefined && truck.turningRadius > 0 && (
                <tr className="border-b">
                  <td className="py-2 px-3 text-gray-600">Bán kính quay vòng tối thiểu</td>
                  <td className="py-2 px-3 font-medium">{truck.turningRadius} m</td>
                </tr>
              )}
              {truck.maxSpeed && (
                <tr className="border-b">
                  <td className="py-2 px-3 text-gray-600">Tốc độ tối đa</td>
                  <td className="py-2 px-3 font-medium">{truck.maxSpeed}</td>
                </tr>
              )}
              {truck.climbingAbility && (
                <tr className="border-b bg-green-50">
                  <td className="py-2 px-3 text-gray-600">Khả năng leo dốc</td>
                  <td className="py-2 px-3 font-medium text-green-700">{truck.climbingAbility}</td>
                </tr>
              )}
              {truck.origin && (
                <tr className="border-b">
                  <td className="py-2 px-3 text-gray-600">Xuất xứ</td>
                  <td className="py-2 px-3 font-medium">{truck.origin}</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Thông số động cơ chi tiết */}
          {(truck.engineModel || truck.engineCapacity || truck.enginePower || truck.engineTorque) && (
            <>
              <h4 className="font-bold text-lg bg-gray-100 p-2 rounded mb-3">Động cơ & Hệ truyền động</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.engineModel && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Mã động cơ</td>
                      <td className="py-2 px-3 font-medium">{truck.engineModel}</td>
                    </tr>
                  )}
                  {truck.engineType && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Loại động cơ</td>
                      <td className="py-2 px-3 font-medium">{truck.engineType}</td>
                    </tr>
                  )}
                  {truck.engineCapacity && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Dung tích xy-lanh</td>
                      <td className="py-2 px-3 font-medium">{truck.engineCapacity}</td>
                    </tr>
                  )}
                  {truck.enginePower && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Công suất cực đại</td>
                      <td className="py-2 px-3 font-medium">{truck.enginePower}</td>
                    </tr>
                  )}
                  {truck.engineTorque && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Mô-men xoắn cực đại</td>
                      <td className="py-2 px-3 font-medium">{truck.engineTorque}</td>
                    </tr>
                  )}
                  {truck.fuel && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Nhiên liệu</td>
                      <td className="py-2 px-3 font-medium">{truck.fuel}</td>
                    </tr>
                  )}
                  {truck.emissionStandard && (
                    <tr className="border-b bg-green-50">
                      <td className="py-2 px-3 text-gray-600">Tiêu chuẩn khí thải</td>
                      <td className="py-2 px-3 font-medium text-green-700">{truck.emissionStandard}</td>
                    </tr>
                  )}
                  {truck.transmission && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Hộp số</td>
                      <td className="py-2 px-3 font-medium">{truck.transmission}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

          {/* Thông số trọng lượng - CHỈ hiển thị nếu KHÔNG có trailerSpec.weight để tránh duplicate */}
          {(truck.kerbWeight || truck.grossWeight) && !truck.trailerSpec?.weight && (
            <>
              <h4 className="font-bold text-lg bg-gray-100 p-2 rounded mb-3">Trọng lượng</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.kerbWeight && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Trọng lượng bản thân</td>
                      <td className="py-2 px-3 font-medium">{truck.kerbWeight}</td>
                    </tr>
                  )}
                  <tr className="border-b">
                    <td className="py-2 px-3 text-gray-600">Tải trọng cho phép chở</td>
                    <td className="py-2 px-3 font-medium">{truck.weightText}</td>
                  </tr>
                  {truck.grossWeight && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Trọng lượng toàn bộ</td>
                      <td className="py-2 px-3 font-medium">{truck.grossWeight}</td>
                    </tr>
                  )}
                  {truck.frontAxleLoad && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Tải trọng cầu trước</td>
                      <td className="py-2 px-3 font-medium">{truck.frontAxleLoad}</td>
                    </tr>
                  )}
                  {truck.rearAxleLoad && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Tải trọng cầu sau</td>
                      <td className="py-2 px-3 font-medium">{truck.rearAxleLoad}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

          {/* Thông số khung gầm, treo, phanh */}
          {(truck.chassisMaterial || truck.frontSuspension || truck.rearSuspension || truck.frontBrake || truck.rearBrake || truck.tires) && (
            <>
              <h4 className="font-bold text-lg bg-gray-100 p-2 rounded mb-3">Khung gầm & Hệ thống treo & Phanh</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.chassisMaterial && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Khung gầm</td>
                      <td className="py-2 px-3 font-medium">{truck.chassisMaterial}</td>
                    </tr>
                  )}
                  {truck.frontSuspension && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Hệ thống treo trước</td>
                      <td className="py-2 px-3 font-medium">{truck.frontSuspension}</td>
                    </tr>
                  )}
                  {truck.rearSuspension && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Hệ thống treo sau</td>
                      <td className="py-2 px-3 font-medium">{truck.rearSuspension}</td>
                    </tr>
                  )}
                  {truck.frontBrake && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Phanh trước</td>
                      <td className="py-2 px-3 font-medium">{truck.frontBrake}</td>
                    </tr>
                  )}
                  {truck.rearBrake && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Phanh sau</td>
                      <td className="py-2 px-3 font-medium">{truck.rearBrake}</td>
                    </tr>
                  )}
                  {truck.brakeSystem && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Hệ thống phanh</td>
                      <td className="py-2 px-3 font-medium">{truck.brakeSystem}</td>
                    </tr>
                  )}
                  {truck.parkingBrake && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Phanh tay</td>
                      <td className="py-2 px-3 font-medium">{truck.parkingBrake}</td>
                    </tr>
                  )}
                  {truck.steeringType && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Hệ thống lái</td>
                      <td className="py-2 px-3 font-medium">{truck.steeringType}</td>
                    </tr>
                  )}
                  {truck.tires && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Lốp xe</td>
                      <td className="py-2 px-3 font-medium">{truck.tires}</td>
                    </tr>
                  )}
                  {truck.driveType && (
                    <tr className="border-b bg-blue-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Hệ dẫn động</td>
                      <td className="py-2 px-3 font-medium text-blue-700">{truck.driveType}</td>
                    </tr>
                  )}
                  {truck.trackWidthFront && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Vệt bánh trước</td>
                      <td className="py-2 px-3 font-medium">{truck.trackWidthFront}</td>
                    </tr>
                  )}
                  {truck.trackWidthRear && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Vệt bánh sau</td>
                      <td className="py-2 px-3 font-medium">{truck.trackWidthRear}</td>
                    </tr>
                  )}
                  {truck.fuelTankCapacity && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Dung tích bình nhiên liệu</td>
                      <td className="py-2 px-3 font-medium">{truck.fuelTankCapacity}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

          {/* Thông số cabin và tiện nghi */}
          {(truck.cabinType || truck.seats || (truck.cabinFeatures && truck.cabinFeatures.length > 0)) && (
            <>
              <h4 className="font-bold text-lg bg-gray-100 p-2 rounded mb-3">Nội thất & Tiện nghi</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.cabinType && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Loại cabin</td>
                      <td className="py-2 px-3 font-medium">{truck.cabinType}</td>
                    </tr>
                  )}
                  {truck.seats && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Số chỗ ngồi</td>
                      <td className="py-2 px-3 font-medium">{truck.seats} chỗ</td>
                    </tr>
                  )}
                </tbody>
              </table>
              {truck.cabinFeatures && truck.cabinFeatures.length > 0 && (
                <div className="mb-6 p-4 border rounded bg-blue-50">
                  <p className="font-medium text-gray-700 mb-2">Trang bị tiện nghi:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {truck.cabinFeatures.map((feature: string, index: number) => (
                      <li key={index} className="text-gray-700">{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

          {/* Thông số bổ sung từ specifications object */}
          {truck.specifications && Object.keys(truck.specifications).length > 0 && (
            <>
              <h4 className="font-bold text-lg bg-gray-100 p-2 rounded mb-3">Thông số khác</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {Object.entries(truck.specifications).map(([key, value]) => {
                    if (!value) return null;
                    // Chuyển đổi key sang tên hiển thị
                    const displayNames: Record<string, string> = {
                      fuelTankCapacity: 'Dung tích bình nhiên liệu',
                      wadingDepth: 'Khả năng lội nước',
                      airIntakePosition: 'Vị trí cổ hút gió',
                      maxSpeed: 'Tốc độ tối đa',
                      fuelConsumption: 'Mức tiêu thụ nhiên liệu',
                      climbingAbility: 'Khả năng leo dốc',
                      oilChangeInterval: 'Chu kỳ thay dầu',
                      electricSystem: 'Hệ thống điện',
                      dumpVolume: 'Thể tích thùng ben',
                      fuelSystem: 'Hệ thống nhiên liệu',
                      pumpCapacity: 'Công suất bơm',
                      maxPressure: 'Áp suất tối đa',
                      tankVolume: 'Dung tích bồn chứa'
                    };
                    const displayName = displayNames[key] || key;
                    return (
                      <tr key={key} className="border-b">
                        <td className="py-2 px-3 text-gray-600 w-1/3">{displayName}</td>
                        <td className="py-2 px-3 font-medium">{String(value)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </>
          )}

          {truck.tractorSpec && (
            <>
              <h4 className="font-bold text-lg bg-gray-100 p-2 rounded mb-3">Thông số đầu kéo</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.tractorSpec.horsepower && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Công suất</td>
                      <td className="py-2 px-3 font-medium">{truck.tractorSpec.horsepower} HP</td>
                    </tr>
                  )}
                  {truck.tractorSpec.torque && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Mô-men xoắn</td>
                      <td className="py-2 px-3 font-medium">{truck.tractorSpec.torque}</td>
                    </tr>
                  )}
                  {truck.tractorSpec.transmission && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Hộp số</td>
                      <td className="py-2 px-3 font-medium">{truck.tractorSpec.transmission}</td>
                    </tr>
                  )}
                  {truck.tractorSpec.transmissionType && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Loại hộp số</td>
                      <td className="py-2 px-3 font-medium">{truck.tractorSpec.transmissionType}</td>
                    </tr>
                  )}
                  {truck.tractorSpec.axleConfiguration && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Công thức bánh xe</td>
                      <td className="py-2 px-3 font-medium">{truck.tractorSpec.axleConfiguration}</td>
                    </tr>
                  )}
                  {truck.tractorSpec.maxTowingCapacityText && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Khả năng kéo tối đa</td>
                      <td className="py-2 px-3 font-medium">{truck.tractorSpec.maxTowingCapacityText}</td>
                    </tr>
                  )}
                  {truck.tractorSpec.designTowingCapacity && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Tải trọng kéo thiết kế</td>
                      <td className="py-2 px-3 font-medium">{truck.tractorSpec.designTowingCapacity}</td>
                    </tr>
                  )}
                  {truck.tractorSpec.kerbWeight && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Khối lượng bản thân</td>
                      <td className="py-2 px-3 font-medium">{truck.tractorSpec.kerbWeight}</td>
                    </tr>
                  )}
                  {truck.tractorSpec.grossWeight && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Khối lượng toàn bộ</td>
                      <td className="py-2 px-3 font-medium">{truck.tractorSpec.grossWeight}</td>
                    </tr>
                  )}
                  {truck.tractorSpec.fifthWheelType && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Mâm kéo</td>
                      <td className="py-2 px-3 font-medium">{truck.tractorSpec.fifthWheelType}</td>
                    </tr>
                  )}
                  {truck.tractorSpec.fifthWheelLoad && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Tải trọng mâm kéo</td>
                      <td className="py-2 px-3 font-medium">{truck.tractorSpec.fifthWheelLoad}</td>
                    </tr>
                  )}
                  {truck.tractorSpec.fuelTankCapacityText && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Dung tích bình nhiên liệu</td>
                      <td className="py-2 px-3 font-medium">{truck.tractorSpec.fuelTankCapacityText}</td>
                    </tr>
                  )}
                  {truck.tractorSpec.cabinType && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Loại cabin</td>
                      <td className="py-2 px-3 font-medium">{truck.tractorSpec.cabinType}</td>
                    </tr>
                  )}
                  {truck.tractorSpec.maxSpeed && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Tốc độ tối đa</td>
                      <td className="py-2 px-3 font-medium">{truck.tractorSpec.maxSpeed}</td>
                    </tr>
                  )}
                  {truck.tractorSpec.climbingAbility && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Khả năng leo dốc</td>
                      <td className="py-2 px-3 font-medium">{truck.tractorSpec.climbingAbility}</td>
                    </tr>
                  )}
                  {truck.tractorSpec.turningRadius && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Bán kính quay vòng</td>
                      <td className="py-2 px-3 font-medium">{truck.tractorSpec.turningRadius}</td>
                    </tr>
                  )}
                  {truck.tractorSpec.brakingSystem && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Hệ thống phanh</td>
                      <td className="py-2 px-3 font-medium">{truck.tractorSpec.brakingSystem}</td>
                    </tr>
                  )}
                  {truck.tractorSpec.frontAxle && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Treo trước</td>
                      <td className="py-2 px-3 font-medium">{truck.tractorSpec.frontAxle}</td>
                    </tr>
                  )}
                  {truck.tractorSpec.rearAxle && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Treo sau</td>
                      <td className="py-2 px-3 font-medium">{truck.tractorSpec.rearAxle}</td>
                    </tr>
                  )}
                  {truck.tractorSpec.trackWidth && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Vết bánh xe</td>
                      <td className="py-2 px-3 font-medium">{truck.tractorSpec.trackWidth}</td>
                    </tr>
                  )}
                  {truck.tractorSpec.frameSpec && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Khung xe</td>
                      <td className="py-2 px-3 font-medium">{truck.tractorSpec.frameSpec}</td>
                    </tr>
                  )}
                  {truck.tractorSpec.electricSystem && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Hệ thống điện</td>
                      <td className="py-2 px-3 font-medium">{truck.tractorSpec.electricSystem}</td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Interior Features */}
              {truck.tractorSpec.interiorFeatures && truck.tractorSpec.interiorFeatures.length > 0 && (
                <>
                  <h4 className="font-bold text-lg bg-gray-100 p-2 rounded mb-3">Tiện nghi nội thất</h4>
                  <div className="mb-6 p-4 border rounded">
                    <ul className="list-disc list-inside space-y-1">
                      {truck.tractorSpec.interiorFeatures.map((feature: string, index: number) => (
                        <li key={index} className="text-gray-700">{feature}</li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </>
          )}

          {truck.trailerSpec && (
            <>
              {/* Nhóm Kích thước */}
              {truck.trailerSpec.dimensions && (
                <>
                  <h4 className="font-bold text-lg bg-gray-100 p-2 rounded mb-3">Kích thước</h4>
                  <table className="w-full border-collapse border mb-6">
                    <tbody>
                      {truck.trailerSpec.dimensions.overallDimensions && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600 w-1/3">Kích thước tổng thể (D x R x C)</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.dimensions.overallDimensions}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.dimensions.containerDimensions && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600">Kích thước lòng thùng</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.dimensions.containerDimensions}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.dimensions.wheelbase && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600">Chiều dài cơ sở</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.dimensions.wheelbase}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.dimensions.capacity && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600">Thể tích thùng</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.dimensions.capacity}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.dimensions.cargoBoxDimensions && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600">Kích thước lòng thùng</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.dimensions.cargoBoxDimensions}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.dimensions.numberOfLevels && (
                        <tr className="border-b bg-blue-50">
                          <td className="py-2 px-3 text-gray-600">Số tầng</td>
                          <td className="py-2 px-3 font-medium text-blue-700">{truck.trailerSpec.dimensions.numberOfLevels}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </>
              )}

              {/* Nhóm Trọng lượng */}
              {truck.trailerSpec.weight && (
                <>
                  <h4 className="font-bold text-lg bg-gray-100 p-2 rounded mb-3">Trọng lượng</h4>
                  <table className="w-full border-collapse border mb-6">
                    <tbody>
                      {truck.trailerSpec.weight.curbWeight && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600 w-1/3">Khối lượng bản thân</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.weight.curbWeight}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.weight.payload && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600">Khối lượng chở cho phép</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.weight.payload}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.weight.grossWeight && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600">Khối lượng toàn bộ</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.weight.grossWeight}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.weight.kingpinLoad && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600">Tải trọng lên chốt kéo</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.weight.kingpinLoad}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </>
              )}

              {/* Nhóm Kết cấu khung */}
              {truck.trailerSpec.chassis && (
                <>
                  <h4 className="font-bold text-lg bg-gray-100 p-2 rounded mb-3">Kết cấu khung</h4>
                  <table className="w-full border-collapse border mb-6">
                    <tbody>
                      {truck.trailerSpec.chassis.mainBeam && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600 w-1/3">Dầm chính</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.chassis.mainBeam}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.chassis.frameMaterial && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600 w-1/3">Vật liệu khung</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.chassis.frameMaterial}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.chassis.landingGear && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600 w-1/3">Chân chống</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.chassis.landingGear}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.chassis.kingpin && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600 w-1/3">Chốt kéo</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.chassis.kingpin}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </>
              )}

              {/* Nhóm Trục và hệ thống treo */}
              {truck.trailerSpec.axleAndSuspension && (
                <>
                  <h4 className="font-bold text-lg bg-gray-100 p-2 rounded mb-3">Trục và hệ thống treo</h4>
                  <table className="w-full border-collapse border mb-6">
                    <tbody>
                      {truck.trailerSpec.axleAndSuspension.axleType && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600 w-1/3">Loại trục</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.axleAndSuspension.axleType}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.axleAndSuspension.axleCount && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600">Số trục</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.axleAndSuspension.axleCount} trục</td>
                        </tr>
                      )}
                      {truck.trailerSpec.axleAndSuspension.liftingAxle && (
                        <tr className="border-b bg-blue-50">
                          <td className="py-2 px-3 text-gray-600">Tính năng đặc biệt</td>
                          <td className="py-2 px-3 font-medium text-blue-700">{truck.trailerSpec.axleAndSuspension.liftingAxle}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.axleAndSuspension.springType && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600">Loại nhíp</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.axleAndSuspension.springType}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.axleAndSuspension.springDimension && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600">Tiết diện lá nhíp</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.axleAndSuspension.springDimension}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.axleAndSuspension.tireSpec && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600">Lốp xe</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.axleAndSuspension.tireSpec}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </>
              )}

              {/* Nhóm Hệ thống */}
              {truck.trailerSpec.systems && (
                <>
                  <h4 className="font-bold text-lg bg-gray-100 p-2 rounded mb-3">Hệ thống</h4>
                  <table className="w-full border-collapse border mb-6">
                    <tbody>
                      {truck.trailerSpec.systems.brakeSystem && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600 w-1/3">Hệ thống phanh</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.systems.brakeSystem}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.systems.electricSystem && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600">Hệ thống điện</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.systems.electricSystem}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.systems.hydraulicSystem && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600">Hệ thống thủy lực</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.systems.hydraulicSystem}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.systems.vacuumPump && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600">Bơm hút chân không</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.systems.vacuumPump}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.systems.pneumaticSystem && (
                        <tr className="border-b bg-green-50">
                          <td className="py-2 px-3 text-gray-600">Hệ thống khí nén</td>
                          <td className="py-2 px-3 font-medium text-green-700">{truck.trailerSpec.systems.pneumaticSystem}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.systems.heatingSystem && (
                        <tr className="border-b bg-orange-50">
                          <td className="py-2 px-3 text-gray-600">Hệ thống gia nhiệt</td>
                          <td className="py-2 px-3 font-medium text-orange-700">{truck.trailerSpec.systems.heatingSystem}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.systems.pumpSystem && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600">Hệ thống bơm</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.systems.pumpSystem}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </>
              )}

              {/* Nhóm Thùng/thân xe */}
              {truck.trailerSpec.body && (
                <>
                  <h4 className="font-bold text-lg bg-gray-100 p-2 rounded mb-3">Thùng/thân xe</h4>
                  <table className="w-full border-collapse border mb-6">
                    <tbody>
                      {truck.trailerSpec.body.frameType && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600 w-1/3">Loại khung</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.body.frameType}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.body.containerLocks && (
                        <tr className="border-b bg-blue-50">
                          <td className="py-2 px-3 text-gray-600 w-1/3">Chốt hãm container</td>
                          <td className="py-2 px-3 font-medium text-blue-700">{truck.trailerSpec.body.containerLocks}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.body.material && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600 w-1/3">Vật liệu thùng</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.body.material}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.body.ramp && (
                        <tr className="border-b bg-green-50">
                          <td className="py-2 px-3 text-gray-600 w-1/3">Cầu dẫn xe</td>
                          <td className="py-2 px-3 font-medium text-green-700">{truck.trailerSpec.body.ramp}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.body.tieDowns && (
                        <tr className="border-b bg-blue-50">
                          <td className="py-2 px-3 text-gray-600 w-1/3">Móc chằng buộc</td>
                          <td className="py-2 px-3 font-medium text-blue-700">{truck.trailerSpec.body.tieDowns}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.body.sideRails && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600 w-1/3">Lan can bảo vệ</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.body.sideRails}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.body.wheelChocks && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600 w-1/3">Chặn bánh xe</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.body.wheelChocks}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.body.insulation && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600 w-1/3">Cách nhiệt</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.body.insulation}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.body.temperatureRange && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600 w-1/3">Dải nhiệt độ</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.body.temperatureRange}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.body.capacity && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600 w-1/3">Dung tích bồn</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.body.capacity}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.body.waveBarrier && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600 w-1/3">Vách chắn sóng</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.body.waveBarrier}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.body.valveSystem && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600 w-1/3">Hệ thống van</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.body.valveSystem}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.body.designPressure && (
                        <tr className="border-b bg-red-50">
                          <td className="py-2 px-3 text-gray-600 w-1/3">Áp suất thiết kế</td>
                          <td className="py-2 px-3 font-medium text-red-700">{truck.trailerSpec.body.designPressure}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.body.testPressure && (
                        <tr className="border-b bg-red-50">
                          <td className="py-2 px-3 text-gray-600 w-1/3">Áp suất thử bền</td>
                          <td className="py-2 px-3 font-medium text-red-700">{truck.trailerSpec.body.testPressure}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.body.compartments && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600 w-1/3">Số khoang</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.body.compartments}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.body.cargoType && (
                        <tr className="border-b bg-amber-50">
                          <td className="py-2 px-3 text-gray-600 w-1/3">Chất chuyên chở</td>
                          <td className="py-2 px-3 font-medium text-amber-700">{truck.trailerSpec.body.cargoType}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.body.floorMaterial && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600 w-1/3">Vật liệu đáy thùng</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.body.floorMaterial}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.body.unloadingSystem && (
                        <tr className="border-b bg-green-50">
                          <td className="py-2 px-3 text-gray-600 w-1/3">Hệ thống xả hàng</td>
                          <td className="py-2 px-3 font-medium text-green-700">{truck.trailerSpec.body.unloadingSystem}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.body.unloadingCapacity && (
                        <tr className="border-b bg-green-50">
                          <td className="py-2 px-3 text-gray-600 w-1/3">Khả năng xả</td>
                          <td className="py-2 px-3 font-medium text-green-700">{truck.trailerSpec.body.unloadingCapacity}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.body.designTemperature && (
                        <tr className="border-b bg-blue-50">
                          <td className="py-2 px-3 text-gray-600 w-1/3">Nhiệt độ thiết kế</td>
                          <td className="py-2 px-3 font-medium text-blue-700">{truck.trailerSpec.body.designTemperature}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.body.operatingTemperature && (
                        <tr className="border-b bg-orange-50">
                          <td className="py-2 px-3 text-gray-600 w-1/3">Nhiệt độ vận hành</td>
                          <td className="py-2 px-3 font-medium text-orange-700">{truck.trailerSpec.body.operatingTemperature}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.body.sideWallMaterial && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600">Vật liệu thành thùng</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.body.sideWallMaterial}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.body.reinforcement && (
                        <tr className="border-b bg-amber-50">
                          <td className="py-2 px-3 text-gray-600">Kết cấu tăng cường</td>
                          <td className="py-2 px-3 font-medium text-amber-700">{truck.trailerSpec.body.reinforcement}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.body.crossBeams && (
                        <tr className="border-b bg-amber-50">
                          <td className="py-2 px-3 text-gray-600">Giàng ngang đáy</td>
                          <td className="py-2 px-3 font-medium text-amber-700">{truck.trailerSpec.body.crossBeams}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </>
              )}

              {/* Nhóm Hoàn thiện */}
              {truck.trailerSpec.finishing && (
                <>
                  <h4 className="font-bold text-lg bg-gray-100 p-2 rounded mb-3">Hoàn thiện</h4>
                  <table className="w-full border-collapse border mb-6">
                    <tbody>
                      {truck.trailerSpec.finishing.paintProcess && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600 w-1/3">Công nghệ sơn</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.finishing.paintProcess}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.finishing.paintColor && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600">Màu sơn</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.finishing.paintColor}</td>
                        </tr>
                      )}
                      {truck.trailerSpec.finishing.warranty && (
                        <tr className="border-b">
                          <td className="py-2 px-3 text-gray-600">Bảo hành</td>
                          <td className="py-2 px-3 font-medium">{truck.trailerSpec.finishing.warranty}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </>
              )}
            </>
          )}

          {truck.craneSpec && (
            <>
              <h4 className="font-bold text-lg bg-gray-100 p-2 rounded mb-3">Thông số cẩu</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.craneSpec.model && (
                    <tr className="border-b bg-blue-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Model cẩu</td>
                      <td className="py-2 px-3 font-medium text-blue-700">{truck.craneSpec.model}</td>
                    </tr>
                  )}
                  {truck.craneSpec.maxLiftingMoment && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Mômen nâng lớn nhất</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.maxLiftingMoment}</td>
                    </tr>
                  )}
                  {truck.craneSpec.maxLiftingCapacity && (
                    <tr className="border-b bg-red-50">
                      <td className="py-2 px-3 text-gray-600">Sức nâng tối đa</td>
                      <td className="py-2 px-3 font-medium text-red-700">{truck.craneSpec.maxLiftingCapacity}</td>
                    </tr>
                  )}
                  {truck.craneSpec.liftingCapacityText && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Sức nâng</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.liftingCapacityText}</td>
                    </tr>
                  )}
                  {truck.craneSpec.maxLiftingHeight && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Chiều cao nâng lớn nhất</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.maxLiftingHeight}</td>
                    </tr>
                  )}
                  {truck.craneSpec.maxWorkingHeight && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Chiều cao làm việc tối đa</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.maxWorkingHeight}</td>
                    </tr>
                  )}
                  {truck.craneSpec.maxWorkingRadius && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Bán kính làm việc</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.maxWorkingRadius}</td>
                    </tr>
                  )}
                  {truck.craneSpec.boomType && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Loại cần</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.boomType}</td>
                    </tr>
                  )}
                  {truck.craneSpec.boomSections && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Số đốt cần</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.boomSections}</td>
                    </tr>
                  )}
                  {truck.craneSpec.boomLength && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Chiều dài cần</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.boomLength}</td>
                    </tr>
                  )}
                  {truck.craneSpec.boomExtensionSpeed && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Tốc độ ra cần</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.boomExtensionSpeed}</td>
                    </tr>
                  )}
                  {truck.craneSpec.boomLuffingSpeed && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Tốc độ quay cần</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.boomLuffingSpeed}</td>
                    </tr>
                  )}
                  {truck.craneSpec.swingAngle && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Góc quay</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.swingAngle}</td>
                    </tr>
                  )}
                  {truck.craneSpec.swingSpeed && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Tốc độ quay cần</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.swingSpeed}</td>
                    </tr>
                  )}
                  {truck.craneSpec.winchRopeType && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Dây cáp</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.winchRopeType}</td>
                    </tr>
                  )}
                  {truck.craneSpec.winchRatedSpeed && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Tốc độ cuộn dây cáp</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.winchRatedSpeed}</td>
                    </tr>
                  )}
                  {truck.craneSpec.hydraulicOilFlow && (
                    <tr className="border-b bg-amber-50">
                      <td className="py-2 px-3 text-gray-600">Lưu lượng dầu bơm</td>
                      <td className="py-2 px-3 font-medium text-amber-700">{truck.craneSpec.hydraulicOilFlow}</td>
                    </tr>
                  )}
                  {truck.craneSpec.hydraulicOperatingPressure && (
                    <tr className="border-b bg-amber-50">
                      <td className="py-2 px-3 text-gray-600">Áp suất dầu thủy lực</td>
                      <td className="py-2 px-3 font-medium text-amber-700">{truck.craneSpec.hydraulicOperatingPressure}</td>
                    </tr>
                  )}
                  {truck.craneSpec.hydraulicTankCapacity && (
                    <tr className="border-b bg-amber-50">
                      <td className="py-2 px-3 text-gray-600">Dung tích thùng dầu</td>
                      <td className="py-2 px-3 font-medium text-amber-700">{truck.craneSpec.hydraulicTankCapacity}</td>
                    </tr>
                  )}
                  {truck.craneSpec.hydraulicPumpType && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Loại bơm thủy lực</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.hydraulicPumpType}</td>
                    </tr>
                  )}
                  {truck.craneSpec.outriggersFrontExtension && (
                    <tr className="border-b bg-green-50">
                      <td className="py-2 px-3 text-gray-600">Chiều rộng chân chống trước</td>
                      <td className="py-2 px-3 font-medium text-green-700">{truck.craneSpec.outriggersFrontExtension}</td>
                    </tr>
                  )}
                  {truck.craneSpec.outriggersRearExtension && (
                    <tr className="border-b bg-green-50">
                      <td className="py-2 px-3 text-gray-600">Chiều rộng chân chống sau</td>
                      <td className="py-2 px-3 font-medium text-green-700">{truck.craneSpec.outriggersRearExtension}</td>
                    </tr>
                  )}
                  {truck.craneSpec.outriggersType && (
                    <tr className="border-b bg-green-50">
                      <td className="py-2 px-3 text-gray-600">Kiểu chân chống</td>
                      <td className="py-2 px-3 font-medium text-green-700">{truck.craneSpec.outriggersType}</td>
                    </tr>
                  )}
                  {truck.craneSpec.controlSystem && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Hệ thống điều khiển</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.controlSystem}</td>
                    </tr>
                  )}
                  {truck.craneSpec.safetyFeatures && (
                    <tr className="border-b bg-red-50">
                      <td className="py-2 px-3 text-gray-600">Tính năng an toàn</td>
                      <td className="py-2 px-3 font-medium text-red-700">{truck.craneSpec.safetyFeatures}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

          {truck.tankSpec && (
            <>
              <h4 className="font-bold text-lg bg-purple-100 p-2 rounded mb-3 text-purple-800">Thông số bồn xitec</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.tankSpec.capacity && (
                    <tr className="border-b bg-purple-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Dung tích bồn</td>
                      <td className="py-2 px-3 font-medium text-purple-700">{truck.tankSpec.capacity}</td>
                    </tr>
                  )}
                  {truck.tankSpec.material && (
                    <tr className="border-b bg-purple-50">
                      <td className="py-2 px-3 text-gray-600">Vật liệu bồn</td>
                      <td className="py-2 px-3 font-medium text-purple-700">{truck.tankSpec.material}</td>
                    </tr>
                  )}
                  {truck.tankSpec.thickness && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Độ dày thành bồn</td>
                      <td className="py-2 px-3 font-medium">{truck.tankSpec.thickness}</td>
                    </tr>
                  )}
                  {truck.tankSpec.tankDimension && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Kích thước bồn</td>
                      <td className="py-2 px-3 font-medium">{truck.tankSpec.tankDimension}</td>
                    </tr>
                  )}
                  {truck.tankSpec.designPressure && (
                    <tr className="border-b bg-amber-50">
                      <td className="py-2 px-3 text-gray-600">Áp suất thiết kế</td>
                      <td className="py-2 px-3 font-medium text-amber-700">{truck.tankSpec.designPressure}</td>
                    </tr>
                  )}
                  {truck.tankSpec.testPressure && (
                    <tr className="border-b bg-amber-50">
                      <td className="py-2 px-3 text-gray-600">Áp suất thử</td>
                      <td className="py-2 px-3 font-medium text-amber-700">{truck.tankSpec.testPressure}</td>
                    </tr>
                  )}
                  {truck.tankSpec.workingTemperature && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Nhiệt độ làm việc</td>
                      <td className="py-2 px-3 font-medium">{truck.tankSpec.workingTemperature}</td>
                    </tr>
                  )}
                  {truck.tankSpec.baffles && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Tấm chắn sóng</td>
                      <td className="py-2 px-3 font-medium">{truck.tankSpec.baffles}</td>
                    </tr>
                  )}
                  {truck.tankSpec.manholeSize && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Đường kính lỗ đôm</td>
                      <td className="py-2 px-3 font-medium">{truck.tankSpec.manholeSize}</td>
                    </tr>
                  )}
                  {truck.tankSpec.pumpType && (
                    <tr className="border-b bg-blue-50">
                      <td className="py-2 px-3 text-gray-600">Loại bơm</td>
                      <td className="py-2 px-3 font-medium text-blue-700">{truck.tankSpec.pumpType}</td>
                    </tr>
                  )}
                  {truck.tankSpec.pumpFlowRate && (
                    <tr className="border-b bg-blue-50">
                      <td className="py-2 px-3 text-gray-600">Lưu lượng bơm</td>
                      <td className="py-2 px-3 font-medium text-blue-700">{truck.tankSpec.pumpFlowRate}</td>
                    </tr>
                  )}
                  {truck.tankSpec.dischargePipe && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Đường ống xả</td>
                      <td className="py-2 px-3 font-medium">{truck.tankSpec.dischargePipe}</td>
                    </tr>
                  )}
                  {truck.tankSpec.valveType && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Loại van</td>
                      <td className="py-2 px-3 font-medium">{truck.tankSpec.valveType}</td>
                    </tr>
                  )}
                  {truck.tankSpec.flowMeter && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Đồng hồ đo lưu lượng</td>
                      <td className="py-2 px-3 font-medium">{truck.tankSpec.flowMeter}</td>
                    </tr>
                  )}
                  {truck.tankSpec.safetyFeatures && (
                    <tr className="border-b bg-red-50">
                      <td className="py-2 px-3 text-gray-600">Tính năng an toàn</td>
                      <td className="py-2 px-3 font-medium text-red-700">{truck.tankSpec.safetyFeatures}</td>
                    </tr>
                  )}
                  {truck.tankSpec.certifications && (
                    <tr className="border-b bg-green-50">
                      <td className="py-2 px-3 text-gray-600">Tiêu chuẩn chứng nhận</td>
                      <td className="py-2 px-3 font-medium text-green-700">{truck.tankSpec.certifications}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

          {truck.glassRackSpec && (
            <>
              <h4 className="font-bold text-lg bg-sky-100 p-2 rounded mb-3 text-sky-800">Thông số giá chở kính chữ A</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.glassRackSpec.rackType && (
                    <tr className="border-b bg-sky-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Loại giá</td>
                      <td className="py-2 px-3 font-medium text-sky-700">{truck.glassRackSpec.rackType}</td>
                    </tr>
                  )}
                  {truck.glassRackSpec.rackDimension && (
                    <tr className="border-b bg-sky-50">
                      <td className="py-2 px-3 text-gray-600">Kích thước giá</td>
                      <td className="py-2 px-3 font-medium text-sky-700">{truck.glassRackSpec.rackDimension}</td>
                    </tr>
                  )}
                  {truck.glassRackSpec.rackMaterial && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Vật liệu khung</td>
                      <td className="py-2 px-3 font-medium">{truck.glassRackSpec.rackMaterial}</td>
                    </tr>
                  )}
                  {truck.glassRackSpec.surfaceFinish && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Xử lý bề mặt</td>
                      <td className="py-2 px-3 font-medium">{truck.glassRackSpec.surfaceFinish}</td>
                    </tr>
                  )}
                  {truck.glassRackSpec.rackAngle && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Góc nghiêng giá</td>
                      <td className="py-2 px-3 font-medium">{truck.glassRackSpec.rackAngle}</td>
                    </tr>
                  )}
                  {truck.glassRackSpec.loadCapacityPerSide && (
                    <tr className="border-b bg-amber-50">
                      <td className="py-2 px-3 text-gray-600">Tải trọng mỗi bên</td>
                      <td className="py-2 px-3 font-medium text-amber-700">{truck.glassRackSpec.loadCapacityPerSide}</td>
                    </tr>
                  )}
                  {truck.glassRackSpec.maxGlassSize && (
                    <tr className="border-b bg-amber-50">
                      <td className="py-2 px-3 text-gray-600">Kích thước kính tối đa</td>
                      <td className="py-2 px-3 font-medium text-amber-700">{truck.glassRackSpec.maxGlassSize}</td>
                    </tr>
                  )}
                  {truck.glassRackSpec.paddingMaterial && (
                    <tr className="border-b bg-green-50">
                      <td className="py-2 px-3 text-gray-600">Vật liệu lót đệm</td>
                      <td className="py-2 px-3 font-medium text-green-700">{truck.glassRackSpec.paddingMaterial}</td>
                    </tr>
                  )}
                  {truck.glassRackSpec.separatorMaterial && (
                    <tr className="border-b bg-green-50">
                      <td className="py-2 px-3 text-gray-600">Vật liệu ngăn cách</td>
                      <td className="py-2 px-3 font-medium text-green-700">{truck.glassRackSpec.separatorMaterial}</td>
                    </tr>
                  )}
                  {truck.glassRackSpec.strapType && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Loại dây đai</td>
                      <td className="py-2 px-3 font-medium">{truck.glassRackSpec.strapType}</td>
                    </tr>
                  )}
                  {truck.glassRackSpec.strapQuantity && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Số lượng dây đai</td>
                      <td className="py-2 px-3 font-medium">{truck.glassRackSpec.strapQuantity}</td>
                    </tr>
                  )}
                  {truck.glassRackSpec.tieDownPoints && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Số điểm neo</td>
                      <td className="py-2 px-3 font-medium">{truck.glassRackSpec.tieDownPoints}</td>
                    </tr>
                  )}
                  {truck.glassRackSpec.crossBracing && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Thanh giằng chéo</td>
                      <td className="py-2 px-3 font-medium">{truck.glassRackSpec.crossBracing}</td>
                    </tr>
                  )}
                  {truck.glassRackSpec.endStops && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Thanh chắn đầu/cuối</td>
                      <td className="py-2 px-3 font-medium">{truck.glassRackSpec.endStops}</td>
                    </tr>
                  )}
                  {truck.glassRackSpec.certifications && (
                    <tr className="border-b bg-blue-50">
                      <td className="py-2 px-3 text-gray-600">Chứng nhận</td>
                      <td className="py-2 px-3 font-medium text-blue-700">{truck.glassRackSpec.certifications}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

          {truck.coolingBox && (
            <>
              <h4 className="font-bold text-lg bg-gray-100 p-2 rounded mb-3">Thông số làm lạnh</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.coolingBox.temperatureRange && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Phạm vi nhiệt độ</td>
                      <td className="py-2 px-3 font-medium">{truck.coolingBox.temperatureRange}</td>
                    </tr>
                  )}
                  {truck.coolingBox.coolingUnit && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Đơn vị làm lạnh</td>
                      <td className="py-2 px-3 font-medium">{truck.coolingBox.coolingUnit}</td>
                    </tr>
                  )}
                  {truck.coolingBox.insulationThickness && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Độ dày cách nhiệt</td>
                      <td className="py-2 px-3 font-medium">{truck.coolingBox.insulationThickness}</td>
                    </tr>
                  )}
                  {truck.coolingBox.wallMaterials && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Vật liệu vách</td>
                      <td className="py-2 px-3 font-medium">{truck.coolingBox.wallMaterials.join(', ')}</td>
                    </tr>
                  )}
                  {truck.coolingBox.doorType && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Loại cửa</td>
                      <td className="py-2 px-3 font-medium">{truck.coolingBox.doorType}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

          {truck.insulatedBox && renderSpecTable(truck.insulatedBox, 'Thông số thùng bảo ôn')}
          {truck.closedBox && renderSpecTable(truck.closedBox, 'Thông số thùng kín')}
          {truck.tarpaulinBox && renderSpecTable(truck.tarpaulinBox, 'Thông số thùng bạt')}

          {truck.flatbedBox && (
            <>
              <h4 className="font-bold text-lg bg-gray-100 p-2 rounded mb-3">Thông số thùng lửng</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.flatbedBox.floorMaterial && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Vật liệu sàn</td>
                      <td className="py-2 px-3 font-medium">{truck.flatbedBox.floorMaterial}</td>
                    </tr>
                  )}
                  {truck.flatbedBox.floorThickness && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Độ dày sàn</td>
                      <td className="py-2 px-3 font-medium">{truck.flatbedBox.floorThickness}</td>
                    </tr>
                  )}
                  {truck.flatbedBox.sideHeight && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Chiều cao thành bên</td>
                      <td className="py-2 px-3 font-medium">{truck.flatbedBox.sideHeight}</td>
                    </tr>
                  )}
                  {truck.flatbedBox.sideType && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Loại thành bên</td>
                      <td className="py-2 px-3 font-medium">{truck.flatbedBox.sideType}</td>
                    </tr>
                  )}
                  {truck.flatbedBox.sideAccess && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Khả năng bốc dỡ</td>
                      <td className="py-2 px-3 font-medium">{truck.flatbedBox.sideAccess}</td>
                    </tr>
                  )}
                  {truck.flatbedBox.reinforcement && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Gia cường</td>
                      <td className="py-2 px-3 font-medium">{truck.flatbedBox.reinforcement}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

          {truck.tailLift && (
            <>
              <h4 className="font-bold text-lg bg-blue-100 p-2 rounded mb-3 text-blue-800">Thông số bửng nâng</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.tailLift.type && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Loại bửng nâng</td>
                      <td className="py-2 px-3 font-medium">{truck.tailLift.type}</td>
                    </tr>
                  )}
                  {truck.tailLift.liftCapacity && (
                    <tr className="border-b bg-blue-50">
                      <td className="py-2 px-3 text-gray-600">Sức nâng</td>
                      <td className="py-2 px-3 font-medium text-blue-700">{truck.tailLift.liftCapacity}</td>
                    </tr>
                  )}
                  {truck.tailLift.platformSize && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Kích thước mặt bàn</td>
                      <td className="py-2 px-3 font-medium">{truck.tailLift.platformSize}</td>
                    </tr>
                  )}
                  {truck.tailLift.liftHeight && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Chiều cao nâng</td>
                      <td className="py-2 px-3 font-medium">{truck.tailLift.liftHeight}</td>
                    </tr>
                  )}
                  {truck.tailLift.powerSource && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Nguồn điện</td>
                      <td className="py-2 px-3 font-medium">{truck.tailLift.powerSource}</td>
                    </tr>
                  )}
                  {truck.tailLift.controlSystem && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Hệ thống điều khiển</td>
                      <td className="py-2 px-3 font-medium">{truck.tailLift.controlSystem}</td>
                    </tr>
                  )}
                  {truck.tailLift.liftTime && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Thời gian nâng/hạ</td>
                      <td className="py-2 px-3 font-medium">{truck.tailLift.liftTime}</td>
                    </tr>
                  )}
                  {truck.tailLift.hydraulicPump && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Bơm thủy lực</td>
                      <td className="py-2 px-3 font-medium">{truck.tailLift.hydraulicPump}</td>
                    </tr>
                  )}
                  {truck.tailLift.hydraulicFluid && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Dầu thủy lực</td>
                      <td className="py-2 px-3 font-medium">{truck.tailLift.hydraulicFluid}</td>
                    </tr>
                  )}
                  {truck.tailLift.safetyFeatures && (
                    <tr className="border-b bg-green-50">
                      <td className="py-2 px-3 text-gray-600">Tính năng an toàn</td>
                      <td className="py-2 px-3 font-medium text-green-700">{truck.tailLift.safetyFeatures}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

          {truck.palletSystem && (
            <>
              <h4 className="font-bold text-lg bg-purple-100 p-2 rounded mb-3 text-purple-800">Hệ thống chở pallet</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.palletSystem.rollerSystem && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Hệ thống con lăn</td>
                      <td className="py-2 px-3 font-medium">{truck.palletSystem.rollerSystem}</td>
                    </tr>
                  )}
                  {truck.palletSystem.rollerMaterial && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Vật liệu con lăn</td>
                      <td className="py-2 px-3 font-medium">{truck.palletSystem.rollerMaterial}</td>
                    </tr>
                  )}
                  {truck.palletSystem.palletCapacity && (
                    <tr className="border-b bg-purple-50">
                      <td className="py-2 px-3 text-gray-600">Sức chứa pallet</td>
                      <td className="py-2 px-3 font-medium text-purple-700">{truck.palletSystem.palletCapacity}</td>
                    </tr>
                  )}
                  {truck.palletSystem.palletAnchors && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Móc neo pallet</td>
                      <td className="py-2 px-3 font-medium">{truck.palletSystem.palletAnchors}</td>
                    </tr>
                  )}
                  {truck.palletSystem.palletStops && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Thanh chắn pallet</td>
                      <td className="py-2 px-3 font-medium">{truck.palletSystem.palletStops}</td>
                    </tr>
                  )}
                  {truck.palletSystem.antiStatic && (
                    <tr className="border-b bg-yellow-50">
                      <td className="py-2 px-3 text-gray-600">Chống tĩnh điện ESD</td>
                      <td className="py-2 px-3 font-medium text-yellow-700">{truck.palletSystem.antiStatic}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

          {truck.wingBoxSystem && (
            <>
              <h4 className="font-bold text-lg bg-orange-100 p-2 rounded mb-3 text-orange-800">Hệ thống cánh dơi</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.wingBoxSystem.wingType && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Loại cánh</td>
                      <td className="py-2 px-3 font-medium">{truck.wingBoxSystem.wingType}</td>
                    </tr>
                  )}
                  {truck.wingBoxSystem.openingAngle && (
                    <tr className="border-b bg-orange-50">
                      <td className="py-2 px-3 text-gray-600">Góc mở cánh</td>
                      <td className="py-2 px-3 font-medium text-orange-700">{truck.wingBoxSystem.openingAngle}</td>
                    </tr>
                  )}
                  {truck.wingBoxSystem.hydraulicCylinder && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Xi lanh thủy lực</td>
                      <td className="py-2 px-3 font-medium">{truck.wingBoxSystem.hydraulicCylinder}</td>
                    </tr>
                  )}
                  {truck.wingBoxSystem.hydraulicPump && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Bơm thủy lực</td>
                      <td className="py-2 px-3 font-medium">{truck.wingBoxSystem.hydraulicPump}</td>
                    </tr>
                  )}
                  {truck.wingBoxSystem.controlSystem && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Hệ thống điều khiển</td>
                      <td className="py-2 px-3 font-medium">{truck.wingBoxSystem.controlSystem}</td>
                    </tr>
                  )}
                  {truck.wingBoxSystem.openingTime && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Thời gian mở/đóng</td>
                      <td className="py-2 px-3 font-medium">{truck.wingBoxSystem.openingTime}</td>
                    </tr>
                  )}
                  {truck.wingBoxSystem.safetyFeatures && (
                    <tr className="border-b bg-green-50">
                      <td className="py-2 px-3 text-gray-600">Tính năng an toàn</td>
                      <td className="py-2 px-3 font-medium text-green-700">{truck.wingBoxSystem.safetyFeatures}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

          {truck.crateSystem && (
            <>
              <h4 className="font-bold text-lg bg-amber-100 p-2 rounded mb-3 text-amber-800">Hệ thống chở két chai</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.crateSystem.crateCapacity && (
                    <tr className="border-b bg-amber-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Sức chứa két</td>
                      <td className="py-2 px-3 font-medium text-amber-700">{truck.crateSystem.crateCapacity}</td>
                    </tr>
                  )}
                  {truck.crateSystem.stackingHeight && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Chiều cao xếp</td>
                      <td className="py-2 px-3 font-medium">{truck.crateSystem.stackingHeight}</td>
                    </tr>
                  )}
                  {truck.crateSystem.antiSlipFloor && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Sàn chống trượt</td>
                      <td className="py-2 px-3 font-medium">{truck.crateSystem.antiSlipFloor}</td>
                    </tr>
                  )}
                  {truck.crateSystem.retainingBars && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Thanh chắn giữ hàng</td>
                      <td className="py-2 px-3 font-medium">{truck.crateSystem.retainingBars}</td>
                    </tr>
                  )}
                  {truck.crateSystem.ventilation && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Thông gió</td>
                      <td className="py-2 px-3 font-medium">{truck.crateSystem.ventilation}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

          {truck.compactorSystem && (
            <>
              <h4 className="font-bold text-lg bg-green-100 p-2 rounded mb-3 text-green-800">Hệ thống cuốn ép rác</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.compactorSystem.compactorCapacity && (
                    <tr className="border-b bg-green-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Dung tích thùng ép</td>
                      <td className="py-2 px-3 font-medium text-green-700">{truck.compactorSystem.compactorCapacity}</td>
                    </tr>
                  )}
                  {truck.compactorSystem.compressionRatio && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Tỷ lệ ép</td>
                      <td className="py-2 px-3 font-medium">{truck.compactorSystem.compressionRatio}</td>
                    </tr>
                  )}
                  {truck.compactorSystem.maxPressure && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Áp suất ép tối đa</td>
                      <td className="py-2 px-3 font-medium">{truck.compactorSystem.maxPressure}</td>
                    </tr>
                  )}
                  {truck.compactorSystem.hydraulicPump && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Bơm thủy lực</td>
                      <td className="py-2 px-3 font-medium">{truck.compactorSystem.hydraulicPump}</td>
                    </tr>
                  )}
                  {truck.compactorSystem.leachateCapacity && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Bồn chứa nước rác</td>
                      <td className="py-2 px-3 font-medium">{truck.compactorSystem.leachateCapacity}</td>
                    </tr>
                  )}
                  {truck.compactorSystem.controlSystem && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Hệ thống điều khiển</td>
                      <td className="py-2 px-3 font-medium">{truck.compactorSystem.controlSystem}</td>
                    </tr>
                  )}
                  {truck.compactorSystem.safetyFeatures && (
                    <tr className="border-b bg-yellow-50">
                      <td className="py-2 px-3 text-gray-600">Tính năng an toàn</td>
                      <td className="py-2 px-3 font-medium text-yellow-700">{truck.compactorSystem.safetyFeatures}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

          {truck.motorcycleCarrierSystem && (
            <>
              <h4 className="font-bold text-lg bg-red-100 p-2 rounded mb-3 text-red-800">Hệ thống chở mô tô xe máy</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.motorcycleCarrierSystem.deckLayout && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Cấu trúc thùng</td>
                      <td className="py-2 px-3 font-medium">{truck.motorcycleCarrierSystem.deckLayout}</td>
                    </tr>
                  )}
                  {truck.motorcycleCarrierSystem.deckDimensions && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Kích thước mỗi tầng</td>
                      <td className="py-2 px-3 font-medium">{truck.motorcycleCarrierSystem.deckDimensions}</td>
                    </tr>
                  )}
                  {truck.motorcycleCarrierSystem.motorcycleCapacity && (
                    <tr className="border-b bg-red-50">
                      <td className="py-2 px-3 text-gray-600">Sức chứa xe máy</td>
                      <td className="py-2 px-3 font-medium text-red-700">{truck.motorcycleCarrierSystem.motorcycleCapacity}</td>
                    </tr>
                  )}
                  {truck.motorcycleCarrierSystem.liftCapacity && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Bửng nâng</td>
                      <td className="py-2 px-3 font-medium">{truck.motorcycleCarrierSystem.liftCapacity}</td>
                    </tr>
                  )}
                  {truck.motorcycleCarrierSystem.liftPlatformSize && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Kích thước mặt bửng</td>
                      <td className="py-2 px-3 font-medium">{truck.motorcycleCarrierSystem.liftPlatformSize}</td>
                    </tr>
                  )}
                  {truck.motorcycleCarrierSystem.tieDownSystem && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Hệ thống chằng buộc</td>
                      <td className="py-2 px-3 font-medium">{truck.motorcycleCarrierSystem.tieDownSystem}</td>
                    </tr>
                  )}
                  {truck.motorcycleCarrierSystem.antiSlipFloor && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Sàn chống trượt</td>
                      <td className="py-2 px-3 font-medium">{truck.motorcycleCarrierSystem.antiSlipFloor}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

          {truck.drillingSystem && (
            <>
              <h4 className="font-bold text-lg bg-orange-100 p-2 rounded mb-3 text-orange-800">Thông số hệ thống khoan</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.drillingSystem.maxDiameter && (
                    <tr className="border-b bg-orange-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Đường kính khoan tối đa</td>
                      <td className="py-2 px-3 font-medium text-orange-700">{truck.drillingSystem.maxDiameter}</td>
                    </tr>
                  )}
                  {truck.drillingSystem.maxDepth && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Độ sâu khoan tối đa</td>
                      <td className="py-2 px-3 font-medium">{truck.drillingSystem.maxDepth}</td>
                    </tr>
                  )}
                  {truck.drillingSystem.maxTorque && (
                    <tr className="border-b bg-orange-50">
                      <td className="py-2 px-3 text-gray-600">Mô-men xoắn tối đa</td>
                      <td className="py-2 px-3 font-medium text-orange-700">{truck.drillingSystem.maxTorque}</td>
                    </tr>
                  )}
                  {truck.drillingSystem.rotationSpeed && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Tốc độ quay</td>
                      <td className="py-2 px-3 font-medium">{truck.drillingSystem.rotationSpeed}</td>
                    </tr>
                  )}
                  {truck.drillingSystem.crowdForce && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Lực đẩy xuống</td>
                      <td className="py-2 px-3 font-medium">{truck.drillingSystem.crowdForce}</td>
                    </tr>
                  )}
                  {truck.drillingSystem.pullbackForce && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Lực kéo lên</td>
                      <td className="py-2 px-3 font-medium">{truck.drillingSystem.pullbackForce}</td>
                    </tr>
                  )}
                  {truck.drillingSystem.kellyBarType && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Loại cần Kelly</td>
                      <td className="py-2 px-3 font-medium">{truck.drillingSystem.kellyBarType}</td>
                    </tr>
                  )}
                  {truck.drillingSystem.hydraulicPressure && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Áp suất thủy lực</td>
                      <td className="py-2 px-3 font-medium">{truck.drillingSystem.hydraulicPressure}</td>
                    </tr>
                  )}
                  {truck.drillingSystem.feedStroke && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Hành trình đẩy</td>
                      <td className="py-2 px-3 font-medium">{truck.drillingSystem.feedStroke}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

          {truck.ladderSystem && (
            <>
              <h4 className="font-bold text-lg bg-red-100 p-2 rounded mb-3 text-red-800">Hệ thống thang cứu hộ</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.ladderSystem.maxHeight && (
                    <tr className="border-b bg-red-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Chiều cao nâng tối đa</td>
                      <td className="py-2 px-3 font-medium text-red-700">{truck.ladderSystem.maxHeight}</td>
                    </tr>
                  )}
                  {truck.ladderSystem.maxRadius && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Bán kính làm việc</td>
                      <td className="py-2 px-3 font-medium">{truck.ladderSystem.maxRadius}</td>
                    </tr>
                  )}
                  {truck.ladderSystem.elevationAngle && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Góc nâng thang</td>
                      <td className="py-2 px-3 font-medium">{truck.ladderSystem.elevationAngle}</td>
                    </tr>
                  )}
                  {truck.ladderSystem.rotationAngle && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Góc quay thang</td>
                      <td className="py-2 px-3 font-medium">{truck.ladderSystem.rotationAngle}</td>
                    </tr>
                  )}
                  {truck.ladderSystem.ladderSections && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Số đốt thang</td>
                      <td className="py-2 px-3 font-medium">{truck.ladderSystem.ladderSections}</td>
                    </tr>
                  )}
                  {truck.ladderSystem.basketCapacity && (
                    <tr className="border-b bg-red-50">
                      <td className="py-2 px-3 text-gray-600">Sức nâng giỏ</td>
                      <td className="py-2 px-3 font-medium text-red-700">{truck.ladderSystem.basketCapacity}</td>
                    </tr>
                  )}
                  {truck.ladderSystem.basketControls && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Điều khiển giỏ</td>
                      <td className="py-2 px-3 font-medium">{truck.ladderSystem.basketControls}</td>
                    </tr>
                  )}
                  {truck.ladderSystem.outriggerSpan && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Khẩu độ chân chống</td>
                      <td className="py-2 px-3 font-medium">{truck.ladderSystem.outriggerSpan}</td>
                    </tr>
                  )}
                  {truck.ladderSystem.groundSlope && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Độ nghiêng mặt đất cho phép</td>
                      <td className="py-2 px-3 font-medium">{truck.ladderSystem.groundSlope}</td>
                    </tr>
                  )}
                  {truck.ladderSystem.hydraulicPressure && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Áp suất thủy lực</td>
                      <td className="py-2 px-3 font-medium">{truck.ladderSystem.hydraulicPressure}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

          {truck.wireDispenserId && (
            <>
              <h4 className="font-bold text-lg bg-green-100 p-2 rounded mb-3 text-green-800">Hệ thống rải dây thép gai</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.wireDispenserId.deploymentSpeed && (
                    <tr className="border-b bg-green-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Tốc độ rải</td>
                      <td className="py-2 px-3 font-medium text-green-700">{truck.wireDispenserId.deploymentSpeed}</td>
                    </tr>
                  )}
                  {truck.wireDispenserId.wireCapacity && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Sức chứa cuộn dây</td>
                      <td className="py-2 px-3 font-medium">{truck.wireDispenserId.wireCapacity}</td>
                    </tr>
                  )}
                  {truck.wireDispenserId.wireTypes && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Loại dây tương thích</td>
                      <td className="py-2 px-3 font-medium">{truck.wireDispenserId.wireTypes}</td>
                    </tr>
                  )}
                  {truck.wireDispenserId.barrierLayers && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Số lớp hàng rào</td>
                      <td className="py-2 px-3 font-medium">{truck.wireDispenserId.barrierLayers}</td>
                    </tr>
                  )}
                  {truck.wireDispenserId.barrierHeight && (
                    <tr className="border-b bg-green-50">
                      <td className="py-2 px-3 text-gray-600">Chiều cao hàng rào</td>
                      <td className="py-2 px-3 font-medium text-green-700">{truck.wireDispenserId.barrierHeight}</td>
                    </tr>
                  )}
                  {truck.wireDispenserId.hydraulicWinches && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Tời thủy lực</td>
                      <td className="py-2 px-3 font-medium">{truck.wireDispenserId.hydraulicWinches}</td>
                    </tr>
                  )}
                  {truck.wireDispenserId.controlSystem && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Hệ thống điều khiển</td>
                      <td className="py-2 px-3 font-medium">{truck.wireDispenserId.controlSystem}</td>
                    </tr>
                  )}
                  {truck.wireDispenserId.workLights && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Đèn công tác</td>
                      <td className="py-2 px-3 font-medium">{truck.wireDispenserId.workLights}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

          {truck.aerialPlatformSpec && (
            <>
              <h4 className="font-bold text-lg bg-cyan-100 p-2 rounded mb-3 text-cyan-800">Hệ thống nâng người</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.aerialPlatformSpec.workingHeight && (
                    <tr className="border-b bg-cyan-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Chiều cao làm việc</td>
                      <td className="py-2 px-3 font-medium text-cyan-700">{truck.aerialPlatformSpec.workingHeight}</td>
                    </tr>
                  )}
                  {truck.aerialPlatformSpec.horizontalReach && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Tầm vươn ngang</td>
                      <td className="py-2 px-3 font-medium">{truck.aerialPlatformSpec.horizontalReach}</td>
                    </tr>
                  )}
                  {truck.aerialPlatformSpec.platformCapacity && (
                    <tr className="border-b bg-cyan-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Tải trọng giỏ</td>
                      <td className="py-2 px-3 font-medium text-cyan-700">{truck.aerialPlatformSpec.platformCapacity}</td>
                    </tr>
                  )}
                  {truck.aerialPlatformSpec.platformSize && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Kích thước giỏ</td>
                      <td className="py-2 px-3 font-medium">{truck.aerialPlatformSpec.platformSize}</td>
                    </tr>
                  )}
                  {truck.aerialPlatformSpec.boomElevation && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Góc nâng boom</td>
                      <td className="py-2 px-3 font-medium">{truck.aerialPlatformSpec.boomElevation}</td>
                    </tr>
                  )}
                  {truck.aerialPlatformSpec.slewing && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Góc quay</td>
                      <td className="py-2 px-3 font-medium">{truck.aerialPlatformSpec.slewing}</td>
                    </tr>
                  )}
                  {truck.aerialPlatformSpec.boomType && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Loại boom</td>
                      <td className="py-2 px-3 font-medium">{truck.aerialPlatformSpec.boomType}</td>
                    </tr>
                  )}
                  {truck.aerialPlatformSpec.insulationRating && (
                    <tr className="border-b bg-cyan-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Cách điện</td>
                      <td className="py-2 px-3 font-medium text-cyan-700">{truck.aerialPlatformSpec.insulationRating}</td>
                    </tr>
                  )}
                  {truck.aerialPlatformSpec.outriggerSpan && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Khẩu độ chân chống</td>
                      <td className="py-2 px-3 font-medium">{truck.aerialPlatformSpec.outriggerSpan}</td>
                    </tr>
                  )}
                  {truck.aerialPlatformSpec.controlSystem && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Hệ thống điều khiển</td>
                      <td className="py-2 px-3 font-medium">{truck.aerialPlatformSpec.controlSystem}</td>
                    </tr>
                  )}
                  {truck.aerialPlatformSpec.safetyFeatures && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Tính năng an toàn</td>
                      <td className="py-2 px-3 font-medium">{truck.aerialPlatformSpec.safetyFeatures}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

          {truck.vacuumSystem && (
            <>
              <h4 className="font-bold text-lg bg-amber-100 p-2 rounded mb-3 text-amber-800">Hệ thống hút chân không</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.vacuumSystem.tankCapacity && (
                    <tr className="border-b bg-amber-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Dung tích bồn</td>
                      <td className="py-2 px-3 font-medium text-amber-700">{truck.vacuumSystem.tankCapacity}</td>
                    </tr>
                  )}
                  {truck.vacuumSystem.vacuumLevel && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Độ chân không</td>
                      <td className="py-2 px-3 font-medium">{truck.vacuumSystem.vacuumLevel}</td>
                    </tr>
                  )}
                  {truck.vacuumSystem.airFlowRate && (
                    <tr className="border-b bg-amber-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Lưu lượng khí</td>
                      <td className="py-2 px-3 font-medium text-amber-700">{truck.vacuumSystem.airFlowRate}</td>
                    </tr>
                  )}
                  {truck.vacuumSystem.vacuumPump && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Bơm chân không</td>
                      <td className="py-2 px-3 font-medium">{truck.vacuumSystem.vacuumPump}</td>
                    </tr>
                  )}
                  {truck.vacuumSystem.pumpDrive && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Dẫn động bơm</td>
                      <td className="py-2 px-3 font-medium">{truck.vacuumSystem.pumpDrive}</td>
                    </tr>
                  )}
                  {truck.vacuumSystem.filterType && (
                    <tr className="border-b bg-amber-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Loại lọc</td>
                      <td className="py-2 px-3 font-medium text-amber-700">{truck.vacuumSystem.filterType}</td>
                    </tr>
                  )}
                  {truck.vacuumSystem.filterStages && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Số tầng lọc</td>
                      <td className="py-2 px-3 font-medium">{truck.vacuumSystem.filterStages}</td>
                    </tr>
                  )}
                  {truck.vacuumSystem.filterArea && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Diện tích lọc</td>
                      <td className="py-2 px-3 font-medium">{truck.vacuumSystem.filterArea}</td>
                    </tr>
                  )}
                  {truck.vacuumSystem.filterCleaning && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Làm sạch lọc</td>
                      <td className="py-2 px-3 font-medium">{truck.vacuumSystem.filterCleaning}</td>
                    </tr>
                  )}
                  {truck.vacuumSystem.tankMaterial && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Vật liệu bồn</td>
                      <td className="py-2 px-3 font-medium">{truck.vacuumSystem.tankMaterial}</td>
                    </tr>
                  )}
                  {truck.vacuumSystem.tankDimensions && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Kích thước bồn</td>
                      <td className="py-2 px-3 font-medium">{truck.vacuumSystem.tankDimensions}</td>
                    </tr>
                  )}
                  {truck.vacuumSystem.suctionDistance && (
                    <tr className="border-b bg-amber-50">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Khoảng cách hút</td>
                      <td className="py-2 px-3 font-medium text-amber-700">{truck.vacuumSystem.suctionDistance}</td>
                    </tr>
                  )}
                  {truck.vacuumSystem.fillTime && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Thời gian hút đầy</td>
                      <td className="py-2 px-3 font-medium">{truck.vacuumSystem.fillTime}</td>
                    </tr>
                  )}
                  {truck.vacuumSystem.blowbackPressure && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Áp suất đẩy ngược</td>
                      <td className="py-2 px-3 font-medium">{truck.vacuumSystem.blowbackPressure}</td>
                    </tr>
                  )}
                  {truck.vacuumSystem.dischargeDoor && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Cửa xả</td>
                      <td className="py-2 px-3 font-medium">{truck.vacuumSystem.dischargeDoor}</td>
                    </tr>
                  )}
                  {truck.vacuumSystem.liftingAngle && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Góc nâng bồn</td>
                      <td className="py-2 px-3 font-medium">{truck.vacuumSystem.liftingAngle}</td>
                    </tr>
                  )}
                  {truck.vacuumSystem.suctionHose && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Ống hút</td>
                      <td className="py-2 px-3 font-medium">{truck.vacuumSystem.suctionHose}</td>
                    </tr>
                  )}
                  {truck.vacuumSystem.hoseReel && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Tời cuộn ống</td>
                      <td className="py-2 px-3 font-medium">{truck.vacuumSystem.hoseReel}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}
        </div>
      </TabsContent>

      <TabsContent value="contact" className="p-6 bg-white border-x border-b mt-0">
        <ContactForm productName={truck.name} />
      </TabsContent>
    </Tabs>
  );
};

export default ProductDetailTabs;
