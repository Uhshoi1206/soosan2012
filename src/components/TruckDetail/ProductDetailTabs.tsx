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
      fuelTankCapacity: 'Dung tích bình nhiên liệu'
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
              {truck.turningRadius && (
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
                      <td className="py-2 px-3 text-gray-600">Hệ thống treo trước</td>
                      <td className="py-2 px-3 font-medium">{truck.frontSuspension}</td>
                    </tr>
                  )}
                  {truck.rearSuspension && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Hệ thống treo sau</td>
                      <td className="py-2 px-3 font-medium">{truck.rearSuspension}</td>
                    </tr>
                  )}
                  {truck.frontBrake && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Phanh trước</td>
                      <td className="py-2 px-3 font-medium">{truck.frontBrake}</td>
                    </tr>
                  )}
                  {truck.rearBrake && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Phanh sau</td>
                      <td className="py-2 px-3 font-medium">{truck.rearBrake}</td>
                    </tr>
                  )}
                  {truck.brakeSystem && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Hệ thống phanh</td>
                      <td className="py-2 px-3 font-medium">{truck.brakeSystem}</td>
                    </tr>
                  )}
                  {truck.parkingBrake && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Phanh tay</td>
                      <td className="py-2 px-3 font-medium">{truck.parkingBrake}</td>
                    </tr>
                  )}
                  {truck.steeringType && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Hệ thống lái</td>
                      <td className="py-2 px-3 font-medium">{truck.steeringType}</td>
                    </tr>
                  )}
                  {truck.tires && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Lốp xe</td>
                      <td className="py-2 px-3 font-medium">{truck.tires}</td>
                    </tr>
                  )}
                  {truck.driveType && (
                    <tr className="border-b bg-blue-50">
                      <td className="py-2 px-3 text-gray-600">Hệ dẫn động</td>
                      <td className="py-2 px-3 font-medium text-blue-700">{truck.driveType}</td>
                    </tr>
                  )}
                  {truck.trackWidthFront && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Vệt bánh trước</td>
                      <td className="py-2 px-3 font-medium">{truck.trackWidthFront}</td>
                    </tr>
                  )}
                  {truck.trackWidthRear && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Vệt bánh sau</td>
                      <td className="py-2 px-3 font-medium">{truck.trackWidthRear}</td>
                    </tr>
                  )}
                  {truck.fuelTankCapacity && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Dung tích bình nhiên liệu</td>
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
                  {truck.craneSpec.liftingCapacityText && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Sức nâng</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.liftingCapacityText}</td>
                    </tr>
                  )}
                  {truck.craneSpec.maxLiftingMoment && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Moment nâng lớn nhất</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.maxLiftingMoment}</td>
                    </tr>
                  )}
                  {truck.craneSpec.maxLiftingHeight && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Chiều cao nâng lớn nhất</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.maxLiftingHeight}</td>
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
                  {truck.craneSpec.boomLength && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Chiều dài cần</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.boomLength}</td>
                    </tr>
                  )}
                  {truck.craneSpec.hydraulicPumpType && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Loại bơm thủy lực</td>
                      <td className="py-2 px-3 font-medium">{truck.craneSpec.hydraulicPumpType}</td>
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

          {truck.tankSpec && (
            <>
              <h4 className="font-bold text-lg bg-gray-100 p-2 rounded mb-3">Thông số bồn xi téc</h4>
              <table className="w-full border-collapse border mb-6">
                <tbody>
                  {truck.tankSpec.capacityText && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600 w-1/3">Dung tích</td>
                      <td className="py-2 px-3 font-medium">{truck.tankSpec.capacityText}</td>
                    </tr>
                  )}
                  {truck.tankSpec.compartments && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Số ngăn</td>
                      <td className="py-2 px-3 font-medium">{truck.tankSpec.compartments}</td>
                    </tr>
                  )}
                  {truck.tankSpec.material && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Vật liệu</td>
                      <td className="py-2 px-3 font-medium">{truck.tankSpec.material}</td>
                    </tr>
                  )}
                  {truck.tankSpec.thickness && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Độ dày</td>
                      <td className="py-2 px-3 font-medium">{truck.tankSpec.thickness}</td>
                    </tr>
                  )}
                  {truck.tankSpec.safetyEquipment && (
                    <tr className="border-b">
                      <td className="py-2 px-3 text-gray-600">Thiết bị an toàn</td>
                      <td className="py-2 px-3 font-medium">{truck.tankSpec.safetyEquipment}</td>
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
