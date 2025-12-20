import React, { useState, useEffect } from 'react';
import VehicleTypeTabs from './VehicleTypeTabs';
import FilterSidebar from '../FilterSidebar';
import VehicleGrid from './VehicleGrid';
import { Truck, TruckFilters, VehicleType } from '@/models/TruckTypes';
import { useVehicleFiltering } from '@/hooks/useVehicleFiltering';
import { getBoxTypeSlug } from '@/utils/slugify';

interface CatalogPageProps {
  initialVehicles: Truck[];
  initialSearchQuery?: string;
}

const CatalogPage: React.FC<CatalogPageProps> = ({ initialVehicles, initialSearchQuery = '' }) => {
  const [selectedType, setSelectedType] = useState<VehicleType | null>(null);
  const [filters, setFilters] = useState<TruckFilters>({
    brand: null,
    minPrice: null,
    maxPrice: null,
    minWeight: null,
    maxWeight: null,
    vehicleType: null,
    search: initialSearchQuery || null,
    boxType: null
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const typeParam = params.get('type') as VehicleType | null;
      const brandParam = params.get('brand');
      const searchParam = params.get('search') || params.get('q');
      const minWeightParam = params.get('minWeight');
      const maxWeightParam = params.get('maxWeight');
      const boxTypeParam = params.get('boxType');

      if (typeParam) {
        setSelectedType(typeParam);
        setFilters(prev => ({ ...prev, vehicleType: typeParam }));
      }

      if (brandParam) {
        setFilters(prev => ({ ...prev, brand: brandParam }));
      }

      if (searchParam) {
        setFilters(prev => ({ ...prev, search: searchParam }));
      }

      if (minWeightParam && maxWeightParam) {
        const minWeight = parseFloat(minWeightParam);
        const maxWeight = parseFloat(maxWeightParam);
        if (!isNaN(minWeight) && !isNaN(maxWeight)) {
          setFilters(prev => ({
            ...prev,
            minWeight: minWeight,
            maxWeight: maxWeight
          }));
        }
      }

      // Đọc boxType từ URL (đã là slug không dấu)
      if (boxTypeParam) {
        setFilters(prev => ({ ...prev, boxType: boxTypeParam }));
      }
    }
  }, []);

  const handleTypeChange = (type: VehicleType) => {
    setSelectedType(type);
    // Xóa boxType khi chuyển sang loại xe khác - người dùng sẽ chọn lại danh mục con nếu cần
    setFilters(prev => ({ ...prev, vehicleType: type, boxType: null }));

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      params.set('type', type);
      // Xóa boxType khỏi URL khi chuyển tab
      params.delete('boxType');
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.pushState({}, '', newUrl);
    }
  };

  const handleFilterChange = (keyOrFilters: keyof TruckFilters | TruckFilters, value?: any) => {
    let newFilters: TruckFilters;

    if (typeof keyOrFilters === 'object') {
      newFilters = { ...keyOrFilters };
    } else {
      newFilters = { ...filters, [keyOrFilters]: value };
    }

    setFilters(newFilters);

    // Sync selectedType with vehicleType from filters
    if (newFilters.vehicleType !== selectedType) {
      setSelectedType(newFilters.vehicleType);
    }

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams();

      if (newFilters.vehicleType) params.set('type', newFilters.vehicleType);
      if (newFilters.brand) params.set('brand', newFilters.brand);
      if (newFilters.search) params.set('search', newFilters.search);
      if (newFilters.minWeight !== null && newFilters.maxWeight !== null) {
        params.set('minWeight', String(newFilters.minWeight));
        params.set('maxWeight', String(newFilters.maxWeight));
      }
      if (newFilters.boxType) params.set('boxType', newFilters.boxType);

      const newUrl = params.toString()
        ? `${window.location.pathname}?${params.toString()}`
        : window.location.pathname;
      window.history.pushState({}, '', newUrl);
    }
  };

  const handleResetFilters = () => {
    const emptyFilters: TruckFilters = {
      brand: null,
      minPrice: null,
      maxPrice: null,
      minWeight: null,
      maxWeight: null,
      vehicleType: null,
      search: null,
      boxType: null
    };
    setFilters(emptyFilters);
    setSelectedType(null);

    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', window.location.pathname);
    }
  };

  const { filteredVehicles } = useVehicleFiltering(initialVehicles, selectedType, {
    brand: filters.brand,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    minWeight: filters.minWeight,
    maxWeight: filters.maxWeight,
    search: filters.search,
    boxType: filters.boxType
  });

  return (
    <>
      <VehicleTypeTabs
        selectedType={selectedType}
        onTypeChange={handleTypeChange}
      />

      <div className="flex flex-col lg:flex-row gap-6 mt-8">
        <aside className="lg:w-64 flex-shrink-0">
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            vehicles={filteredVehicles}
          />
        </aside>

        <main className="flex-1">
          <VehicleGrid
            vehicles={filteredVehicles}
            initialVehicles={initialVehicles}
            onResetFilters={handleResetFilters}
          />
        </main>
      </div>
    </>
  );
};

export default CatalogPage;
