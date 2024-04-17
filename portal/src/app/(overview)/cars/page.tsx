import { SearchCarParams, SearchParams } from '@/lib/defines';
import React from 'react';
import SortSelect from '@/components/cars/sort-select';
import FilterModal from '@/components/cars/filter-modal';
import { fetchCarList } from '@/lib/actions';
import CarList from '@/components/cars/car-list';
import ToggleView from '@/components/cars/toggle-view';
import ListPagination from '@/components/cars/list-pagination';

export default async function CarListPage({
    searchParams,
}: Readonly<{ searchParams: SearchCarParams }>) {
    const { cars, pageMeta } = await fetchCarList(searchParams);


    return (
        <>
            <div className="flex justify-between">
                <div className="flex gap-2">
                    <FilterModal />
                    <SortSelect sort={searchParams[SearchParams.SORT]} />
                </div>
                <ToggleView />
            </div>
            
            <div className="mx-3 mt-5 font-semibold text-slate-700">
                {pageMeta.totalElements > 0 &&
                    `${pageMeta.totalElements} results found`}
            </div>
            <CarList cars={cars} mode={searchParams[SearchParams.MODE]} />
            <ListPagination meta={pageMeta} />
        </>
    );
}
