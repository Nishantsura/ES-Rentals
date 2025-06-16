'use client'

import { useCallback, useReducer, memo, useRef, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface FilterModalProps {
  onFiltersChange: (filters: FilterValues) => void;
  shouldReset?: boolean;
}

export interface FilterValues {
  maxPrice: number;
  transmission: string;
  types: string[];
  tags: string[];
}

const transmissionOptions = ["Automatic", "Manual"] as const;
const carTypes = ["SUV", "Sedan", "Hatchback", "Coupe", "Convertible", "Wagon"] as const;
const carTags = ["Luxury", "Sports", "Family", "Economy", "Off-Road", "Business"] as const;

interface FilterState extends FilterValues {
  open: boolean;
}

type FilterAction = 
  | { type: 'SET_MAX_PRICE'; payload: number }
  | { type: 'SET_TRANSMISSION'; payload: string }
  | { type: 'SET_TYPES'; payload: string[] }
  | { type: 'SET_TAGS'; payload: string[] }
  | { type: 'RESET' }
  | { type: 'SET_OPEN'; payload: boolean };

const initialState: FilterState = {
  open: false,
  maxPrice: 15000,
  transmission: "",
  types: [],
  tags: [],
};

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case 'SET_MAX_PRICE':
      return { ...state, maxPrice: action.payload };
    case 'SET_TRANSMISSION':
      return { ...state, transmission: action.payload };
    case 'SET_TYPES':
      return { ...state, types: action.payload };
    case 'SET_TAGS':
      return { ...state, tags: action.payload };
    case 'RESET':
      return { ...initialState, open: state.open };
    case 'SET_OPEN':
      return { ...state, open: action.payload };
    default:
      return state;
  }
}

function useDebounce<Args extends any[]>(
  callback: (...args: Args) => void,
  delay: number
): (...args: Args) => void {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  return useCallback(
    (...args: Args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
}

const FilterModalComponent = memo(({ onFiltersChange, shouldReset }: FilterModalProps) => {
  const [state, dispatch] = useReducer(filterReducer, initialState);

  useEffect(() => {
    if (shouldReset) {
      dispatch({ type: 'RESET' });
    }
  }, [shouldReset]);

  const debouncedPriceChange = useDebounce<[number]>((value: number) => {
    dispatch({ type: 'SET_MAX_PRICE', payload: value });
  }, 300);

  const handlePriceChange = useCallback((value: number[]) => {
    debouncedPriceChange(value[0]);
  }, [debouncedPriceChange]);

  const handleTransmissionChange = useCallback((value: string) => {
    dispatch({ type: 'SET_TRANSMISSION', payload: value });
  }, []);

  const handleTypesChange = useCallback((value: string[]) => {
    dispatch({ type: 'SET_TYPES', payload: value });
  }, []);

  const handleTagsChange = useCallback((value: string[]) => {
    dispatch({ type: 'SET_TAGS', payload: value });
  }, []);

  const handleApplyFilters = useCallback(() => {
    const { open: _open, ...filters } = state;
    onFiltersChange(filters);
    dispatch({ type: 'SET_OPEN', payload: false });
  }, [state, onFiltersChange]);

  const handleReset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);


  return (
    <Dialog open={state.open} onOpenChange={(open) => dispatch({ type: 'SET_OPEN', payload: open })}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
          </svg>
         <span className='hidden md:inline'> Filters</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filter Vehicles</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Maximum Price (AED)</Label>
            <Slider
              defaultValue={[state.maxPrice]}
              min={1000}
              max={15000}
              step={500}
              onValueChange={handlePriceChange}
              className="w-full [&_[role=slider]]:bg-indigo-600 [&_[role=track]]:bg-indigo-100"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>AED 1,000</span>
              <span>AED {state.maxPrice}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Transmission</Label>
            <Select
              value={state.transmission}
              onValueChange={handleTransmissionChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select transmission" />
              </SelectTrigger>
              <SelectContent>
                {transmissionOptions.map((option) => (
                  <SelectItem 
                    key={option} 
                    value={option.toLowerCase()}
                  >
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Car Types</Label>
            <div className="flex flex-wrap gap-2">
              {carTypes.map((type) => (
                <Button
                  key={type}
                  variant={state.types.includes(type.toLowerCase()) ? "default" : "outline"}
                  onClick={() => {
                    const newTypes = state.types.includes(type.toLowerCase())
                      ? state.types.filter((t) => t !== type.toLowerCase())
                      : [...state.types, type.toLowerCase()];
                    handleTypesChange(newTypes);
                  }}
                  className={`
                    ${state.types.includes(type.toLowerCase())
                      ? 'bg-indigo-600 text-white'
                      : 'hover:bg-indigo-50'
                    }
                  `}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Features</Label>
            <div className="flex flex-wrap gap-2">
              {carTags.map((tag) => (
                <Button
                  key={tag}
                  variant={state.tags.includes(tag.toLowerCase()) ? "default" : "outline"}
                  onClick={() => {
                    const newTags = state.tags.includes(tag.toLowerCase())
                      ? state.tags.filter((t) => t !== tag.toLowerCase())
                      : [...state.tags, tag.toLowerCase()];
                    handleTagsChange(newTags);
                  }}
                  className={`
                    ${state.tags.includes(tag.toLowerCase())
                      ? 'bg-indigo-600 text-white'
                      : 'hover:bg-indigo-50'
                    }
                  `}
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleReset}
          >
            Reset
          </Button>
          <Button
            onClick={handleApplyFilters}
            className="bg-indigo-600"
          >
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

FilterModalComponent.displayName = 'FilterModal';
export const FilterModal = FilterModalComponent;
