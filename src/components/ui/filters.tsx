import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { X, Filter } from "lucide-react";

export interface FilterState {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  inStockOnly: boolean;
}

interface FiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  availableCategories: string[];
  availableBrands: string[];
  priceRange: [number, number];
}

export function Filters({
  filters,
  onFiltersChange,
  availableCategories,
  availableBrands,
  priceRange
}: FiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const updateFilters = (updates: Partial<FilterState>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const clearFilters = () => {
    onFiltersChange({
      categories: [],
      brands: [],
      priceRange: priceRange,
      inStockOnly: false
    });
  };

  const hasActiveFilters = 
    filters.categories.length > 0 ||
    filters.brands.length > 0 ||
    filters.priceRange[0] !== priceRange[0] ||
    filters.priceRange[1] !== priceRange[1] ||
    filters.inStockOnly;

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Active Filters</span>
          <Button variant="outline" size="sm" onClick={clearFilters}>
            <X className="h-3 w-3 mr-1" />
            Clear All
          </Button>
        </div>
      )}

      {/* Price Range */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm">Price Range</h4>
        <div className="px-2">
          <Slider
            value={filters.priceRange}
            onValueChange={(value) => updateFilters({ priceRange: value as [number, number] })}
            max={priceRange[1]}
            min={priceRange[0]}
            step={10000}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>₦{filters.priceRange[0].toLocaleString()}</span>
            <span>₦{filters.priceRange[1].toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm">Categories</h4>
        <div className="space-y-2">
          {availableCategories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category}`}
                checked={filters.categories.includes(category)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    updateFilters({ categories: [...filters.categories, category] });
                  } else {
                    updateFilters({ 
                      categories: filters.categories.filter(c => c !== category) 
                    });
                  }
                }}
              />
              <label
                htmlFor={`category-${category}`}
                className="text-sm cursor-pointer flex-1"
              >
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm">Brands</h4>
        <div className="space-y-2">
          {availableBrands.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={filters.brands.includes(brand)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    updateFilters({ brands: [...filters.brands, brand] });
                  } else {
                    updateFilters({ 
                      brands: filters.brands.filter(b => b !== brand) 
                    });
                  }
                }}
              />
              <label
                htmlFor={`brand-${brand}`}
                className="text-sm cursor-pointer flex-1"
              >
                {brand}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Stock Filter */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="in-stock"
            checked={filters.inStockOnly}
            onCheckedChange={(checked) => updateFilters({ inStockOnly: !!checked })}
          />
          <label htmlFor="in-stock" className="text-sm cursor-pointer">
            In Stock Only
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full justify-between"
        >
          <div className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2">
                {filters.categories.length + filters.brands.length + 
                 (filters.inStockOnly ? 1 : 0) + 
                 (filters.priceRange[0] !== priceRange[0] || filters.priceRange[1] !== priceRange[1] ? 1 : 0)}
              </Badge>
            )}
          </div>
        </Button>
        
        {isOpen && (
          <Card className="mt-2">
            <CardContent className="p-4">
              <FilterContent />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Desktop Filters */}
      <Card className="hidden lg:block sticky top-20">
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <FilterContent />
        </CardContent>
      </Card>
    </>
  );
}