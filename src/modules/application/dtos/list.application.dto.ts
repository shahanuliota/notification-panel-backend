import {PaginationListAbstract} from 'src/common/pagination/abstracts/pagination.abstract';
import {
    PaginationAvailableSearch,
    PaginationAvailableSort,
    PaginationFilterBoolean,
    PaginationPage,
    PaginationPerPage,
    PaginationSearch,
    PaginationSort,
} from 'src/common/pagination/decorators/pagination.decorator';
import {IPaginationSort} from 'src/common/pagination/pagination.interface';
import {
    APPLICATION_DEFAULT_ACTIVE,
    APPLICATION_DEFAULT_AVAILABLE_SEARCH,
    APPLICATION_DEFAULT_AVAILABLE_SORT,
    APPLICATION_DEFAULT_PAGE,
    APPLICATION_DEFAULT_PER_PAGE,
    APPLICATION_DEFAULT_SORT
} from "../constant/application.list.constant";


export class ListApplicationDto implements PaginationListAbstract {
    @PaginationSearch(APPLICATION_DEFAULT_AVAILABLE_SEARCH)
    readonly search: Record<string, any>;

    @PaginationAvailableSearch(APPLICATION_DEFAULT_AVAILABLE_SEARCH)
    readonly availableSearch: string[];

    @PaginationPage(APPLICATION_DEFAULT_PAGE)
    readonly page: number;

    @PaginationPerPage(APPLICATION_DEFAULT_PER_PAGE)
    readonly perPage: number;

    @PaginationSort(APPLICATION_DEFAULT_SORT, APPLICATION_DEFAULT_AVAILABLE_SORT)
    readonly sort: IPaginationSort;

    @PaginationAvailableSort(APPLICATION_DEFAULT_AVAILABLE_SORT)
    readonly availableSort: string[];

    @PaginationFilterBoolean(APPLICATION_DEFAULT_ACTIVE)
    readonly isActive: boolean[];
}
