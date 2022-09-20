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
    GROUP_DEFAULT_ACTIVE,
    GROUP_DEFAULT_AVAILABLE_SEARCH,
    GROUP_DEFAULT_AVAILABLE_SORT,
    GROUP_DEFAULT_PAGE,
    GROUP_DEFAULT_PER_PAGE,
    GROUP_DEFAULT_SORT
} from "../constant/group.list.constant";


export class GroupListDto implements PaginationListAbstract {
    @PaginationSearch(GROUP_DEFAULT_AVAILABLE_SEARCH)
    readonly search: Record<string, any>;

    @PaginationAvailableSearch(GROUP_DEFAULT_AVAILABLE_SEARCH)
    readonly availableSearch: string[];

    @PaginationPage(GROUP_DEFAULT_PAGE)
    readonly page: number;

    @PaginationPerPage(GROUP_DEFAULT_PER_PAGE)
    readonly perPage: number;

    @PaginationSort(GROUP_DEFAULT_SORT, GROUP_DEFAULT_AVAILABLE_SORT)
    readonly sort: IPaginationSort;

    @PaginationAvailableSort(GROUP_DEFAULT_AVAILABLE_SORT)
    readonly availableSort: string[];

    @PaginationFilterBoolean(GROUP_DEFAULT_ACTIVE)
    readonly isActive: boolean[];
}
